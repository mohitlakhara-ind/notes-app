const express = require('express');
const router = express.Router();
const Note = require('../Models/Notes');
const middleware = require('../Middleware/authMiddleware');
const multer = require('multer');
const sanitizeHtml = require('sanitize-html');
const User = require('../Models/User');
const path = require('path');
const fs = require('fs');

function removeHtmlTags(str) {
    return str.replace(/<[^>]*>?/gm, ' ').trim();
}

// Use authentication middleware
router.use(middleware);

// Ensure the uploads directory exists
const uploadDir = 'uploads/notes/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `ni-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Get all notes
router.get('/all', async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const user = await User.findById(req.user.id).populate('notes');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.notes);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new note
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const sanitizedContent = sanitizeHtml(content);
        const images = req.file ? [req.file.filename] : [];

        const newNote = new Note({
            userId: req.user.id,
            title,
            content: sanitizedContent,
            description: removeHtmlTags(sanitizedContent.substring(0, 45)),
            images,
        });

        await newNote.save();
        await User.findByIdAndUpdate(req.user.id, { $push: { notes: newNote._id } });

        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a note
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const existingNote = await Note.findById(req.params.id);
        if (!existingNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const sanitizedContent = sanitizeHtml(content);
        const images = req.file ? [req.file.filename] : [];

        existingNote.title = title;
        existingNote.content = sanitizedContent;
        existingNote.images = images;
        await existingNote.save();

        res.json(existingNote);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a note
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await User.updateMany({}, { $pull: { notes: req.params.id } });

        // Remove associated images
        deletedNote.images.forEach(image => {
            const filePath = path.join(uploadDir, image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle pin status
router.put('/pin/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        note.pinned = !note.pinned;
        await note.save();

        res.json({ message: `Note ${note.pinned ? 'pinned' : 'unpinned'} successfully`, note });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle archive status
router.put('/archive/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        note.archived = !note.archived;
        await note.save();

        res.json({ message: `Note ${note.archived ? 'archived' : 'unarchived'} successfully`, note });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
