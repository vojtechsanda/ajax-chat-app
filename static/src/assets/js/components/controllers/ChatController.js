import Notify from '../Notify';
import User from '../User'

import * as chatView from '../views/chatView';
import Chat from '../models/Chat';

const chat = new Chat;

export default class ChatController {
    constructor() {
        this.intervals = {};
        this.state = {
            users: [],
            lockSearchNext: false,
            reachedOldestMessage: false
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

    setupEvents() {
        chatView.getChatWrapper().addEventListener('scroll', async e => {
            if (!this.state.lockSearchNext && e.target.scrollTop < 200 && !this.state.reachedOldestMessage) {
                this.state.lockSearchNext = true;
                
                const oldMessages = await chat.getOldMessages();
                await this.handleNewMessages(oldMessages.getData(), true);

                if (oldMessages.getData().length === 0) {
                    this.state.reachedOldestMessage = true;
                }

                this.state.lockSearchNext = false;
            }
        })


        chatView.getSendFormElement().addEventListener('submit', e => {
            e.preventDefault();

            if (chatView.getMessageInput().value.length > 0) {
                this.sendMessage(e.target);
            }
        })
        chatView.getLogoutBtnElement().addEventListener('click', chat.logout);
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

    async handleNewMessages(messages = [], areOldMessages = false) {
        if (!this.getCurrentUser()) {
            await this.createCurrentUser();
        }

        messages = messages.length === 0 ? await chat.getNewMessages() : messages;

        if (messages && this.getCurrentUser()) {
            if (messages.length > 0) {
                if (areOldMessages) {
                    chat.addOldMessages(messages);
                    messages.reverse().forEach(message => {
                        chatView.renderMessage(message, this.state.users, true);
                    })
                } else {
                    const lastVerifiedMessageId = chat.getLastVerifiedMessageId();
                    const newVerifiedMessageId = messages[messages.length - 1].id;
                    
                    if (lastVerifiedMessageId !== newVerifiedMessageId) {
                        const lastVerifiedIndex = chat.getLastVerifiedMessageIndex();
    
                        if (lastVerifiedIndex === -1) {
                            chat.setMessages(messages);
                        } else {
                            chat.updateMessages(messages, lastVerifiedIndex);
                        }
        
                        this.syncMessages(lastVerifiedIndex === -1 ? 0 : lastVerifiedIndex);
                        chatView.scrollChatDown();
        
                        chat.updateLastVerifiedMessageId(newVerifiedMessageId);
                    }
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
        this.setupEvents();
        this.setupIntervals();
        
        await this.handleNewMessages();
        chatView.scrollChatDown();
    }
}