import config from '../../config';
import Api from '../Api';

const api = new Api(config.apiUrl);

export default class Chat {
    constructor() {
        this.lastVerifiedMessageId = -1;
        this.messages = [];
    }

    async sendMessage(form) {
        const formData = new FormData(form);
        const token = localStorage.getItem('token');

        let resp = await api.sendMessage(formData, token);

        if (resp.status === 'success') {
            return resp.data;
        }

        return false;
    }

    async getNewMessages() {
        const token = localStorage.getItem('token');
        const resp = await api.getMessages(token, this.lastVerifiedMessageId);

        if (resp.status === 'success') {
            return resp.data;
        }

        return false;
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