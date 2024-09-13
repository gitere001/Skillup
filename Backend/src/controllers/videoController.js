import { promises as fs } from 'fs';
import path from 'path';
import Video from '../modules/video.js';
import User from '../modules/users.js';

export const createVideo = async (req, res) => {
    const user = req.user;

    if (!user || user.role !== 'instructor') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, video } = req.body;

    try {
        const newVideo = await Video.create({
            instructorId: user.id,
            title,
            description
        });

        const videoPath = path.join(path.resolve(), 'videos', newVideo.id.toString());
        await fs.mkdir(videoPath, { recursive: true });
        if (video) {
            await fs.writeFile(path.join(videoPath, 'video.mp4'), video);
            newVideo.videoPath = path.join('videos', newVideo.id.toString(), 'video.mp4');
        }

        await newVideo.save();
        return res.status(201).json({ videoId: newVideo.id });
    } catch (err) {
        console.error('Error creating video:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPurchasedVideos = async (req, res) => {
    const user = req.user;

    try {
        const purchasedVideos = await Video.findAll({ where: { isPurchased: true } });
        return res.status(200).json({ videos: purchasedVideos });
    } catch (err) {
        console.error('Error fetching videos:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
