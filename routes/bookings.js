//DEN HÄR FILEN FUNGERAR SOM REQUEST LISTENER TILL ALLA REQUESTS SOM RIKTAS MOT localhost:8080/products
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/booking');
const Cabin = require('../models/cabin');
const checkAuth = require('../middleware/check-auth');

//eventlistener för GET requests
router.get('/', checkAuth, (req, res, next) => {
    Booking.find()
        .populate('Cabin')
        .exec()
        .then(documents => {
            res.status(200).json(documents);
        })
        .catch(error => {
            console.log(error);
            const err = new Error(error);
            err.status = error.status || 500;

            next(err);
        });
});


//eventlistener för GET requests
router.get('/:id', checkAuth, (req, res, next) => {

    const id = req.params.id;

    Booking.findById(id)
        .populate('Cabin')
        .exec()
        .then(document => {
            res.status(200).json(document);
        })
        .catch(error => {
            console.log(error);
            const err = new Error(error);
            err.status = error.status || 500;

            next(err);
        });
});

//eventlistener för POST requests
router.post('/', checkAuth, (req, res, next) => {
    const booking = new Booking({
        _id: new mongoose.Types.ObjectId(),
        cabin: req.body.cabin,
        from: req.body.from,
        to: req.body.to,
        email: req.authToken.email
    });

    booking.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Booking successfully created!",
                booking: booking
            });
        })
        .catch(error => {
            console.log(error);
            const err = new Error(error);
            err.status = error.status || 500;

            next(err);
        });

});

//eventlistener för DELETE requests
router.delete('/:id', checkAuth, (req, res, next) => {
    Booking.findById(req.params.id).exec()
        .then(document => {
            if (document.email == req.authToken.email) {
                Booking.remove({ _id: req.params.id }).exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Booking deleted",
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        const err = new Error(error);
                        err.status = error.status || 500;

                        next(err);
                    });
            } else {
                res.status(500).json({
                    message: "Email is wrong",
                })
            }
        });
});

//eventlistener för PATCH requests
router.patch('/:id', checkAuth, (req, res, next) => {
    Booking.findById(req.params.id).exec()
        .then(document => {
            if (document.email == req.authToken.email) {
                Booking.update({ _id: req.params.id }, { $set: req.body })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "booking updated!"
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        const err = new Error(error);
                        err.status = error.status || 500;

                        next(err);
                    });
            } else {
                res.status(500).json({
                    message: "Email is wrong",
                })
            }
        });
});

//Om ett/en HTTP-kommando/typ som inte stöds emottagits genererar vi ett error-objekt och
//skickar det vidare till "fellyssnarfunktionen" (rad 27 i app.js) som tar hand om felmeddelanden
router.use((req, res, next) => {
    const error = new Error("Only GET, POST, PUT, DELETE commands supported");
    error.status = 500;
    next(error);
});

module.exports = router;