//* SCSS
import '../sass/chat.scss';

class Chat {
    constructor() {
        
    }
    setElements() {
        this.elements = {};
        this.elements.chatHeader = document.querySelector('.js-chat__header');
        this.elements.chatWindow = document.querySelector('.js-chat__content');
    }
    setUpEvents() {
        this.elements.chatHeader.addEventListener('click', () => {
            this.elements.chatWindow.classList.toggle('chat__content--opened');
        })
    }
    init() {
        this.setElements();
        this.setUpEvents();
    }
}

const chat = new Chat();
chat.init();