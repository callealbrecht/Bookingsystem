//DEN HÄR FILEN FUNGERAR SOM REQUEST LISTENER TILL ALLA REQUESTS SOM RIKTAS MOT localhost:8080/products
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/booking');
const Advert = require('../models/advert');
const advert = require('../models/advert');
const checkAuth = require('../middleware/check-auth');

//eventlistener för GET requests
router.get('/', checkAuth, (req, res, next) => {
    Advert.find()
        .populate('Advert')
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
        .populate('Advert')
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
    const advert = new Advert({
        _id: new mongoose.Types.ObjectId(),
        cabin: req.body.cabin,
        from: req.body.from,
        to: req.body.to,
        owner: req.body.owner,
        email: req.authToken.email
    });

    advert.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Advert successfully created!",
                advert: advert
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
    Advert.findById(req.params.id).exec()
        .then(document => {
            if (document.email == req.authToken.email) {
                Advert.remove({ _id: req.params.id }).exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Advert deleted",
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
    Advert.findById(req.params.id).exec()
        .then(document => {
            if (document.email == req.authToken.email) {
                Advert.update({ _id: req.params.id }, { $set: req.body })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Advert updated!"
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