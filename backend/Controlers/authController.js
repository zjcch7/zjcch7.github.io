const User = require('../models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/CustomError')
const jwt = require('jsonwebtoken');
const util = require('util');
const sendEmail = require('../Utils/email');
const crypto = require('crypto');
const express = require('express');
const app = express();

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}


app.use((req, res, next) => {
    console.log(req.body);
    next();
});


exports.signup = asyncErrorHandler(async(req, res, next) => {
    // Log the incoming request body
    console.log('Received request data:', req.body);
    try {
        const existingUser = await User.findOne({ name: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username must be unique.' });
        }

        console.log('About to create a new user with the following data: ', req.body);

        // Logic to create a new user
        const newUser = await User.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.password,
            role: req.body.role,
            passwordChangedAt: req.body.passwordChangedAt,
            passwordResetToken: req.passwordResetToken,
            passwordResetTokenExpires: req.passwordResetTokenExpires
        });

        console.log('New user created:', newUser);

        // Manually remove the password field from the newUser object
        newUser.password = undefined;

        // Send response
        res.status(201).json({
            status: 'success',
            message: "Signup successful!",
            data: { user: newUser }
        });

        console.log('Response sent');

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            status: 'error',
            message: "Internal server error"
        });
    }
});


exports.login = asyncErrorHandler(async(req, res, next) => {

    // Create variables for the user email and password
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new CustomError("User not found", 404));
    }


    //Check if the account is locked out 
    if (user.failedLoginAttempts >= 5 && user.accountLockoutUntil && new Date() < user.accountLockoutUntil) {
        console.log("Sending 403 - Account Locked");
        return next(new CustomError("Your account is locked. Please try again later.", 403));
    }


    // Check if the provided password matches the stored password
    const isPasswordCorrect = await user.comparePasswordInDb(password, user.password);

    if (!isPasswordCorrect) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= 5) {
            const lockoutDuration = 15 * 60 * 1000; // 15 minutes
            user.accountLockoutUntil = new Date(Date.now() + lockoutDuration);
        }

        await user.save();
        return next(new CustomError("Incorrect email or password", 401));
    }

    // Reset failed attempts on a succesfull log in
    user.failedLoginAttempts = 0;
    user.accountLockoutUntil = null;
    await user.save();

    // User is authenticated successfully
    const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    });

    // Set the token as a cookie
    //console.log('Setting cookie', token);
    res.cookie('token', token, {
        httpOnly: true,
        Secure: false, // Should be true in production
        sameSite: 'lax', // Adjust as needed
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    //console.log('Cookie set');

    // Send a success response with the success message and the username
    return res.status(200).json({ message: "Login successful", username: user.name });

});


exports.restrict = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            const error = new CustomError('You do not have permission to perform this action', 403);
            return next(error)
        }
        next();
    }
}

// Forgot Password Function
exports.forgotPassword = asyncErrorHandler(async(req, res, next) => {

    console.log("Email from request:", req.body.email);
    console.log("Request Body:", req.body);

    //1. Get the user using own email address
    const user = await User.findOne({ email: new RegExp(`^${req.body.email}$`, 'i') });

    if (!user) {
        const error = new CustomError('We could not find the user with given email', 404);
        return next(error)
    }

    //2. Generate a random reset token
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    //3. SEND THE TOKEN BACK TO THE EMAIL ^
    // const resetUrl = `${req.protocol}://${req.get('host')}/passReset?token=${resetToken}`;
    const resetUrl1 = `http://localhost:4200/reset?token=${resetToken}`;

    const message = `Below is a password reset link. Click the link to reset your password\n\n${resetUrl1}\n\nThis link is valid for the next 10 minutes`;

    try {
        await sendEmail(
            user.email, // Recipient's email
            'Password Reset Link', // Email subject
            message // Email content
        );

        res.status(200).json({
            status: 'success',
            message: 'The password reset link has been sent to the user email'
        });

    } catch (err) {
        console.error(err)
            // ... error handling ...
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined // This is for the token
        user.save({ validateBeforeSave: false });

        return next(new CustomError('There was an error sending the email, Please try again later.', 500));;
    }
});


// Reset Function
exports.resetPassword = asyncErrorHandler(async(req, res, next) => {

    // Get the password and confirmPassword from request body
    const { password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        const error = new CustomError('Passwords do not match', 400);
        return next(error); // Use return to ensure that the function stops executing here if there's an error
    }

    //1. IF THE USER EXISTS WITH THE GIVEN TOKEN AND TOKEN HAS NOT EXPIRED
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ passwordResetToken: token, passwordResetExpire: { $gt: Date.now() } });

    if (!user) {
        const error = new CustomError('Token is invalid or expired', 400);
        next(error);
    }

    //2. RESET THE USER'S PASSWORD
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.passwordChangedAT = Date.now();

    //Reset failed login attempts and the lockout time
    user.failedLoginAttempts = 0;
    user.accountLockoutUntil = null;

    await user.save();

    //3. LOGIN IN THE USER
    const loginToken = signToken(user._id);

    res.status(200).json({
        status: 'sucess',
        token: loginToken
    })

});



// Logout Function
exports.logout = asyncErrorHandler(async(req, res, next) => {
    console.log("logging out")
        // Set the cookie with the authentication token to an expired state
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // set the cookie to expire immediately
    });

    res.status(200).json({ message: 'Logout successful' });
});