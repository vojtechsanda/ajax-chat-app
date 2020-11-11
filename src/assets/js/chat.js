//* SCSS
import '../sass/chat.scss';

import Axios from 'axios';

class Chat {
    constructor() {
        this.state = {
            apiUrls: {
                messages: 'https://localhost/api/messages/'
            },
            intervals: {},
        };
        this.messages = [];
    }

    saveElements() {
        this.elements = {};
        this.elements.chatHeader = document.querySelector('.js-chat__header');
        this.elements.chatContent = document.querySelector('.js-chat__content');
        this.elements.chatWindow = document.querySelector('.js-chat__chat-window');
    }

    setUpEvents() {
        this.elements.chatHeader.addEventListener('click', () => {
            this.elements.chatWindow.classList.toggle('chat__content--opened');
        })
    }

    renderMessage(message) {
        const d = new Date(message.timestamp);
        const dateTxt = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${formatNumber2Digits(d.getHours())}:${formatNumber2Digits(d.getMinutes())}:${formatNumber2Digits(d.getSeconds())}`;
        
        const markup = `
        <div class="chat__message chat__message--${message.from === 'me' ? 'left' : 'right'}">
            <span class="chat__message-time">${dateTxt}</span>
            <span class="chat__message-txt">${message.message}</span>
        </div>
        `;

        this.elements.chatWindow.insertAdjacentHTML('beforeend', markup);
        this.elements.chatWindow.scrollTo(0, this.elements.chatWindow.scrollHeight);
    }

    renderMessages() {
        Array.from(this.elements.chatWindow.children).forEach(el => el.parentElement.removeChild(el));
        this.messages.forEach(mess => {
            this.renderMessage(mess);
        });
    }

    setupIntervals() {
        this.setupMessageCheck();
    }

    setupMessageCheck() {
        this.state.intervals.messageCheck = setInterval(async () => {
            const newMessages = await this.loadMessages();
            
            if (JSON.stringify(newMessages) !== JSON.stringify(this.messages)) {
                this.messages = newMessages;
                this.renderMessages();
            }
        }, 2000)
    }

    async loadMessages() {
        const response = await Axios(this.state.apiUrls.messages);
        return response.data;
    }
    async init() {
        this.saveElements();
        this.setUpEvents();
        this.messages = await this.loadMessages();
        this.renderMessages();
        this.setupIntervals();
    }
}

const chat = new Chat();
window.c = chat;
chat.init();

function formatNumber2Digits(num) {
    if (num >= 10) {
        return `${num}`;
    }

    return `0${num}`;
}