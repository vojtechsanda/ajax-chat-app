import { elements } from './base';

export const renderDash = (showDash = false) => {
    const markup = `
    <div class="dash dash--smaller${!showDash ? ' dash--hidden' : ''} js-chat-container">
        <h2 class="dash__heading">Chat</h2>
        <div class="dash__content-wrapper">
            <div class="chat__wrapper js-chat__wrapper">

            </div>
            <form class="chat__send js-send-message-form" method="POST" action="#">
                <input type="text" name="message" class="chat__send-input js-chat__send-input" placeholder="Type here..." autocomplete="off">
                <button class="chat__send-btn"><svg class="chat__send-icon"><use href="/assets/imgs/sprite.svg#icon-send"></use></svg></button>
            </form>

        </div>
    </div>
    `;

    elements.mainWrapper.insertAdjacentHTML('beforeend', markup);
    
    elements.chatContainer = elements.mainWrapper.querySelector('.js-chat-container');
    elements.messageInput = elements.chatContainer.querySelector('.js-chat__send-input');
    elements.chatWrapper = elements.chatContainer.querySelector('.js-chat__wrapper');
}

export const renderMessage = (message, users) => {
    const currentUser = getCurrentUser(users);

    const messageDate = new Date(message.timestamp);
    const messageTimeTxt = `${formatNumber2Digits(messageDate.getHours())}:${formatNumber2Digits(messageDate.getMinutes())}:${formatNumber2Digits(messageDate.getSeconds())}`;
    const messageDateTxt = `${messageDate.getDate()}.${messageDate.getMonth() + 1}.${messageDate.getFullYear()}`;

    const markup = `
    <div class="chat__message chat__message${currentUser.getId() === message.user_id ? '--my' : ''} js-chat__message" data-message-id="${message.id}">
        <span class="chat__message-header">User ${message.user_id} | ${messageTimeTxt} ${messageDateTxt}</span>
        <span class="chat__message-txt">${message.message}</span>
    </div>
    `;

    elements.chatWrapper.insertAdjacentHTML('beforeend', markup);
}

export const scrollChatDown = () => {
    setTimeout(() => {
        elements.chatWrapper.scrollTo(0, elements.chatWrapper.scrollHeight);
    }, 1)
}

export const toggle = () => {
    elements.chatContainer.classList.toggle('dash--hidden');
}

export const show = () => {
    elements.chatContainer.classList.remove('dash--hidden');
}

export const hide = () => {
    elements.chatContainer.classList.add('dash--hidden');
}

export const clearInput = () => {
    elements.messageInput.value = '';
}

export const removeMessages = from => {
    const messageElems = Array.from(elements.chatWrapper.querySelectorAll('.js-chat__message'));

    messageElems.slice(from).forEach(elem => elem.parentElement.removeChild(elem));
}

function formatNumber2Digits(num) {
    if (num >= 10) {
        return `${num}`;
    }

    return `0${num}`;
}

function getCurrentUser(users) {
    return users.find(user => user.currentUser);
}