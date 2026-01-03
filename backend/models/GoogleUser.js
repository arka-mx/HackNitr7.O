import mongoose from 'mongoose';

const googleUserSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    picture: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'google'
});

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

export default GoogleUser;
