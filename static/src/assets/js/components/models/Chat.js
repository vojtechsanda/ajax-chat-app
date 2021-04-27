import config from '../../config';
import Api from '../Api';

const api = new Api(config.apiUrl);

export default class Chat {
    constructor() {
        this.lastVerifiedMessageId = -1;
        this.messages = [];
        this.unverifiedMessagesTimestamps = [];
    }

    async sendMessage(form) {
        if (this.canSendMessage()) {
            const formData = new FormData(form);
            const token = localStorage.getItem('token');
    
            this.unverifiedMessagesTimestamps.push((new Date).getTime());

            let resp = await api.sendMessage(formData, token);
    
            if (resp.getStatus() === 'success') {
                return resp.data;
            }
        }

        return false;
    }

    canSendMessage() {
        // Cooldown
        const lastSecondsMessages = this.unverifiedMessagesTimestamps.filter(timestamp => timestamp > ((new Date).getTime() - 1000));
        if (lastSecondsMessages.length >= 5) {
            console.error("You can send just 5 messages per second.");
            return false;
        }

        return true;
    }

    async getNewMessages() {
        const token = localStorage.getItem('token');
        const resp = await api.getMessages(token, this.lastVerifiedMessageId);

        if (resp.getStatus() === 'success') {
            return resp.data;
        }

        return false;
    }

    async getOldMessages() {
        const token = localStorage.getItem('token');
        const resp = await api.getMessages(token, this.messages[0].id, true);
        return resp;
    }

    getLastVerifiedMessageIndex() {
        return this.messages.findIndex(message => message.id === this.lastVerifiedMessageId)
    }

    getLastVerifiedMessageId() {
        return this.lastVerifiedMessageId;
    }

    updateLastVerifiedMessageId(id) {
        this.lastVerifiedMessageId = id;
    }

    setMessages(messages) {
        this.messages = messages;
    }

    addOldMessages(oldMessages) {
        this.messages.unshift(...oldMessages);
    }

    updateMessages(newMessages, from) {
        this.messages.splice(from + 1, this.messages.length - (from + 1), ...newMessages)
    }

    getMessages(fromIndex = 0) {
        return this.messages.slice(fromIndex);
    }

    async logout() {
        const token = localStorage.getItem('token');
        await api.logout(token);

        localStorage.removeItem('token');
        location.reload();
    }
}