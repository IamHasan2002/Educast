const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure Multer for file upload (Memory for Cloud Upload)
// Configure Multer for file upload (Disk Storage for Scalability)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB Limit to be safe, can increase if needed
});

router.post('/', upload.single('media'), contentController.createPost);
router.get('/', contentController.getPosts);
router.get('/user/:userId', contentController.getUserPosts);
router.delete('/:id', contentController.deletePost);
router.put('/:id', contentController.updatePost);

module.exports = router;
