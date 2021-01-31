export default class ApiStatus {
    constructor (status, code, message, data = '') {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    getStatus() {
        return this.status;
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }

    getData() {
        return this.data;
    }

    getAll() {
        return {
            status: this.getStatus(),
            code: this.getCode(),
            message: this.getMessage(),
            data: this.getData()
        };
    }
}