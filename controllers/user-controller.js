const Express = require('express');
const router = Express.Router();
const { UniqueConstraintError } = require("sequelize");
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res)=> {
    let {firstName, email, password, admin} = req.body;
    try {
        const User = await UserModel.create({
            firstName,
            email,
            password: bcrypt.hashSync(password, 10),
            admin
        });
        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24,
        });
        res.status(201).json({
            message: "User successfully registered",
            user: User,
            token,
        });
    } catch (err) {
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
        message: "Email/Username already in use",
        });
    } else {
        res.status(500).json({
        message: `Failed to register user: ${err}`,
        });
    }
    }
});

module.exports = router;