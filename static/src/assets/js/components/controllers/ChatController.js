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
            new Notify('error', 'Message sending', 'Error occurred while sending your message.');
        }
    }

    async handleNewMessages() {
        if (!this.getCurrentUser()) {
            await this.createCurrentUser();
        }
        const newMessages = await chat.getNewMessages();
        
        if (newMessages && this.getCurrentUser()) {
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
            new Notify('error', 'Downloading messages', 'Error: Can\'t download new messages.');
        }
    }

    syncMessages(from = 0) {
        chatView.removeMessages(from);
        chat.getMessages(from).forEach(message => chatView.renderMessage(message, this.state.users));
    }

    getCurrentUser() {
        return this.state.users.find(user => user.currentUser);
    }

    async createCurrentUser() {
        const newUser = await new User().create(-1, true);

        if (newUser) {
            this.state.users.push(newUser);
        }
    }
    
    async init(show = false) {
        this.createCurrentUser();

        chatView.renderDash(show);
        this.setupElements();
        this.setupEvents();
        this.setupIntervals();
        
        await this.handleNewMessages();
        chatView.scrollChatDown();
    }
}