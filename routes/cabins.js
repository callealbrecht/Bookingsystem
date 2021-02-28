//DEN HÄR FILEN FUNGERAR SOM REQUEST LISTENER TILL ALLA REQUESTS SOM RIKTAS MOT localhost:8080/cabin
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cabin = require('../models/cabin');
const checkAuth = require('../middleware/check-auth');


//eventlistener för GET requests
router.get('/', checkAuth, (req, res, next) => {
    Cabin.find().exec()
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

    Cabin.findById(id).exec()
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
    const cabin = new Cabin({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        owner: req.body.owner,
        from: req.body.from,
        to: req.body.to,
        beds: req.body.beds,
        sauna: req.body.sauna,
        beach: req.body.beach,
        email: req.authToken.email
    });

    cabin.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Room successfully created!",
                cabin: cabin
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
    Cabin.findById(req.params.id).exec()
        .then(document => {
            if (document.email == req.authToken.email) {

                Cabin.remove({ _id: req.params.id }).exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Cabin deleted",
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
    Cabin.findById(req.params.id).exec()
        .then(document => {
            if (document.email == req.authToken.email) {
                Cabin.update({ _id: req.params.id }, { $set: req.body })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Room updated!"
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
                    message: "email is wrong",
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