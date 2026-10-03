import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Unnamed Document',
        minlength: 5,
        maxlength: 35
    },
    category: {
        type: String,
        enum: ['id', 'insurance', 'medical', 'property', 'financial', 'will', 'others'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true,
        minlength: 10
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Document', documentSchema);
