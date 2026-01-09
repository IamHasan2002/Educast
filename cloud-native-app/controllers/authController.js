const { getAllUsers, createUser, updateUser } = require('../utils/db');
const { uploadFileToBlob } = require('../utils/blobStorage');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const {
            username, password, email,
            role, university, subject,
            country, city, gender
        } = req.body;

        const users = await getAllUsers();
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            email,
            role: role || 'student', // Default to student
            university: university || '',
            subject: subject || '',
            country: country || '',
            city: city || '',
            gender: gender || '',
            avatarUrl: null, // Custom avatar
            bio: '',
            createdAt: new Date().toISOString()
        };

        await createUser(newUser);

        // Remove password from response
        const { password: _, ...userSafe } = newUser;

        res.status(201).json({ message: 'User registered successfully', user: userSafe });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await getAllUsers();

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches (support both hashed and legacy plain text for old test users)
        const isMatch = await bcrypt.compare(password, user.password);
        const isLegacyMatch = user.password === password;

        if (!isMatch && !isLegacyMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Error logging in' });
    }
};



// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { userId, bio, university, subject, country, city } = req.body;
        const file = req.file; // Avatar

        const users = await getAllUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (bio) user.bio = bio;
        if (university) user.university = university;
        if (subject) user.subject = subject;
        if (country) user.country = country;
        if (city) user.city = city;

        if (file) {
            // Azure Blob Upload
            try {
                user.avatarUrl = await uploadFileToBlob(file);
            } catch (e) {
                console.log('Avatar Blob upload failed, fallback:', e);
                user.avatarUrl = `/uploads/${file.filename}`;
            }
        }

        await updateUser(user);

        res.json({ message: 'Profile updated', user: user });
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ message: 'Update failed' });
    }
};
