const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find().exec()
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

router.post('/signup', (req, res, next) => {

    password: bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({
                message: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "user registered"
                    });
                })
                .catch(error => {
                    console.log(error);
                    const err = new Error(error);
                    err.status = error.status || 500;
                    next(err);
                });
        }


    });

});

router.post('/login', (req, res, next) => {

    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: "Authentication fail (check your email and password)"
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: "Authentication fail (check your email and password2)"
                        });
                    } else if (result) {

                        // generera en jtw för users
                        const token = jwt.sign({
                                email: user[0].email,
                                userId: user[0]._id
                            },
                            "secret", { expiresIn: "10h" });

                        res.status(200).json({
                            message: "authentication successful",
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            message: "authentication failed"
                        });
                    }
                })
            }
        })
        .catch();
});

module.exports = router;