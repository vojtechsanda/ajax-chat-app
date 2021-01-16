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
                    requiredFields: ['email', 'password']
                },
                userAuthentication: {
                    name: 'userAuthentication',
                    method: 'POST',
                    path: '/api/user-authentication/',
                    requiredFields: ['email', 'password']
                },
                sendMessage: {
                    name: 'sendMessage',
                    method: 'POST',
                    path: '/api/send-message/',
                    requiredFields: ['message', 'token']
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
    
        let resp;
        try {
            resp = await Axios({
                method: endpoint.method,
                url: this.state.baseUrl + endpoint.path,
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
        return status;
    }
}