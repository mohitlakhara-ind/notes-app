const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const router = express.Router();
const middleware = require('../Middleware/authMiddleware');
const multer = require('multer');
const path = require('path'); // Import for file extensions


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, "pi-"+Date.now() + path.extname(file.originalname));
    }

});
const upload = multer({ storage: storage });



router.post('/signup', async (req, res) => {
    try {

        let { name, email, password, username } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({ error: 'Please fill all fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, username: username || email.split('@')[0] });

        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ error: "Signup failed. Please try again." });
    }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please fill all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/me', middleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});


// Update profile with image upload
router.put('/update', middleware, upload.single('profile_img'), async (req, res) => {
    const { name, email, password, username } = req.body;

    // if (!name || !email) {
    //     return res.status(400).json({ error: 'Please fill all fields' });
    // }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name || user.name; // Update name only if provided
        user.email = email || user.email; // Update email only if provided
        user.username = username || user.username; // Update username only if provided

        user.profile_img =  req.file ? req.file.filename : user.profile_img;

        // Update profile image if provided

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.delete('/delete', middleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;