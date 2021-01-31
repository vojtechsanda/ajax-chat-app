import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';

export default class Notify {
    constructor(status, heading, message) {
        this.state = {
            status,
            heading,
            message
        };

        this.init();
    }

    render() {
        alertify.notify(this.state.message, this.state.status, 5);
    }

    init() {
        this.render();
    }
}