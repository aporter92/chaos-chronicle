const Express = require('express');
const router = Express.Router();
const { UniqueConstraintError } = require("sequelize");
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ! Register
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

// ! Login
router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
    let loginUser = await UserModel.findOne({
        where: {
        email: email,
        },
    });
    if (loginUser) {
        let passwordComparison = await bcrypt.compare(
        password,
        loginUser.password
        );

        if (passwordComparison) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24,
        });

        res.status(200).json({
            message: "User successfully logged in!",
            token
        });
        } else {
        res.status(401).json({
            message: "Incorrect email or password",
        });
        }
    } else {
        res.status(401).json({
        message: "Incorrect email or password",
        });
    }
    } catch (error) {
    res.status(500).json({
        message: "Failed to log user in",
    });
    }
});


module.exports = router;