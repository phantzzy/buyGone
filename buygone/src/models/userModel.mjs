import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Define User Schema

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
    },
    resetPasswordToken: String, // Token for password reset
    resetPasswordExpire: Date,  // Expiry date for reset token
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Match user-entered password with hashed password

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Password Reset Token

userSchema.methods.getResetPasswordToken = function () {

    // Generate token

    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set the token

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration time (15 minutes)

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

// Export User Model

const User = mongoose.model('User', userSchema);
export default User;
