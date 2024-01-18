const Message = require('../models/messageModel');

class MessageManager {
    async getAllMessages() {
        return await Message.find();
    }

    async getMessageById(messageId) {
        return await Message.findById(messageId);
    }

    async addMessage(messageData) {
        const newMessage = new Message(messageData);
        return await newMessage.save();
    }

    async updateMessage(messageId, updatedMessageData) {
        return await Message.findByIdAndUpdate(messageId, updatedMessageData, { new: true });
    }

    async deleteMessage(messageId) {
        return await Message.findByIdAndDelete(messageId);
    }
}

module.exports = new MessageManager();
