//* SCSS
import '../sass/main.scss';

import Registration from './components/registration'
import UserAuthentication from './components/UserAuthentication'

const registration = new Registration;
const userAuthentication = new UserAuthentication;

registration.init();
userAuthentication.init();

console.log(registration);
