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
        alert(this.state.heading + ' ' + (this.state.status === 'error' ? 'Error: ' : (this.state.status === 'info' ? 'Info: ' : 'Success: ')) + this.state.message);
    }
    init() {
        this.render();
    }
}