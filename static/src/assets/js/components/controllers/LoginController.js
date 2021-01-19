import Notify from '../Notify';
import Redirector from '../Redirector'

import * as loginView from '../views/loginView';
import Login from '../models/Login';
const login = new Login;

export default class LoginController {
    constructor() {
        this.elements = {};
        this.utilities = {};
    }

    setupElements() {
        this.elements.loginForm = document.querySelector('.js-login-form');
    }

    setupEvents() {
        this.elements.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isLogged = await login.login(e.target);

            if (isLogged) {
                new Notify('success', 'Login', 'You are successfully logged in.');
                localStorage.setItem('token', isLogged.data.token);
                loginView.clearInputs();
                this.utilities.redirector.toChat();
            } else {
                new Notify('error', 'Login', 'Ups, something went wrong.');
            }
        })
    }

    toggle() {
        loginView.toggle();
    }

    show() {
        loginView.show();
    }

    hide() {
        loginView.hide();
    }

    init(show = false) {
        this.utilities.redirector = new Redirector;
        
        loginView.renderDash(show);
        this.setupElements();
        this.setupEvents();
    }
}
