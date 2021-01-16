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
        <div class="dash dash--smaller js-chat-container">
            <h2 class="dash__heading">Chat</h2>
            <div class="dash__content-wrapper">
                
                <div class="chat__wrapper">
                    <div class="chat__message">
                        <span class="chat__message-header">Viktor | 23:01:58 16.01.2021</span>
                        <span class="chat__message-txt">Haha this is someting very interesting based on my work.</span>
                    </div>
                    <div class="chat__message chat__message--my">
                        <span class="chat__message-header">Vojtěch | 23:05:58 16.01.2021</span>
                        <span class="chat__message-txt">That doesn't look as bad as I thought it will be.</span>
                    </div>
                    <div class="chat__message chat__message--my">
                        <span class="chat__message-header">Vojtěch | 23:06:10 16.01.2021</span>
                        <span class="chat__message-txt">Nope.</span>
                    </div>
                    <div class="chat__message">
                        <span class="chat__message-header">Viktor | 23:08:58 16.01.2021</span>
                        <span class="chat__message-txt">What do you mean by Nope, am I joke to you?</span>
                    </div>
                    <div class="chat__message chat__message--my">
                        <span class="chat__message-header">Vojtěch | 23:10:15 16.01.2021</span>
                        <span class="chat__message-txt">Nope. It's just a better way of expressing my feelings.</span>
                    </div>
                    <div class="chat__message chat__message--my">
                        <span class="chat__message-header">Vojtěch | 23:10:32 16.01.2021</span>
                        <span class="chat__message-txt">I could also use emojis if you want.</span>
                    </div>
                </div>
                <form class="chat__send js-send-message-form" method="POST" action="#">
                    <input type="text" name="message" class="chat__send-input js-chat__send-input" placeholder="Type here..." autocomplete="off">
                    <button class="chat__send-btn"><svg class="chat__send-icon"><use href="/assets/imgs/sprite.svg#icon-send"></use></svg></button>
                </form>

            </div>
        </div>
        `;

        elements.mainWrapper.insertAdjacentHTML('beforeend', markup);
    }
    setupElements() {
        this.elements.chatWrapper = document.querySelector('.js-chat-container');
        this.elements.messageInput = this.elements.chatWrapper.querySelector('.js-chat__send-input');
    }
    setupEvents() {
        this.elements.chatWrapper.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const token = localStorage.getItem('token');

            let resp = await api.sendMessage(formData, token);

            if (resp.status === 'success') {
                this.clearInput();
                new Notify('success', 'Message sending', 'Message was sent.');
            } else {
                new Notify('error', 'Message sending', 'Ups, something went wrong.');
            }
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
    clearInput() {
        this.elements.messageInput.value = '';
    }
    init(show = false) {
        this.utilities.redirector = new Redirector;

        this.render(show);
        this.setupElements();
        this.setupEvents();
    }
}
