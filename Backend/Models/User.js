const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// Profile image seeds (names for seed generation)
const profile_imgs_name_list = [
    "Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia",
    "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna",
    "Jack", "Felix", "Kiki"
];

// Profile image collections (types of avatars you can choose)
const profile_imgs_collections_list = [
    "adventurer", "adventurer-neutral", "avataaars", "avataaars-neutral",
    "big-ears", "big-ears-neutral", "big-smile", "bottts", "bottts-neutral",
    "croodles", "croodles-neutral", "dylan", "fun-emoji", "glass", "icons",
    "identicon", "initials", "lorelei", "lorelei-neutral", "micah", "miniavs",
    "notionists", "notionists-neutral", "open-peeps", "personas", "pixel-art",
    "pixel-art-neutral", "rings", "shapes", "thumbs"
];


const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile_img: {
        type: String,
        default: () => {
            return `https://api.dicebear.com/9.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
        }
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
        },
    ],
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    bio: {
        type: String,
        default: "Hello! I'm using NoteNow.",
        trim: true,
    },

}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
