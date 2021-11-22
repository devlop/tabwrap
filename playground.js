import { tabwrap } from './dist/index.js';

document.querySelector('#playground-instructions')?.remove();

document.querySelectorAll('a[href="#"]').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
    });
});

document.querySelectorAll('[data-tabwrap]').forEach(function (element) {
    tabwrap(element);
});
