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
        <form method="POST" action='#' class="dash${!showDash ? ' dash--hidden' : ''} js-registration-form">
            <h2 class="dash__heading">Register</h2>
            <div class="dash__content-wrapper">
                <div class="dash__input-wrapper">
                    <label class="dash__input-label" for="registration-email">E-mail</label>
                    <input type="email" name="email" placeholder="john.doe@example.com" id="registration-email" class="dash__input" autocomplete="off" required>
                </div>
                <div class="dash__input-wrapper">
                    <label class="dash__input-label" for="registration-password">Password</label>
                    <input type="password" name="password" placeholder="••••••••" id="registration-password" class="dash__input" required>
                </div>
                <div class="dash__input-wrapper">
                    <input type="submit" value="Register" class="dash__input dash__input--submit">
                </div>
            </div>
            <p class="dash__additional-note">Already have an account?<br><a href="?login" class="dash__link">Login here</a></p>
        </form>
        `;

        elements.mainWrapper.insertAdjacentHTML('beforeend', markup);
    }
    setupElements() {
        this.elements.registrationForm = document.querySelector('.js-registration-form');
        this.elements.inputs = Array.from(this.elements.registrationForm.querySelectorAll('input:not([type="submit"])'));
    }
    setupEvents() {
        this.elements.registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            var formData = new FormData(e.target);

            let resp = await api.register(formData);

            if (resp.status === 'success') {
                this.clearInputs();
                this.utilities.redirector.toLogin();
                // new Notify('success', 'Registration', 'You are successfully registered.');
            } else {
                new Notify('error', 'Registration', 'Ups, something went wrong.');
            }
        })
    }
    toggle() {
        this.elements.registrationForm.classList.toggle('dash--hidden');
    }
    show() {
        this.elements.registrationForm.classList.remove('dash--hidden');
    }
    hide() {
        this.elements.registrationForm.classList.add('dash--hidden');
    }
    clearInputs() {
        this.elements.inputs.forEach(input => input.value = '');
    }
    init(show = false) {
        this.utilities.redirector = new Redirector;

        this.render(show);
        this.setupElements();
        this.setupEvents();
    }
}
