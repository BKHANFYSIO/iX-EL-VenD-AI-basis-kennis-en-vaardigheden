// Helper functie voor development logging
window.devLog = function(...args) {
    const isDevelopmentMode = document.body.classList.contains('development-mode');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDevelopmentMode || isLocalhost) {
        console.log(...args);
    }
}

// Wacht tot de DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    // Collapsible sections voor style-guide
    var coll = document.getElementsByClassName('collapsible');
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function() {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }
}); 