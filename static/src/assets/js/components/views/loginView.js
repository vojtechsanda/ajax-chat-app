import { elements } from './base';

export const renderDash = (showDash = false) => {
    const markup = `
    <form method="POST" action='#' class="dash${!showDash ? ' dash--hidden' : ''} js-login-form">
        <h2 class="dash__heading">Login</h2>
        <div class="dash__content-wrapper">
            <div class="dash__input-wrapper">
                <label class="dash__input-label" for="user-authentication-email">E-mail</label>
                <input type="email" name="email" placeholder="john.doe@example.com" id="user-authentication-email" class="dash__input" autocomplete="off" required>
            </div>
            <div class="dash__input-wrapper">
                <label class="dash__input-label" for="user-authentication-password">Password</label>
                <input type="password" name="password" placeholder="••••••••" id="user-authentication-password" class="dash__input" required>
            </div>
            <div class="dash__input-wrapper">
                <input type="submit" value="Log in" class="dash__input dash__input--submit">
            </div>
        </div>
        <p class="dash__additional-note">Don't have an account?<br><a href="?registration" class="dash__link">Register here</a></p>
    </form>
    `;

    elements.mainWrapper.insertAdjacentHTML('beforeend', markup);

    elements.loginForm = document.querySelector('.js-login-form');
    elements.inputs = Array.from(elements.loginForm.querySelectorAll('input:not([type="submit"])'));
}

export const toggle = () => {
    elements.loginForm.classList.toggle('dash--hidden');
}

export const show = () => {
    elements.loginForm.classList.remove('dash--hidden');
}

export const hide = () => {
    elements.loginForm.classList.add('dash--hidden');
}

export const clearInputs = () => {
    elements.inputs.forEach(input => input.value = '');
}

export const getLoginFormElement = () => {
    return elements.loginForm;
}