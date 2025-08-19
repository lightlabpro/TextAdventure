/**
 * Main game initialization and control
 */

let gameEngine;
let characterManager;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    gameEngine = new GameEngine();
    characterManager = new CharacterManager();
    
    // Add some mobile-specific optimizations
    addMobileOptimizations();
    
    // Show loading message briefly
    showInitialLoading();
});

function addMobileOptimizations() {
    // Prevent zoom on input focus (iOS)
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    // Prevent rubber band scrolling
    document.body.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Add touch feedback for buttons
    document.addEventListener('touchstart', (e) => {
        if (e.target.matches('.choice-btn, .control-btn, .action-btn')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (e.target.matches('.choice-btn, .control-btn, .action-btn')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }
    });
}

function showInitialLoading() {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = `
        <div class="system-message fade-in">
            <div class="message-icon">🛸</div>
            <div class="message-text">Space Lifeline Loading...</div>
        </div>
    `;
    
    setTimeout(() => {
        messagesContainer.innerHTML = '';
    }, 2000);
}

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add to home screen prompt for iOS
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

// Handle app installation
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Keyboard shortcuts for desktop testing
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        gameEngine.toggleFastMode();
    } else if (e.key === 'r' || e.key === 'R') {
        if (!gameEngine.elements.rewindBtn.disabled) {
            gameEngine.rewindToLastChoice();
        }
    } else if (e.key >= '1' && e.key <= '9') {
        const choiceIndex = parseInt(e.key) - 1;
        const choices = document.querySelectorAll('.choice-btn');
        if (choices[choiceIndex]) {
            choices[choiceIndex].click();
        }
    }
});
```

```

