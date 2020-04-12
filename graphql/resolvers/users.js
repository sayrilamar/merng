const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../../config");

module.exports = {
    Mutation: {
        async register(_, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword
            }
        }, context, info) {
            // validate user data. Make sure user doesn't already exist hash password and
            // create auth token
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createAt: new Date().toISOString()
            });

            const result = await newUser.save();
            const token = jwt.sign({
                id: result.id,
                email: result.email,
                username: result.username
            }, SECRET_KEY, {expiresIn: "1h"});

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};
