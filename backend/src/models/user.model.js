import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type:String,
        default: null
    }
}, {
        timestamps: true
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('passwordHash')) {
        return;
    }
    const salt = await bcrypt.genSalt(11);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.comparePassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
};

export default mongoose.model('User', userSchema);
