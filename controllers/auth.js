const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { jwtGenerator } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already registered',
            });
        }
        user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generate Web Token
        const token = await jwtGenerator(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }
};

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No such email registered',
            });
        }

        // Match passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect password',
            });
        }

        // Generate Web Token
        const token = await jwtGenerator(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }
};

const renewToken = async (req, res = response) => {
    const { uid, name } = req;
    const token = await jwtGenerator(uid, name);
    res.json({
        ok: true,
        token,
        uid,
        name,
    });
};

module.exports = {
    createUser,
    loginUser,
    renewToken,
};
