import config from '../../config';
import Api from '../Api';

const api = new Api(config.apiUrl);

export default class Registration {
    constructor() {
        this.lastVerifiedMessageId = -1;
        this.messages = [];
    }

    async register(form) {
        var formData = new FormData(form);

        const resp = await api.register(formData);

        return resp.status === 'success';
    }
}