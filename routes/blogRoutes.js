import express from 'express';
import Blog from '../models/blogSchema.js';

const router = express.Router();

// GET /api/blogs - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// GET /api/blogs/:id - Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// POST /api/blogs - Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Validate required fields
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Title, content, and author are required' });
    }

    const newBlog = new Blog({
      title,
      content,
      author
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// PUT /api/blogs/:id - Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        author,
        updatedAt: Date.now()
      },
      { new: true } // Return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

export default router;