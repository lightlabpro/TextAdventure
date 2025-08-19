/**
 * Main game initialization and control - FIXED VERSION
 */

let gameEngine;
let characterManager;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    try {
        // Initialize character manager first
        characterManager = new CharacterManager();
        console.log('Character manager initialized');
        
        // Initialize game engine
        gameEngine = new GameEngine();
        console.log('Game engine initialized');
        
        // Add mobile optimizations
        addMobileOptimizations();
        console.log('Mobile optimizations added');
        
        // Start the cinematic intro sequence immediately
        startCinematicIntro();
        
    } catch (error) {
        console.error('Error initializing game:', error);
        // Show error message to user
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="system-message fade-in">
                    <div class="message-text">Game initialization error. Please refresh the page.</div>
                </div>
            `;
        }
    }
});

// Cinematic intro sequence - FIXED VERSION
async function startCinematicIntro() {
    const introScreen = document.getElementById('intro-screen');
    const introContent = document.getElementById('intro-content');
    
    if (!introScreen || !introContent) {
        console.error('Intro elements not found');
        return;
    }
    
    // Show intro screen immediately
    introScreen.style.display = 'flex';
    
    // Clear any existing content
    introContent.innerHTML = '';
    
    const introTexts = [
        { text: "SPACE RESCUE", type: "title", delay: 1200 },
        { text: "A TEXT ADVENTURE", type: "subtitle", delay: 1000 },
        { text: "YEAR 2157", type: "year", delay: 1000 },
        { text: "Deep space exploration vessel MERIDIAN", type: "location", delay: 1200 },
        { text: "has lost contact with Earth", type: "location", delay: 1000 },
        { text: "You are the last hope", type: "dramatic", delay: 1000 },
        { text: "for the crew's survival", type: "dramatic", delay: 1000 },
        { text: "Establishing emergency communication link...", type: "system", delay: 1200 },
        { text: "TAP TO BEGIN", type: "start", delay: 800 }
    ];
    
    // Display each line with cinematic timing
    for (let i = 0; i < introTexts.length; i++) {
        const item = introTexts[i];
        
        // COMPLETELY clear previous content
        introContent.innerHTML = '';
        
        // Create and display the text element
        const textElement = document.createElement('div');
        textElement.className = `intro-${item.type}`;
        textElement.textContent = item.text;
        
        // Force absolute positioning in center
        textElement.style.position = 'absolute';
        textElement.style.top = '50%';
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.style.margin = '0';
        textElement.style.padding = '0';
        textElement.style.width = 'auto';
        textElement.style.height = 'auto';
        
        introContent.appendChild(textElement);
        
        // Special animation for title (but start immediately)
        if (item.type === 'title') {
            textElement.style.opacity = '1';
            textElement.style.transform = 'translate(-50%, -50%) scale(1)';
            textElement.style.transition = 'all 0.8s ease';
            
            // Start with scale animation
            setTimeout(() => {
                textElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
                setTimeout(() => {
                    textElement.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 200);
            }, 100);
        }
        
        // If this is the start prompt, make it clickable
        if (item.type === 'start') {
            textElement.style.cursor = 'pointer';
            textElement.onclick = () => {
                introScreen.style.display = 'none';
                if (gameEngine) {
                    gameEngine.startGame();
                }
            };
        }
        
        // Wait before next line (but not for the first line)
        if (i < introTexts.length - 1) {
            await delay(item.delay);
        }
    }
}

// Utility function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addMobileOptimizations() {
    // Prevent zoom on input focus (iOS)
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
    
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

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Keyboard shortcuts for desktop testing
document.addEventListener('keydown', (e) => {
    if (!gameEngine) return;
    
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
