const mongoose = require('mongoose');
const axios = require('axios');

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    color: {
        type: String,
        default: '#ffffff',
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    archived: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    reminder: {
        type: Date,
        default: null,
    },
    images: {
        type: [String], // Array of image URLs
        default: [],
    },


    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Note', NotesSchema);