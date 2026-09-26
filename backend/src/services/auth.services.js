import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const generateAuthResponse = (user) => {
    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.EXPIRES_IN}
    );

    return ({'token': token, 'user': user});
}

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
    return generateAuthResponse(user);
};

export const loginUser = async({email, password}) => {
    const user = await User.findOne({email: email}).select('+passwordHash');
    
    if(!user) {
        throw new ApiError(401, 'Invalid email, Please use valid email')
    }

    const isMatching = await user.comparePassword(password);
    if(!isMatching) {
        throw new ApiError(401, 'Invalid password, Please use valid password');
    }

    return generateAuthResponse(user);
};