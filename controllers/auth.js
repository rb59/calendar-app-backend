const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

const createUser = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({email});
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
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }  
};

const loginUser = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

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


        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }  
};

const renewToken = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'renew',
    });
};

module.exports = {
    createUser,
    loginUser,
    renewToken,
};
