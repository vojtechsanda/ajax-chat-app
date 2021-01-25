import Api from './Api'

const api = new Api('https://localhost');

export default class User {
    constructor() {
        this.state = {
            signedUserToken: localStorage.getItem('token')
        }
    }
    
    async fetchInfo(id) {
        return await api.getUser(this.state.signedUserToken, id);
    }

    async setInfo(id) {
        const userInfo = await this.fetchInfo(id);
        this.id = userInfo.data.id;
        this.email = userInfo.data.email;
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email
    }
    
    async create(id, currentUser) {
        this.currentUser = currentUser;
        this.setInfo(id);

        return this;
    }
}