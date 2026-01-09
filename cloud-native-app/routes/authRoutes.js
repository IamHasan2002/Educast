const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure Multer for avatar upload (Memory for Cloud)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', upload.single('avatar'), authController.updateProfile);

module.exports = router;
