// Debug script for mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug script loaded');
    
    // Get references to elements
    const floatingHamburger = document.getElementById('floatingHamburger');
    const sidebar = document.getElementById('sidebarNav');
    const sidebarChapters = document.getElementById('sidebarChapters');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    // Expose manual toggle function to global scope for console access
    window.toggleSidebar = function() {
        console.log('Manual sidebar toggle');
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
        
        // Log the state after toggle
        console.log('Sidebar state:', {
            isOpen: sidebar.classList.contains('open'),
            bodyHasOpenClass: document.body.classList.contains('sidebar-open'),
            left: getComputedStyle(sidebar).left
        });
    };
    
    // Log initial element states
    console.log('Initial sidebar state:', {
        sidebar: sidebar ? {
            classList: sidebar.classList.toString(),
            display: getComputedStyle(sidebar).display,
            left: getComputedStyle(sidebar).left,
            visibility: getComputedStyle(sidebar).visibility,
            opacity: getComputedStyle(sidebar).opacity,
            zIndex: getComputedStyle(sidebar).zIndex
        } : 'Not found',
        
        sidebarChapters: sidebarChapters ? {
            childCount: sidebarChapters.children.length,
            display: getComputedStyle(sidebarChapters).display,
            visibility: getComputedStyle(sidebarChapters).visibility,
            opacity: getComputedStyle(sidebarChapters).opacity
        } : 'Not found',
        
        sidebarOverlay: sidebarOverlay ? {
            display: getComputedStyle(sidebarOverlay).display,
            opacity: getComputedStyle(sidebarOverlay).opacity
        } : 'Not found'
    });
    
    // Add click listener to hamburger
    if (floatingHamburger) {
        floatingHamburger.addEventListener('click', function() {
            console.log('Hamburger clicked');
            
            // Short delay to allow CSS transitions to apply
            setTimeout(() => {
                // Log sidebar state after click
                console.log('Sidebar state after click:', {
                    hasOpenClass: sidebar.classList.contains('open'),
                    sidebarStyle: {
                        display: getComputedStyle(sidebar).display,
                        left: getComputedStyle(sidebar).left,
                        visibility: getComputedStyle(sidebar).visibility,
                        opacity: getComputedStyle(sidebar).opacity,
                        transform: getComputedStyle(sidebar).transform
                    },
                    bodyHasSidebarOpenClass: document.body.classList.contains('sidebar-open'),
                    overlayStyle: sidebarOverlay ? {
                        display: getComputedStyle(sidebarOverlay).display,
                        opacity: getComputedStyle(sidebarOverlay).opacity
                    } : 'Not found',
                    chaptersStyle: sidebarChapters ? {
                        display: getComputedStyle(sidebarChapters).display,
                        visibility: getComputedStyle(sidebarChapters).visibility,
                        opacity: getComputedStyle(sidebarChapters).opacity
                    } : 'Not found'
                });
                
                // Log chapter elements
                if (sidebarChapters) {
                    const chapters = Array.from(sidebarChapters.children);
                    console.log('Chapter elements:', chapters.map(ch => ({
                        section: ch.getAttribute('data-section'),
                        display: getComputedStyle(ch).display,
                        visibility: getComputedStyle(ch).visibility,
                        opacity: getComputedStyle(ch).opacity
                    })));
                }
            }, 300);
        });
    } else {
        console.error('Floating hamburger not found!');
    }
    
    // Log message about debugging feature
    console.log('Debug tools available: Use window.toggleSidebar() to manually toggle the sidebar');
    
    // Auto-open sidebar for mobile testing (comment this out for production)
    // if (window.innerWidth <= 900) {
    //     console.log('Auto-opening sidebar for testing in mobile view');
    //     setTimeout(() => {
    //         window.toggleSidebar();
    //     }, 1000);
    // }
}); 