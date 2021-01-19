//* SCSS
import '../sass/main.scss';

import RegistrationController from './components/controllers/RegistrationController'
import LoginController from './components/controllers/LoginController'
import ChatController from './components/controllers/ChatController'
import Redirector from './components/Redirector'

class App {
    constructor() {
        this.state = {};
        this.views = {};
        this.utilities = {};
    }
    analyzeUser() {
        this.state.token = localStorage.getItem('token');
    }
    showView(view = 'auto') {
        if (view === 'auto') {
            const currentUrlSearch = location.search.slice(1);

            if (this.state.token && currentUrlSearch !== 'chat') {
                this.utilities.redirector.toChat();
            } else if (!this.state.token && (currentUrlSearch !== 'login' && currentUrlSearch !== 'registration')) {
                this.utilities.redirector.toLogin();
            }

            this.views[currentUrlSearch].init(true);
        } else {
            this.utilities.redirector.changeSearch(view);
        }
    }
    setupViews() {
        this.views.registration = new RegistrationController;
        this.views.login = new LoginController;
        this.views.chat = new ChatController;
    }
    init() {
        this.utilities.redirector = new Redirector;

        this.setupViews();
        this.analyzeUser();
        this.showView();
    }
}

const app = new App;
app.init();