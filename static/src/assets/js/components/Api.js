import Axios from 'axios';

import ApiStatus from './ApiStatus'

export default class Api {
    constructor(baseUrl = '') {
        this.state = {
            baseUrl,
            endpoints: {
                registration: {
                    name: 'registration',
                    method: 'POST',
                    path: 'registration/',
                    requiredFields: ['email', 'password'],
                    optionalFields: []
                },
                userAuthentication: {
                    name: 'userAuthentication',
                    method: 'POST',
                    path: 'user-authentication/',
                    requiredFields: ['email', 'password'],
                    optionalFields: []
                },
                logout: {
                    name: 'logout',
                    method: 'POST',
                    path: 'logout/',
                    requiredFields: ['token'],
                    optionalFields: []
                },
                sendMessage: {
                    name: 'sendMessage',
                    method: 'POST',
                    path: 'send-message/',
                    requiredFields: ['message', 'token'],
                    optionalFields: []
                },
                getMessages: {
                    name: 'getMessages',
                    method: 'GET',
                    path: 'messages/',
                    requiredFields: ['token'],
                    optionalFields: ['last_verified_id', 'are_old_messages']
                },
                getUser: {
                    name: 'getUser',
                    method: 'GET',
                    path: 'user/',
                    requiredFields: ['token'],
                    optionalFields: ['id']
                }
            }
        }
    }

    areRequiredFieldsFilled(formData, endpointName) {
        for (const reqField of this.state.endpoints[endpointName].requiredFields) {
            if (!formData.get(reqField)) {
                return false;
            }
        }

        return true;
    }

    async request(endpointName, formData) {
        const currentTimestamp = new Date().getTime();
        const endpoint = this.state.endpoints[endpointName];
        
        if (!this.areRequiredFieldsFilled(formData, endpoint.name)) {
            return new ApiStatus('error', 400, 'Required fields are not present.');
        }

        let searchUrlPart;
        if (endpoint.method === 'GET') {
            const possibleFields = [...endpoint.requiredFields, ...endpoint.optionalFields];
            
            let fields = [];
            possibleFields.forEach(field => {
                const fieldValue = formData.get(field);
                
                if (fieldValue !== null) {
                    fields.push(`${field}=${fieldValue}`);
                }
            });
            fields.push(`t=${currentTimestamp}`);

            searchUrlPart = `?${fields.join('&')}`
        }
    
        let resp;
        try {
            resp = await Axios({
                method: endpoint.method,
                url: this.state.baseUrl + endpoint.path + (endpoint.method === 'GET' ? searchUrlPart : `?t=${currentTimestamp}`),
                data: formData
            });
        } catch(err) {
            if (err.response?.status === 401) {
                await globalLogout(this);
                return new ApiStatus('error', 401, 'Your connection has expired, you were logged out.');
            } else {
                return new ApiStatus('error', 500, 'Something went wrong.');
            }
        }
    
        return new ApiStatus(Math.floor(resp.status / 100) === 2 ? 'success' : 'error', resp.status, resp.statusText, resp.data);
    }

    async register(formData) {
        const status = await this.request('registration', formData);
        return status;
    }

    async authenticateUser(formData) {
        const status = await this.request('userAuthentication', formData);
        return status;
    }

    async logout(token) {
        let formData = new FormData;
        formData.append('token', token);

        const status = await this.request('logout', formData);
        return status;
    }

    async sendMessage(formData, token) {
        formData.append('token', token);

        const status = await this.request('sendMessage', formData);

        if (status.getStatus() === 'success') {
            status.data.timestamp *= 1000;
        }

        return status;
    }

    async getMessages(token, lastVerifiedId = -1, areOldMessages = false) {
        let formData = new FormData;
        formData.append('token', token);
        formData.append('last_verified_id', lastVerifiedId);
        formData.append('are_old_messages', areOldMessages);

        let status = await this.request('getMessages', formData);
        if (status.getStatus() !== 'error') {
            status.data = status.data.map(mess => {
                mess.timestamp *= 1000
                return mess;
            });
        }

        return status;
    }

    async getUser(token, id = -1) {
        let formData = new FormData;
        formData.append('token', token);
        formData.append('user-id', id);

        const status = await this.request('getUser', formData);
        return status;
    }
}

async function globalLogout(api) {
    const token = localStorage.getItem('token');
    await api.logout(token);

    localStorage.removeItem('token');
    location.reload();
}