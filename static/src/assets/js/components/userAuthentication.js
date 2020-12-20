import { elements } from './views/base';
import Api from './Api';
import Notify from './Notify';
import Redirector from './Redirector'

const api = new Api('https://localhost');

export default class Registration {
    constructor() {
        this.elements = {};
        this.utilities = {};
    }
    render(showDash = false) {
        const markup = `
        <form method="POST" action='#' class="dash${!showDash ? ' dash--hidden' : ''} js-user-authentication-form">
            <h2 class="dash__heading">Login</h2>
            <div class="dash__content-wrapper">
                <div class="dash__input-wrapper">
                    <label class="dash__input-label" for="user-authentication-email">E-mail</label>
                    <input type="email" name="email" placeholder="john.doe@example.com" id="user-authentication-email" class="dash__input" autocomplete="off" required>
                </div>
                <div class="dash__input-wrapper">
                    <label class="dash__input-label" for="user-authentication-password">Password</label>
                    <input type="password" name="password" placeholder="••••••••" id="user-authentication-password" class="dash__input" required>
                </div>
                <div class="dash__input-wrapper">
                    <input type="submit" value="Authenticate" class="dash__input dash__input--submit">
                </div>
            </div>
            <p class="dash__additional-note">Don't have an account?<br><a href="?registration" class="dash__link">Register here</a></p>
        </form>
        `;

        elements.mainWrapper.insertAdjacentHTML('beforeend', markup);
    }
    setupElements() {
        this.elements.userAuthenticationForm = document.querySelector('.js-user-authentication-form');
    }
    setupEvents() {
        this.elements.userAuthenticationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            var formData = new FormData(e.target);

            let resp = await api.authenticateUser(formData);

            if (resp.status === 'success') {
                // new Notify('success', 'User authentication', 'You are successfully authenticated.');
                localStorage.setItem('token', resp.data.token);
                this.utilities.redirector.toChat();
            } else {
                new Notify('error', 'User authentication', 'Ups, something went wrong.');
            }
        })
    }
    toggle() {
        this.elements.userAuthenticationForm.classList.toggle('dash--hidden');
    }
    show() {
        this.elements.userAuthenticationForm.classList.remove('dash--hidden');
    }
    hide() {
        this.elements.userAuthenticationForm.classList.add('dash--hidden');
    }
    init(show = false) {
        this.utilities.redirector = new Redirector;
        this.render(show);
        this.setupElements();
        this.setupEvents();
    }
}
