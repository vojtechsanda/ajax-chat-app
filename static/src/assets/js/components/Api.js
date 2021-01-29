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
                    path: '/api/registration/',
                    requiredFields: ['email', 'password'],
                    optionalFields: []
                },
                userAuthentication: {
                    name: 'userAuthentication',
                    method: 'POST',
                    path: '/api/user-authentication/',
                    requiredFields: ['email', 'password'],
                    optionalFields: []
                },
                sendMessage: {
                    name: 'sendMessage',
                    method: 'POST',
                    path: '/api/send-message/',
                    requiredFields: ['message', 'token'],
                    optionalFields: []
                },
                getMessages: {
                    name: 'getMessages',
                    method: 'GET',
                    path: '/api/messages/',
                    requiredFields: ['token'],
                    optionalFields: ['last_verified_id']
                },
                getUser: {
                    name: 'getUser',
                    method: 'GET',
                    path: '/api/user/',
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

            searchUrlPart = `?${fields.join('&')}`
        }
    
        let resp;
        try {
            resp = await Axios({
                method: endpoint.method,
                url: this.state.baseUrl + endpoint.path + (endpoint.method === 'GET' ? searchUrlPart : ''),
                data: formData
            });
        } catch {
            return new ApiStatus('error', 500, 'Something went wrong.');
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
    async sendMessage(formData, token) {
        formData.append('token', token);
        const status = await this.request('sendMessage', formData);
        status.data.timestamp *= 1000;
        return status;
    }
    async getMessages(token, lastVerifiedId = -1) {
        let formData = new FormData;
        formData.append('token', token);
        formData.append('last_verified_id', lastVerifiedId);

        let status = await this.request('getMessages', formData);
        status.data = status.data.map(mess => {
            mess.timestamp *= 1000
            return mess;
        });
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