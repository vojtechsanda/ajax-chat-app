import { elements } from './base';

export const renderDash = (showDash = false) => {
    const markup = `
    <form method="POST" action='#' class="dash${!showDash ? ' dash--hidden' : ''} js-registration-form">
        <h2 class="dash__heading">Register</h2>
        <div class="dash__content-wrapper">
            <div class="dash__input-wrapper">
                <label class="dash__input-label" for="registration-email">E-mail</label>
                <input type="email" name="email" placeholder="john.doe@example.com" id="registration-email" class="dash__input" autocomplete="off" required>
            </div>
            <div class="dash__input-wrapper">
                <label class="dash__input-label" for="registration-password">Password</label>
                <input type="password" name="password" placeholder="••••••••" id="registration-password" class="dash__input" required>
            </div>
            <div class="dash__input-wrapper">
                <input type="submit" value="Register" class="dash__input dash__input--submit">
            </div>
        </div>
        <p class="dash__additional-note">Already have an account?<br><a href="?login" class="dash__link">Login here</a></p>
    </form>
    `;

    elements.mainWrapper.insertAdjacentHTML('beforeend', markup);
    
    elements.registrationForm = document.querySelector('.js-registration-form');
    elements.inputs = Array.from(elements.registrationForm.querySelectorAll('input:not([type="submit"])'));
}

export const toggle = () => {
    elements.registrationForm.classList.toggle('dash--hidden');
}
export const show = () => {
    elements.registrationForm.classList.remove('dash--hidden');
}
export const hide = () => {
    elements.registrationForm.classList.add('dash--hidden');
}

export const clearInputs = () => {
    elements.inputs.forEach(input => input.value = '');
}