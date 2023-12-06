// Create a model
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const CustomError = require('../Utils/CustomError');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const loginDB = mongoose.createConnection(process.env.CONN_STR2)
console.log("Connected to login database")

// name, email, password, confirmPassword, attemptLogin/ locked out till
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 8,
        select: false // Hide the password from being shown in the api test
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    failedLoginAttempts: {
        type: Number,
        default: 0
    },

    accountLockoutUntil: {
        type: Date,
        default: null
    },

    passwordChangedAT: Date,

    passwordResetToken: String,

    passwordResetExpire: Date
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


userSchema.virtual('confirmPassword')
    .set(function(confirmPassword) {
        console.log('Setting confirmPassword:', confirmPassword);
        this._confirmPassword = confirmPassword;
    })
    .get(function() {
        return this._confirmPassword;
    });


userSchema.pre('save', async function(next) {
    // console.log(this.password, this._confirmPassword);
    if (this.isModified('password')) {
        if (this.password !== this._confirmPassword) {
            next(new CustomError('Your Password & Confirm Password does not match!', 400));
        } else {
            // Hash the password
            this.password = await bcrypt.hash(this.password, 12);

            // Note: Mongoose won't save _confirmPassword to the DB since it's a virtual. 
            // But we  want to ensure it's not accessible after this point, you can unset it.
            this._confirmPassword = undefined;

            next();
        }
    } else {
        next();
    }
});


userSchema.methods.comparePasswordInDb = async function(pswd, pswdDB) {
    return await bcrypt.compare(pswd, pswdDB);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp) {
    if (this.passwordChangedAT) {
        const passChangeTimestamp = parseInt(this.passwordChangedAT.getTime() / 1000);
        console.log(passChangeTimestamp, JWTTimestamp);

        return JWTTimestamp < passChangeTimestamp;
    }
    return false;
}
userSchema.methods.createPasswordResetToken = function() {

    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
    // console.log(this)
    // console.log(resetToken)
    // console.log(this.passwordResetToken)
    // console.log(this.passwordResetExpire)
    return resetToken;
}

const User = loginDB.model('User', userSchema);

module.exports = User;