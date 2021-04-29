export default class AntiSpam {
    constructor() {
        this.state = {
            sentMessagesTimestamps: []
        }
    }

    canSendMessage() {
        if (!this.isCooldownOk()) {
            console.error("You can send just 5 messages per second.");
            return false;
        }

        return true;
    }

    isCooldownOk() {
        const lastSecondsMessages = this.state.sentMessagesTimestamps.filter(timestamp => timestamp > ((new Date).getTime() - 1000));

        return lastSecondsMessages.length < 5;
    }

    logMessage(formData = new FormData) {
        this.state.sentMessagesTimestamps.push((new Date).getTime());
    }
}