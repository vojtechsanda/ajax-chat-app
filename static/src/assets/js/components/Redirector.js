export default class Redirector {
    toRegistration() {
        location.search = '?registration';
    }

    toLogin() {
        location.search = '?login';
    }

    toChat() {
        location.search = '?chat';
    }

    changeSearch(searchTxt) {
        location.search = `?${searchTxt}`;
    }

    redirectTo(url) {
        location.href = url;
    }
}