import Notify from '../Notify';
import Redirector from '../Redirector'

import * as loginView from '../views/loginView';
import Login from '../models/Login';

const login = new Login;

export default class LoginController {
    constructor() {
        this.utilities = {};
    }

    setupEvents() {
        loginView.getLoginFormElement().addEventListener('submit', async (e) => {
            e.preventDefault();

            const isLogged = await login.login(e.target);

            if (isLogged) {
                new Notify('success', 'Login', 'You were successfully logged in.');
                localStorage.setItem('token', isLogged.data.token);
                loginView.clearInputs();
                this.utilities.redirector.toChat();
            } else {
                new Notify('error', 'Login', 'Wrong username or password');
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
        this.setupEvents();
    }
}
