import Notify from '../Notify';
import Redirector from '../Redirector'

import * as registrationView from '../views/registrationView';
import Registration from '../models/Registration';

const registration = new Registration;

export default class RegistrationController {
    constructor() {
        this.utilities = {};
    }

    setupEvents() {
        registrationView.getRegistrationFormElement().addEventListener('submit', async (e) => {
            e.preventDefault();

            const wasRegistered = await registration.register(e.target);

            if (wasRegistered) {
                new Notify('success', 'Registration', 'You were successfully registered.');
                registrationView.clearInputs();
                this.utilities.redirector.toLogin();
            } else {
                new Notify('error', 'Registration', 'Ups, something went wrong. Please try again later.');
            }
        })
    }

    toggle() {
        registrationView.toggle();
    }

    show() {
        registrationView.show();
    }

    hide() {
        registrationView.hide();
    }

    init(show = false) {
        this.utilities.redirector = new Redirector;
        
        registrationView.renderDash(show);
        this.setupEvents();
    }
}
