import { elements } from './views/base';
import Api from './Api';
import Notify from './Notify';
import Redirector from './Redirector'

const api = new Api('https://localhost');

export default class Chat {
    constructor() {
        this.elements = {};
        this.utilities = {};
    }
    render(showDash = false) {
        const markup = `
        <form method="POST" action='#' class="dash${!false ? ' dash--hidden' : ''} js-registration-form">
            <h2 class="dash__heading">Chat</h2>
            <div class="dash__content-wrapper">

            
            </div>
        </form>
        `;

        elements.mainWrapper.insertAdjacentHTML('beforeend', markup);
    }
    setupElements() {
        this.elements.chatWrapper = document.querySelector('.js-registration-form');
    }
    setupEvents() {
        this.elements.chatWrapper.addEventListener('submit', async (e) => {
            e.preventDefault();

            var formData = new FormData(e.target);

            // let resp = await api.register(formData);

            // if (resp.status === 'success') {
            //     this.clearInputs();
            //     this.utilities.redirector.toLogin();
            //     // new Notify('success', 'Registration', 'You are successfully registered.');
            // } else {
            //     new Notify('error', 'Registration', 'Ups, something went wrong.');
            // }
        })
    }
    toggle() {
        this.elements.chatWrapper.classList.toggle('dash--hidden');
    }
    show() {
        this.elements.chatWrapper.classList.remove('dash--hidden');
    }
    hide() {
        this.elements.chatWrapper.classList.add('dash--hidden');
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
