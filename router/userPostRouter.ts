import express from 'express';
import UserTable from '../models/User';  
import PostTable from '../models/Post';   

const userPostRouter: express.Router = express.Router();

// GET all users
userPostRouter.get('/users', async (req: express.Request, res: express.Response) => {
    try {
        const users = await UserTable.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// GET all posts
userPostRouter.get('/posts', async (req: express.Request, res: express.Response) => {
    try {
        const posts = await PostTable.find().populate('userId');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// GET all posts of a specific user
userPostRouter.get('/users/:userId/posts', async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    try {
        const posts = await PostTable.find({ userId }).populate('userId');
        if (posts.length === 0) {
            res.status(404).json({ message: 'No posts found for this user' });
            return
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// CREATE a post for a user
userPostRouter.post('/users/:userId/posts', async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    const { title, description, images } = req.body;

    try {
        const user = await UserTable.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        const newPost = new PostTable({ title, description, userId, images });
        await newPost.save();

        // Increment the user's post count
        user.postCount += 1;
        await user.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// UPDATE a post for a user
userPostRouter.put('/posts/:postId', async (req: express.Request, res: express.Response) => {
    const postId = req.params.postId;
    const { title, description, images } = req.body;

    try {
        const post = await PostTable.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return
        }

        // Update post details
        post.title = title || post.title;
        post.description = description || post.description;
        post.images = images || post.images;

        const updatedPost = await post.save();

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// DELETE a post for a user
userPostRouter.delete('/posts/:postId', async (req: express.Request, res: express.Response) => {
    const postId = req.params.postId;

    try {
        const post = await PostTable.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return
        }

        // Find the user and decrement their post count
        const user = await UserTable.findById(post.userId);
        if (user) {
            user.postCount -= 1;
            await user.save();
        }

        // Delete the post
        await post.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// CREATE a new user
userPostRouter.post('/users', async (req: express.Request, res: express.Response) => {
    const { name, mobileNumber, address } = req.body;

    try {
        const existingUser = await UserTable.findOne({ mobileNumber });
        if (existingUser) {
            res.status(400).json({ message: 'Mobile number already in use' });
            return
        }

        const newUser = new UserTable({ name, mobileNumber, address, postCount: 0 });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

export default userPostRouter;
