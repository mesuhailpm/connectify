const express = require('express');
const Notification = require('../models/Notification'); // Assuming you have a Notification model
const { default: mongoose } = require('mongoose');

const router = express.Router();
// GET /api/messageNotifications/:userId
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        //convert the userId into ObjectdId for $match
        const objectId =  mongoose.Types.ObjectId.createFromHexString(userId); //replaced new mongoose.Types.ObjectId(userId);

        const notifications = await Notification.aggregate([
            { $match: { recipient: objectId, isRead: false } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$chat", latestNotification: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$latestNotification" } }
        ])

        const populatedNotifications = await Notification.populate(notifications,{
            path:'sender',
            select:'username avatar'
        })
        res.status(200).json(populatedNotifications);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error', error });
    }
});

// PUT /api/messageNotifications/:userId/markOneAsRead/:notificationId
router.put('/markOneAsRead/:userId/:notificationId', async (req, res) => {
    try { console.log('first')
        const { userId, notificationId } = req.params;
        await Notification.updateOne({ recipient: userId, _id: notificationId }, { isRead: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.put('/markOneAsReadByChatId/:userId/:chatId', async (req, res) => {
    try { console.log('first')
        const { userId, chatId } = req.params;
        await Notification.updateMany({ recipient: userId, chat: chatId }, { isRead: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error', error });
    }
});

