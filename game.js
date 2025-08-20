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
        
        // Register Service Worker (optional)
        registerServiceWorker();
        
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

// Simple fallback game start function
function startSimpleGame() {
    console.log('Starting simple fallback game...');
    
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="system-message fade-in">
                <div class="message-text">ESTABLISHING COMMUNICATION LINK...</div>
            </div>
        `;
        
        // Add a simple message after a delay
        setTimeout(() => {
            messagesContainer.innerHTML += `
                <div class="character-message fade-in">
                    <div class="message-header">
                        <span class="character-name">Alex Chen</span>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                    <div class="message-text">Hey, can you hear me? This is Alex Chen from the research vessel Meridian. I need your help... something's gone terribly wrong up here.</div>
                </div>
            `;
            
            // Add choice buttons
            const choicesContainer = document.getElementById('choices-container');
            if (choicesContainer) {
                choicesContainer.innerHTML = `
                    <button class="choice-btn" onclick="handleChoice('status')">What's your current status?</button>
                    <button class="choice-btn" onclick="handleChoice('escape')">Get to the escape pods immediately!</button>
                    <button class="choice-btn" onclick="handleChoice('systems')">Tell me about the ship's systems</button>
                `;
            }
        }, 3000);
    }
}

// Simple choice handler
function handleChoice(choice) {
    console.log('Choice made:', choice);
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
        messagesContainer.innerHTML += `
            <div class="player-message fade-in">
                <div class="message-text">Choice: ${choice}</div>
            </div>
        `;
    }
}

// Cinematic intro sequence - TYPING ANIMATION VERSION
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
    
    // Add control buttons
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'intro-controls';
    controlsDiv.innerHTML = `
        <button class="intro-btn" id="next-btn" style="display: none;">NEXT</button>
        <button class="intro-btn" id="skip-intro-btn">SKIP INTRO</button>
    `;
    introScreen.appendChild(controlsDiv);
    
    const nextBtn = document.getElementById('next-btn');
    const skipBtn = document.getElementById('skip-intro-btn');
    
    const introSequence = [
        { text: "SPACE RESCUE", type: "title", duration: 5000 },
        { text: "A TEXT ADVENTURE", type: "subtitle", duration: 3000 },
        { text: "YEAR 2157", type: "year", duration: 3000 },
        { text: "INTERSTELLAR EMERGENCY RESPONSE CENTER", type: "location", duration: 3000 },
        { text: "LUNA COMMAND HUB", type: "location", duration: 3000 },
        { text: "YOU ARE COMMANDER SARAH CHEN", type: "character", duration: 3000 },
        { text: "SENIOR COMMUNICATIONS SPECIALIST", type: "character", duration: 3000 },
        { text: "SUCCESSFULLY GUIDED 47 VESSELS", type: "stats", duration: 3000 },
        { text: "SURVIVAL RATE: 94%", type: "stats", duration: 3000 },
        { text: "EMERGENCY ALERT", type: "alert", duration: 3000 },
        { text: "14:32 UTC - RESEARCH VESSEL MERIDIAN", type: "mission", duration: 3000 },
        { text: "REPORTS ANOMALOUS READINGS NEAR EUROPA", type: "mission", duration: 3000 },
        { text: "COMMANDED BY CAPTAIN ELENA RODRIGUEZ", type: "mission", duration: 3000 },
        { text: "CONTACT LOST DURING INVESTIGATION", type: "mission", duration: 3000 },
        { text: "DISTRESS SIGNAL INDICATES:", type: "status", duration: 3000 },
        { text: "HULL BREACH IN MULTIPLE COMPARTMENTS", type: "status", duration: 3000 },
        { text: "LIFE SUPPORT SYSTEMS COMPROMISED", type: "status", duration: 3000 },
        { text: "CRITICAL DAMAGE TO PROPULSION", type: "status", duration: 3000 },
        { text: "UNKNOWN NUMBER OF CASUALTIES", type: "status", duration: 3000 },
        { text: "YOUR MISSION", type: "mission", duration: 3000 },
        { text: "ESTABLISH COMMUNICATION WITH SURVIVORS", type: "mission", duration: 3000 },
        { text: "ASSESS THE SITUATION", type: "mission", duration: 3000 },
        { text: "PROVIDE GUIDANCE", type: "mission", duration: 3000 },
        { text: "COORDINATE RESCUE EFFORTS", type: "mission", duration: 3000 },
        { text: "EVERY DECISION MATTERS", type: "dramatic", duration: 3000 },
        { text: "IN SPACE, THERE ARE NO SECOND CHANCES", type: "dramatic", duration: 3000 },
        { text: "ESTABLISHING COMMUNICATION LINK...", type: "system", duration: 3000 }
    ];
    
    let currentIndex = 0;
    let skipIntro = false;
    
    // Skip intro button handler
    skipBtn.addEventListener('click', () => {
        skipIntro = true;
        startGameAfterIntro();
    });
    
    // Next button handler
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex < introSequence.length) {
            displayNextLine();
        } else {
            startGameAfterIntro();
        }
    });
    
    // Function to display next line with typing animation
    async function displayNextLine() {
        if (skipIntro) return;
        
        const item = introSequence[currentIndex];
        
        // Clear previous content
        introContent.innerHTML = '';
        
        // Create text element
        const textElement = document.createElement('div');
        textElement.className = `intro-text ${item.type === 'title' ? 'intro-title' : ''}`;
        introContent.appendChild(textElement);
        
        // Type out the text character by character
        const text = item.text;
        let currentText = '';
        
        for (let i = 0; i < text.length; i++) {
            if (skipIntro) return;
            
            currentText += text[i];
            textElement.textContent = currentText + '█'; // Add cursor
            
            // Organic timing: faster for short text, slower for long text
            const baseDelay = 50; // Base delay per character
            const lengthMultiplier = Math.max(0.5, Math.min(2, text.length / 30)); // Adjust based on text length
            const delay = baseDelay * lengthMultiplier;
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Remove cursor and add blinking cursor
        textElement.textContent = currentText;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        textElement.appendChild(cursor);
        
        // Calculate organic display time based on text length
        const baseTime = 2000; // Base time in ms
        const lengthMultiplier = Math.max(0.8, Math.min(3, text.length / 20)); // Adjust based on text length
        const displayTime = baseTime * lengthMultiplier;
        
        // Show next button after a short delay
        setTimeout(() => {
            if (!skipIntro) {
                nextBtn.style.display = 'inline-block';
            }
        }, 1000);
        
        // Auto-advance after organic time (unless skipped)
        setTimeout(() => {
            if (!skipIntro) {
                currentIndex++;
                if (currentIndex < introSequence.length) {
                    nextBtn.style.display = 'none';
                    displayNextLine();
                } else {
                    startGameAfterIntro();
                }
            }
        }, displayTime);
    }
    
    // Start the sequence
    displayNextLine();
}

// Function to start game after intro
function startGameAfterIntro() {
    console.log('Intro sequence complete, starting game...');
    console.log('Game engine exists:', !!gameEngine);
    
    // Hide intro screen
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        introScreen.style.display = 'none';
    }
    
    // Show game container
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.display = 'block';
        console.log('Game container shown');
    }
    
    // Try to start the game
    if (gameEngine && typeof gameEngine.startGame === 'function') {
        console.log('Calling gameEngine.startGame()');
        try {
            gameEngine.startGame();
            console.log('Game started successfully');
        } catch (error) {
            console.error('Error starting game:', error);
            console.log('Falling back to simple game...');
            startSimpleGame();
        }
    } else {
        console.error('Game engine not available or startGame method missing');
        console.log('Falling back to simple game...');
        startSimpleGame();
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

// Service Worker Registration - Optional for local development
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Only register if we're on a proper server (not file:// protocol)
        if (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed (this is normal for local development):', error);
                });
        } else {
            console.log('Service Worker not registered - running from local file (this is normal)');
        }
    } else {
        console.log('Service Worker not supported in this browser');
    }
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
