// Development mode toggle
function toggleDevelopmentMode() {
    console.log('Toggle development mode clicked');
    document.body.classList.toggle('development-mode');
    const isDevelopmentMode = document.body.classList.contains('development-mode');
    console.log('Development mode is now:', isDevelopmentMode);
    localStorage.setItem('developmentMode', isDevelopmentMode);
}

// Wacht tot de DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing development mode toggle');
    
    // Check for saved development mode preference
    const savedMode = localStorage.getItem('developmentMode');
    console.log('Saved development mode:', savedMode);
    
    if (savedMode === 'true') {
        document.body.classList.add('development-mode');
        console.log('Development mode enabled from saved preference');
    }

    // Alleen tonen op localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        console.log('Niet op localhost, development mode knop wordt niet getoond.');
        return;
    }

    // Add development mode toggle button to header
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        console.log('Header content found, adding toggle button');
        const devModeButton = document.createElement('button');
        devModeButton.className = 'btn btn-secondary';
        devModeButton.textContent = 'Toggle Development Mode';
        devModeButton.onclick = toggleDevelopmentMode;
        headerContent.appendChild(devModeButton);
        console.log('Toggle button added to header');
    } else {
        console.error('Header content not found!');
    }

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