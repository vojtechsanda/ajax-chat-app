import Notify from '../Notify';
import User from '../User'

import * as chatView from '../views/chatView';
import Chat from '../models/Chat';
const chat = new Chat;

export default class ChatController {
    constructor() {
        this.elements = {};
        this.intervals = {};
        this.state = {
            users: []
        };
    }

    toggle() {
        chatView.toggle();
    }

    show() {
        chatView.show();
    }

    hide() {
        chatView.hide();
    }

    setupElements() {
        this.elements.chatContainer = document.querySelector('.js-chat-container');
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
        const sentMessage = await chat.sendMessage(form);
        
        if (sentMessage) {
            chatView.clearInput();
            chatView.renderMessage(sentMessage, this.state.users);
            chatView.scrollChatDown();
        } else {
            new Notify('error', 'Message sending', 'Ups, something went wrong.');
        }
    }

    async handleNewMessages() {
        const newMessages = await chat.getNewMessages();
        
        if (newMessages) {
            if (newMessages.length > 0) {
                const lastVerifiedMessageId = chat.getLastVerifiedMessageId();
                const newVerifiedMessageId = newMessages[newMessages.length - 1].id;
                
                if (lastVerifiedMessageId !== newVerifiedMessageId) {
                    const lastVerifiedIndex = chat.getLastVerifiedMessageIndex();

                    if (lastVerifiedIndex === -1) {
                        chat.setMessages(newMessages);
                    } else {
                        chat.updateMessages(newMessages, lastVerifiedIndex);
                    }
    
                    this.syncMessages(lastVerifiedIndex === -1 ? 0 : lastVerifiedIndex);
                    chatView.scrollChatDown();
    
                    chat.updateLastVerifiedMessageId(newVerifiedMessageId);
                }
            }
        } else {
            new Notify('error', 'Downloading messages', 'Ups, something went wrong.');
            console.error('Downloading messages: Ups, something went wrong.')
        }
    }

    syncMessages(from = 0) {
        chatView.removeMessages(from);
        chat.getMessages(from).forEach(message => chatView.renderMessage(message, this.state.users));
    }

    async init(show = false) {
        this.state.users.push(await new User().create(-1, true));

        chatView.renderDash(show);
        this.setupElements();
        this.setupEvents();
        this.setupIntervals();
        
        await this.handleNewMessages();
        chatView.scrollChatDown();
    }
}