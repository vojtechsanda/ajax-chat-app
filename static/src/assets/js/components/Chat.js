import { elements } from './views/base';
import Api from './Api';
import Notify from './Notify';
import Redirector from './Redirector'

const api = new Api('https://localhost');

export default class Chat {
    constructor() {
        this.elements = {};
        this.utilities = {};
        this.intervals = {};
        this.messages = {};
        this.lastVerifiedMessageId = -1;
        this.messages = [];
    }
    render(showDash = false) {
        const markup = `
        <div class="dash dash--smaller${!showDash ? ' dash--hidden' : ''} js-chat-container">
            <h2 class="dash__heading">Chat</h2>
            <div class="dash__content-wrapper">
                
                <div class="chat__wrapper js-chat__wrapper">
                    <!--<div class="chat__message">
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
                    </div>-->
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
        this.elements.chatContainer = document.querySelector('.js-chat-container');
        this.elements.messageInput = this.elements.chatContainer.querySelector('.js-chat__send-input');
        this.elements.chatWrapper = this.elements.chatContainer.querySelector('.js-chat__wrapper');
    }
    setupEvents() {
        this.elements.chatContainer.addEventListener('submit', e => {
            e.preventDefault();

            this.sendMessage(e.target);
        })
    }
    setupIntervals() {
        this.intervals.newMessages = setInterval(this.handleNewMessages.bind(this), 1000);
    }
    async sendMessage(form) {
        const formData = new FormData(form);
        const token = localStorage.getItem('token');

        let resp = await api.sendMessage(formData, token);

        if (resp.status === 'success') {
            this.clearInput();
            this.addMessage(resp.data);
            this.scrollChatDown();
        } else {
            new Notify('error', 'Message sending', 'Ups, something went wrong.');
        }
    }
    addMessage(message) {
        const messageDate = new Date(message.timestamp);
        const messageTimeTxt = `${formatNumber2Digits(messageDate.getHours())}:${formatNumber2Digits(messageDate.getMinutes())}:${formatNumber2Digits(messageDate.getSeconds())}`;
        const messageDateTxt = `${messageDate.getDate()}.${messageDate.getMonth() + 1}.${messageDate.getFullYear()}`;

        const markup = `
        <div class="chat__message chat__message--my js-chat__message" data-message-id="${message.id}">
            <span class="chat__message-header">User ${message.user_id} | ${messageTimeTxt} ${messageDateTxt}</span>
            <span class="chat__message-txt">${message.message}</span>
        </div>
        `;

        this.elements.chatWrapper.insertAdjacentHTML('beforeend', markup);
    }
    scrollChatDown() {
        this.elements.chatWrapper.scrollTo(0, this.elements.chatWrapper.scrollHeight);
    }
    toggle() {
        this.elements.chatContainer.classList.toggle('dash--hidden');
    }
    show() {
        this.elements.chatContainer.classList.remove('dash--hidden');
    }
    hide() {
        this.elements.chatContainer.classList.add('dash--hidden');
    }
    clearInput() {
        this.elements.messageInput.value = '';
    }
    reRenderMessages(from = 0) {
        const messageElems = Array.from(this.elements.chatWrapper.querySelectorAll('.js-chat__message'));

        messageElems.slice(from).forEach(elem => elem.parentElement.removeChild(elem));
        this.messages.slice(from).forEach(message => this.addMessage(message));
    }
    async handleNewMessages() {
        const token = localStorage.getItem('token');

        const resp = await api.getMessages(token, this.lastVerifiedMessageId);
        
        if (resp.status === 'success') {
            if (resp.data.length > 0) {
                const lastVerifiedIndex = this.messages.findIndex(message => message.id === this.lastVerifiedMessageId);
                const newVerifiedMessageId = resp.data[resp.data.length - 1].id;
    
                if (this.lastVerifiedMessageId !== newVerifiedMessageId) {
                    if (lastVerifiedIndex === -1) {
                        this.messages = resp.data;
                    } else {
                        this.messages.splice(lastVerifiedIndex + 1, this.messages.length - (lastVerifiedIndex + 1), ...resp.data)
                    }
    
                    this.reRenderMessages(lastVerifiedIndex === -1 ? 0 : lastVerifiedIndex);
                    this.scrollChatDown();
    
                    this.lastVerifiedMessageId = newVerifiedMessageId;
                }
            }
        } else {
            new Notify('error', 'Downloading messages', 'Ups, something went wrong.');
        }
    }
    async init(show = false) {
        this.utilities.redirector = new Redirector;

        
        this.render(show);
        this.setupElements();
        this.setupEvents();
        this.setupIntervals();
        
        await this.handleNewMessages();
        this.scrollChatDown();
    }
}

function formatNumber2Digits(num) {
    if (num >= 10) {
        return `${num}`;
    }

    return `0${num}`;
}