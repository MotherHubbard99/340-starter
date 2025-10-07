const pwButton = document.querySelector('#pwButton');
pwButton.addEventListener('click', function() {
    const pwInput = document.getElementById('accountPassword');
    const type = pwInput.getAttribute('type');
    if (type === 'password') {
        pwInput.setAttribute('type', 'text');
        pwButton.innerHTML = 'Hide Password';
    } else {
        pwInput.setAttribute('type', 'password');
        pwButton.innerHTML = 'Show Password';                                                   
    }
});