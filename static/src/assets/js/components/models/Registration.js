import Api from '../Api';
import config from '../../config';

const api = new Api(config.apiUrl);

export default class Registration {
    constructor() {
        this.lastVerifiedMessageId = -1;
        this.messages = [];
    }

    async register(form) {
        var formData = new FormData(form);

        let resp = await api.register(formData);

        return resp.status === 'success';
    }
}