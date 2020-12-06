import { elements } from './views/base';
import Api from './Api';
import Notify from './Notify';

const api = new Api('https://localhost');

export default class Registration {
    constructor() {
        
    }
    setupEvents() {
        elements.userAuthenticationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            var formData = new FormData(e.target);

            let resp = await api.authenticateUser(formData);

            if (resp.status === 'success') {
                new Notify('success', 'User authentication', 'You are successfully authenticated.');
                console.log(resp);
            } else {
                new Notify('error', 'User authentication', 'Ups, something went wrong.');
            }
        })
    }
    init() {
        this.setupEvents();
    }
}
