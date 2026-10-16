import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

export const signToken = (userID) => {
    return jwt.sign(
        {userID},
        process.env.JWT_SECRET,
        {expiresIn: process.env.EXPIRES_IN}
    );
};

export const registerUser = async({name, email, password}) => {
    console.log(name, email, password);
    if(!(name && email && password)) {
        throw new ApiError(400, 'Name, Email and Password all are required to register');
    }

    const existingUser = await User.findOne({email: email.toLowerCase()});
    if(existingUser) {
        throw new ApiError(409, 'An account with this email already exists, try another one or contact support team');
    }

    const user = await User.create({name: name, email: email, passwordHash: password});

    return signToken(user._id);
};

export const loginUser = async({email, password}) => {
    const user = await User.findOne({email: email}).select('+passwordHash');
    
    if(!user) {
        throw new ApiError(401, 'Invalid email, Please use valid email')
    }

    if(!user.passwordHash && user.googleId && user.authProvider === 'google') {
        throw new ApiError(400, 'You are registered with Google Id. Please use "Continue with Google"');
    }

    const isMatching = await user.comparePassword(password);
    if(!isMatching) {
        throw new ApiError(401, 'Invalid password, Please use valid password');
    }

    return signToken(user._id);
};

export const findOrCreateGoogleUser = async({googleId, email, name, emailVerified}) => {
    if(!googleId || !email || !emailVerified) {
        throw new ApiError(400, 'Your GoogleId is not verified');
    }

    const googleUser = await User.findOne({googleId});
    if(googleUser) {
        return googleUser;
    }

    const normalizedEmail = email.toLowerCase();

    const sameEmailUser = await User.findOne({normalizedEmail});
    if(sameEmailUser) {
        throw new ApiError(409, 'An account with this email already exist');
    }

    return User.create({
        name,
        email: normalizedEmail,
        googleId,
        authProvider: 'google'
    });
};


export const getUser = async(userId) => {
    const user = await User.findById(userId);

    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    return {
        'name': user.name,
        'email': user.email
    };
};