import { elements } from './views/base';
import Api from './Api';
import Notify from './Notify';

const api = new Api('https://localhost');

export default class Registration {
    constructor() {
        
    }
    setupEvents() {
        elements.registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            var formData = new FormData(e.target);

            let resp = await api.register(formData);

            if (resp.status === 'success') {
                new Notify('success', 'Registration', 'You are successfully registered.');
            } else {
                new Notify('error', 'Registration', 'Ups, something went wrong.');
            }
        })
    }
    init() {
        this.setupEvents();
    }
}
