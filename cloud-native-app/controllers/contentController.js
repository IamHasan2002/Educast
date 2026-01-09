const { getAllPosts, createPost, deletePost, getAllUsers } = require('../utils/db');
const { uploadFileToBlob } = require('../utils/blobStorage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Create Post
exports.createPost = async (req, res) => {
    try {
        const { userId, content, username } = req.body;
        const file = req.file;
        let mediaUrl = null;

        if (file) {
            // Upload to Azure Blob
            // Note: In local dev without key, this throws/logs error, so we might need fallback?
            // The utility handles missing key by logging, but let's handle the return.
            try {
                mediaUrl = await uploadFileToBlob(file);
            } catch (e) {
                console.log('Blob upload failed (or no key), falling back to local:', e.message);
                mediaUrl = `/uploads/${file.filename}`;
            }
        }

        const newPost = {
            id: uuidv4(),
            userId, // Partition Key
            username,
            content,
            mediaUrl: mediaUrl,
            mediaType: file ? file.mimetype : null,
            createdAt: new Date().toISOString()
        };

        await createPost(newPost);

        res.status(201).json({ message: 'Post created', post: newPost });
    } catch (err) {
        console.error('Create Post Error:', err);
        res.status(500).json({ message: 'Error creating post', error: err.message });
    }
};

// Get All Posts (with optional search)
// Get All Posts (with advanced search and filters)
exports.getPosts = async (req, res) => {
    try {
        console.log('[API] getPosts Query:', req.query); // DEBUG LOG
        const { search, university, subject, role, mediaType, country } = req.query;
        let posts = await getAllPosts();
        const users = await getAllUsers(); // Need user details to filter by uni/subject/role/country

        // Create a user lookup map
        const userMap = {};
        users.forEach(u => userMap[u.id] = u);

        // Filter
        posts = posts.filter(p => {
            const author = userMap[p.userId] || {};

            // 1. Search Text (Content or Username or Topic)
            if (search) {
                const query = search.toLowerCase();
                const content = (p.content || '').toLowerCase();
                const username = (p.username || '').toLowerCase();

                // Also search in Subject/Bio if available in author
                const subject = (author.subject || '').toLowerCase();
                const bio = (author.bio || '').toLowerCase();

                if (!content.includes(query) &&
                    !username.includes(query) &&
                    !subject.includes(query) &&
                    !bio.includes(query)) {
                    return false;
                }
            }

            // 2. Filter University
            if (university && university !== 'All') {
                if ((author.university || '').toLowerCase() !== university.toLowerCase()) return false;
            }

            // 3. Filter Subject
            if (subject && subject !== 'All') {
                if ((author.subject || '').toLowerCase() !== subject.toLowerCase()) return false;
            }

            // 4. Filter Role (Student vs Teacher)
            if (role && role !== 'All') {
                // author.role might be 'user', 'student', 'admin'. 
                // We'll trust what's in the DB or map 'user' -> 'student' if needed.
                if ((author.role || '').toLowerCase() !== role.toLowerCase()) return false;
            }

            // 5. Filter Country
            if (country && country !== 'All') {
                if ((author.country || '').toLowerCase() !== country.toLowerCase()) return false;
            }

            // 6. Filter Media Type
            if (mediaType && mediaType !== 'All') {
                const type = p.mediaType || '';
                if (mediaType === 'pdf' && !type.includes('pdf')) return false;
                if (mediaType === 'image' && !type.startsWith('image/')) return false;
                if (mediaType === 'video' && !type.startsWith('video/')) return false;
                if (mediaType === 'audio' && !type.startsWith('audio/')) return false;
            }

            return true;
        });

        res.json(posts);
    } catch (err) {
        console.error('Get Posts Error:', err);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

// Get User Posts
exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await getAllPosts(); // In a real massive DB, we'd query by PartitionKey directly
        const userPosts = posts.filter(p => p.userId === userId);
        res.json(userPosts);
    } catch (err) {
        console.error('Get User Posts Error:', err);
        res.status(500).json({ message: 'Error fetching user posts' });
    }
};

// Delete Post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.body;

        const posts = await getAllPosts();
        const post = posts.find(p => p.id === id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check permissions
        if (post.userId !== userId && role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete file if exists
        if (post.mediaUrl) {
            const filePath = path.join(__dirname, '../public', post.mediaUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await deletePost(id, post.userId);

        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('Delete Post Error:', err);
        res.status(500).json({ message: 'Failed to delete post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, content } = req.body;

        const updated = await updatePost(id, userId, content);
        if (updated) {
            res.json({ message: 'Post updated', post: updated });
        } else {
            res.status(404).json({ message: 'Post not found or unauthorized' });
        }
    } catch (err) {
        console.error('Update Post Error:', err);
        res.status(500).json({ message: 'Failed to update post' });
    }
};
