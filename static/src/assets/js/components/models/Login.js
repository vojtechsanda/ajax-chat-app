import Api from '../Api';

const api = new Api('https://localhost/api/');

export default class Login {
    constructor() {
        this.lastVerifiedMessageId = -1;
        this.messages = [];
    }

    async login(form) {
        var formData = new FormData(form);

        let resp = await api.authenticateUser(formData);

        if (resp.status === 'success') {
            return resp;
        }

        return false;
    }
}