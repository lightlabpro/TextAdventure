/**
 * Game Engine - Core functionality for Lifeline-style text adventure
 * ENHANCED VERSION - Added timer, stress system, and new gameplay elements
 */

class GameEngine {
    constructor() {
        console.log('GameEngine constructor called');
        this.currentState = null;
        this.gameHistory = [];
        this.playerChoices = [];
        this.gameStartTime = null;
        this.fastMode = false;
        this.typingDelay = 50; // ms per character
        this.messageDelay = 3000; // ms between messages - longer for drama
        this.isTyping = false;
        this.gameStats = {
            choicesMade: 0,
            survivalTime: 0, // New: 0-100 scale
            stressLevel: 0, // New: 0-100 scale
            trustLevel: 50, // New: 0-100 scale
            oxygenLevel: 100, // New: 0-100 scale
            powerLevel: 100 // New: 0-100 scale
        };
        
        // New gameplay elements
        this.timer = null;
        this.stressTimer = null;
        this.oxygenTimer = null;
        this.powerTimer = null;
        this.criticalEvents = [];
        this.achievements = [];
        
        this.initializeElements();
        this.bindEvents();
        console.log('GameEngine initialized successfully');
    }

    initializeElements() {
        console.log('Initializing elements...');
        this.elements = {
            messagesContainer: document.getElementById('messages-container'),
            choicesContainer: document.getElementById('choices-container'),
            typingIndicator: document.getElementById('typing-indicator'),
            characterName: document.getElementById('character-name'),
            connectionStatus: document.getElementById('connection-status'),
            rewindBtn: document.getElementById('rewind-btn'),
            fastModeBtn: document.getElementById('fast-mode-btn'),
            gameOverScreen: document.getElementById('game-over-screen'),
            gameOverTitle: document.getElementById('game-over-title'),
            gameOverMessage: document.getElementById('game-over-message'),
            survivalTime: document.getElementById('survival-time'),
            choicesMade: document.getElementById('choices-made'),
            restartBtn: document.getElementById('restart-btn'),
            tryDifferentBtn: document.getElementById('try-different-btn')
        };
        
        // Check if all elements were found
        for (let [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`Element not found: ${key}`);
            }
        }
        console.log('Elements initialized');
    }

    bindEvents() {
        console.log('Binding events...');
        if (this.elements.rewindBtn) {
            this.elements.rewindBtn.addEventListener('click', () => this.rewindToLastChoice());
        }
        if (this.elements.fastModeBtn) {
            this.elements.fastModeBtn.addEventListener('click', () => this.toggleFastMode());
        }
        if (this.elements.restartBtn) {
            this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        }
        if (this.elements.tryDifferentBtn) {
            this.elements.tryDifferentBtn.addEventListener('click', () => this.rewindToLastChoice());
        }

        // Control buttons
        const fastModeBtn = document.getElementById('fast-mode-btn');
        const rewindBtn = document.getElementById('rewind-btn');
        const restartBtn = document.getElementById('restart-btn');
        const saveBtn = document.getElementById('save-btn');
        const loadBtn = document.getElementById('load-btn');
        
        if (fastModeBtn) {
            fastModeBtn.addEventListener('click', () => {
                this.fastMode = !this.fastMode;
                fastModeBtn.textContent = this.fastMode ? 'Normal Mode' : 'Fast Mode';
            });
        }
        
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => this.rewind());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.showSaveCode());
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.showLoadCode());
        }

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => this.saveGame());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Save: Ctrl+S
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.showSaveCode();
            }
            // Load: Ctrl+L
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.showLoadCode();
            }
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        console.log('Events bound');
    }

    async startGame() {
        console.log('Starting game...');
        this.gameStartTime = Date.now();
        this.currentState = STORY_DATA.start;
        this.clearMessages();
        
        // Initialize stats but don't display them yet
        this.gameStats = {
            choicesMade: 0,
            survivalTime: 0,
            stressLevel: 35, // Already stressed from the crash
            trustLevel: 50,
            oxygenLevel: 78, // Damaged life support
            powerLevel: 42 // Damaged systems
        };
        
        // Proper connection sequence
        await this.addSystemMessage("ESTABLISHING COMMUNICATION LINK...", 1000);
        await this.delay(2000);
        await this.addSystemMessage("SIGNAL ACQUIRED. CONTACT ESTABLISHED.", 1000);
        await this.delay(1500);
        await this.addSystemMessage("INCOMING TRANSMISSION FROM MERIDIAN...", 1000);
        await this.delay(2000);
        
        // Character establishes connection
        await this.addCharacterMessage("Hey, can you hear me? This is Alex Chen from the research vessel Meridian.");
        await this.delay(3000);
        await this.addCharacterMessage("I need your help... something's gone terribly wrong up here.");
        await this.delay(3000);
        
        // Give player a chance to respond
        this.showChoices([
            {
                text: "I can hear you, Alex. This is Commander Sarah Chen at Luna Command. What's your situation?",
                type: "professional",
                next: "establish_contact"
            },
            {
                text: "Copy that, Meridian. We're receiving you loud and clear. What's your emergency?",
                type: "military",
                next: "establish_contact"
            },
            {
                text: "Alex, this is Luna Command. We're here to help. Tell us what happened.",
                type: "supportive",
                next: "establish_contact"
            }
        ]);
    }

    async processGameState() {
        console.log('Processing game state:', this.currentState?.id);
        if (!this.currentState) {
            console.error('No current state found');
            return;
        }

        const state = this.currentState;
        
        // Apply telemetry effects if present
        if (state.telemetry_effect) {
            this.applyTelemetryEffect(state.telemetry_effect);
        }
        
        // Check for ending
        if (state.ending) {
            await this.showEnding(state.ending);
            return;
        }

        // Display messages
        for (const message of state.messages) {
            await this.addCharacterMessage(message);
            await this.delay(this.fastMode ? 500 : this.messageDelay);
            
            // Add telemetry system messages when character mentions transmitting data
            if (message.includes("transmitting") || message.includes("telemetry")) {
                await this.delay(1000);
                await this.addSystemMessage("TELEMETRY LINK ESTABLISHED. RECEIVING VITAL SIGNS AND SHIP DATA...", 1000);
                await this.delay(2000);
                
                // Start gameplay systems and show stats
                this.startGameplayTimers();
                this.updateStatusDisplay();
                
                await this.addSystemMessage(`WARNING: OXYGEN LEVELS AT ${this.gameStats.oxygenLevel}%. POWER SYSTEMS AT ${this.gameStats.powerLevel}%. STRESS INDICATORS ELEVATED.`, 1000);
                await this.delay(2000);
            }
        }

        // Show choices
        if (state.choices) {
            this.showChoices(state.choices);
        }
    }

    async addCharacterMessage(messageText) {
        console.log('Adding character message:', messageText);
        
        // Create message element
        const messageElement = this.createMessageElement(messageText, 'character');
        this.elements.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Add a subtle fade-in effect
        const messageTextElement = messageElement.querySelector('.message-text');
        messageTextElement.style.opacity = '0';
        messageTextElement.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            messageTextElement.style.opacity = '1';
        }, 50);
    }

    async addPlayerMessage(messageText) {
        const messageElement = this.createMessageElement(messageText, 'player');
        this.elements.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    async addSystemMessage(messageText, delay = 0) {
        if (delay > 0) {
            await this.delay(delay);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message fade-in';
        messageDiv.innerHTML = `
            <div class="message-icon">SYS</div>
            <div class="message-text">${messageText}</div>
        `;
        
        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    createMessageElement(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-from-${sender} fade-in`;
        
        const avatar = sender === 'character' ? 'A' : 'U';
        const avatarClass = sender === 'character' ? 'character-avatar-msg' : 'player-avatar-msg';
        
        messageDiv.innerHTML = `
            <div class="message-avatar ${avatarClass}">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-timestamp">${this.getTimestamp()}</div>
            </div>
        `;
        
        return messageDiv;
    }

    showChoices(choices) {
        console.log('Showing choices:', choices.length);
        this.elements.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = `choice-btn ${choice.type || ''}`;
            button.textContent = choice.text;
            button.addEventListener('click', () => this.makeChoice(choice, index));
            
            this.elements.choicesContainer.appendChild(button);
        });
    }

    async makeChoice(choice, index) {
        console.log('Making choice:', choice.text);
        // Record the choice
        this.gameStats.choicesMade++;
        this.playerChoices.push({
            state: this.currentState.id,
            choice: choice,
            index: index,
            timestamp: Date.now()
        });

        // Add player message
        await this.addPlayerMessage(choice.text);
        
        // Clear choices
        this.elements.choicesContainer.innerHTML = '';
        
        // Execute choice action if any
        if (choice.action) {
            await this.executeAction(choice.action);
        }
        
        // Move to next state
        if (choice.next) {
            this.currentState = this.getStateById(choice.next);
            await this.delay(this.getMessageDelay());
            await this.processGameState();
        }
    }

    async executeAction(action) {
        switch (action.type) {
            case 'delay':
                if (!this.fastMode) {
                    await this.addSystemMessage(`${action.message || 'PROCESSING...'}`);
                    await this.delay(action.duration || 4000);
                }
                break;
                
            case 'signal_change':
                this.updateConnectionStatus(action.status);
                break;
                
            case 'system_message':
                await this.addSystemMessage(action.message);
                break;
        }
    }

    async showTypingIndicator() {
        if (this.fastMode) return;
        
        this.isTyping = true;
        this.elements.typingIndicator.classList.remove('hidden');
        
        // Update typing text to show character name
        const typingText = this.elements.typingIndicator.querySelector('.typing-text');
        if (typingText) {
            const characterName = this.elements.characterName?.textContent || 'CONTACT';
            typingText.textContent = `${characterName} IS TRANSMITTING...`;
        }
        
        this.scrollToBottom();
    }

    async hideTypingIndicator() {
        this.isTyping = false;
        this.elements.typingIndicator.classList.add('hidden');
    }

    updateCharacterInfo(character) {
        if (character.name && this.elements.characterName) {
            this.elements.characterName.textContent = character.name;
        }
        if (character.status) {
            this.updateConnectionStatus(character.status);
        }
    }

    updateConnectionStatus(status) {
        const statusElement = this.elements.connectionStatus;
        if (!statusElement) return;
        
        statusElement.className = `status-${status}`;
        
        const statusTexts = {
            online: 'SIGNAL STRONG',
            weak: 'SIGNAL WEAK',
            offline: 'SIGNAL LOST'
        };
        
        statusElement.textContent = statusTexts[status] || statusTexts.online;
    }

    showGameOver(gameOverData) {
        this.updateGameStats();
        
        if (this.elements.gameOverTitle) {
            this.elements.gameOverTitle.textContent = gameOverData.title || 'MISSION COMPLETE';
        }
        if (this.elements.gameOverMessage) {
            this.elements.gameOverMessage.textContent = gameOverData.message || 'Communication terminated.';
        }
        if (this.elements.survivalTime) {
            this.elements.survivalTime.textContent = this.formatSurvivalTime();
        }
        if (this.elements.choicesMade) {
            this.elements.choicesMade.textContent = this.gameStats.choicesMade.toString();
        }
        
        this.elements.gameOverScreen.classList.remove('hidden');
        this.elements.gameOverScreen.classList.add('fade-in');
    }

    toggleFastMode() {
        this.fastMode = !this.fastMode;
        this.elements.fastModeBtn.classList.toggle('active', this.fastMode);
        
        if (this.fastMode) {
            this.hideTypingIndicator();
        }
    }

    rewindToLastChoice() {
        if (this.playerChoices.length === 0) return;
        
        // Remove last choice and go back to that state
        const lastChoice = this.playerChoices.pop();
        this.currentState = this.getStateById(lastChoice.state);
        this.gameStats.choicesMade = Math.max(0, this.gameStats.choicesMade - 1);
        
        // Remove messages after the choice
        this.rewindMessages(lastChoice.timestamp);
        
        // Process the state again
        this.processGameState();
        
        if (this.playerChoices.length === 0) {
            this.disableRewind();
        }
    }

    rewindMessages(timestamp) {
        const messages = this.elements.messagesContainer.children;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].classList.contains('message-from-player')) {
                messages[i].remove();
                break;
            }
        }
    }

    enableRewind() {
        if (this.elements.rewindBtn) {
            this.elements.rewindBtn.disabled = false;
        }
    }

    disableRewind() {
        if (this.elements.rewindBtn) {
            this.elements.rewindBtn.disabled = true;
        }
    }

    restartGame() {
        this.gameHistory = [];
        this.playerChoices = [];
        this.gameStats = { choicesMade: 0, survivalTime: 0 };
        this.fastMode = false;
        this.elements.fastModeBtn.classList.remove('active');
        this.elements.gameOverScreen.classList.add('hidden');
        this.disableRewind();
        this.startGame();
    }

    // Utility methods
    getStateById(id) {
        return STORY_DATA[id] || null;
    }

    getTimestamp() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    getMessageDelay() {
        return this.fastMode ? 200 : this.messageDelay;
    }

    updateGameStats() {
        if (this.gameStartTime) {
            this.gameStats.survivalTime = Date.now() - this.gameStartTime;
        }
    }

    formatSurvivalTime() {
        const hours = Math.floor(this.gameStats.survivalTime / (1000 * 60 * 60));
        const minutes = Math.floor((this.gameStats.survivalTime % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    // Auto-scroll to bottom of messages
    scrollToBottom() {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    clearMessages() {
        if (this.elements.messagesContainer) {
            this.elements.messagesContainer.innerHTML = '';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Save/Load functionality
    saveGame() {
        const gameState = {
            currentState: this.currentState?.id,
            playerChoices: this.playerChoices,
            gameStats: this.gameStats,
            gameStartTime: this.gameStartTime,
            fastMode: this.fastMode
        };
        
        localStorage.setItem('textAdventureGame', JSON.stringify(gameState));
    }

    loadGame() {
        // For now, always start fresh to maintain dramatic intro
        this.startGame();
    }

    // Password-based save system (like classic SNES games) - 12-digit numeric codes
    generateSaveCode() {
        const saveData = {
            state: this.currentState?.id || 'start',
            choices: this.playerChoices,
            stats: this.gameStats,
            startTime: this.gameStartTime,
            timestamp: Date.now()
        };
        
        // Convert to compact numeric code
        const saveCode = this.encodeToNumericCode(saveData);
        
        return saveCode;
    }

    encodeToNumericCode(saveData) {
        // Create a compact representation
        const stateId = this.getStateNumericId(saveData.state);
        const choicesHash = this.hashChoices(saveData.choices);
        const statsHash = this.hashStats(saveData.stats);
        
        // Combine into 12 digits: SSSS-CCCC-STATS
        // SSSS = State ID (4 digits)
        // CCCC = Choices hash (4 digits) 
        // STATS = Stats hash (4 digits)
        
        const statePart = stateId.toString().padStart(4, '0');
        const choicesPart = (choicesHash % 10000).toString().padStart(4, '0');
        const statsPart = (statsHash % 10000).toString().padStart(4, '0');
        
        return `${statePart}${choicesPart}${statsPart}`;
    }

    getStateNumericId(stateId) {
        // Map story states to numeric IDs
        const stateMap = {
            'start': 1000,
            'establish_contact': 1001,
            'assess_injury': 1002,
            'diagnostic_check': 1003,
            'power_reroute': 1004,
            'find_route': 1005,
            'maintenance_shaft': 1006,
            'shaft_escape': 1007,
            'reach_pods': 1008,
            'launch_escape': 1009,
            'debris_shortcut': 1010,
            'trapped_escape': 1011,
            'stabilize_ship': 1012,
            'emergency_protocols': 1013,
            'beacon_launch': 1014,
            'time_assessment': 1015,
            'oxygen_optimization': 1016,
            'escape_priority': 1017,
            'calm_approach': 1018,
            'schematic_check': 1019,
            'service_corridor': 1020,
            'pod_check': 1021,
            'pod_systems_check': 1022,
            'fix_navigation': 1023,
            'emergency_oxygen': 1024
        };
        
        return stateMap[stateId] || 1000;
    }

    hashChoices(choices) {
        // Create a hash from player choices
        let hash = 0;
        choices.forEach((choice, index) => {
            const choiceHash = choice.text.length + choice.type.length + index;
            hash = (hash * 31 + choiceHash) % 10000;
        });
        return hash;
    }

    hashStats(stats) {
        // Create a hash from game stats
        const oxygen = Math.floor(stats.oxygenLevel / 10);
        const power = Math.floor(stats.powerLevel / 10);
        const stress = Math.floor(stats.stressLevel / 10);
        const trust = Math.floor(stats.trustLevel / 10);
        const choices = stats.choicesMade % 100;
        
        return (oxygen * 1000 + power * 100 + stress * 10 + trust + choices) % 10000;
    }

    loadFromSaveCode(saveCode) {
        try {
            // Validate code format
            if (!/^\d{12}$/.test(saveCode)) {
                throw new Error('Invalid code format');
            }
            
            // Parse the 12-digit code
            const statePart = parseInt(saveCode.substring(0, 4));
            const choicesPart = parseInt(saveCode.substring(4, 8));
            const statsPart = parseInt(saveCode.substring(8, 12));
            
            // Decode state
            const stateId = this.getStateIdFromNumeric(statePart);
            if (!stateId) {
                throw new Error('Invalid state code');
            }
            
            // Decode stats (approximate reconstruction)
            const stats = this.decodeStats(statsPart);
            
            // Restore game state
            this.currentState = STORY_DATA[stateId] || STORY_DATA.start;
            this.playerChoices = []; // Can't fully reconstruct choices from hash
            this.gameStats = stats;
            this.gameStartTime = Date.now();
            
            // Clear messages and restart timers
            this.clearMessages();
            this.startGameplayTimers();
            this.updateStatusDisplay();
            
            // Show load success message
            this.addSystemMessage("SAVE CODE LOADED SUCCESSFULLY", 1000);
            this.addSystemMessage(`CONTINUING FROM: ${this.currentState.id.toUpperCase()}`, 1000);
            
            // Continue from current state
            this.processGameState();
            
            return true;
        } catch (error) {
            console.error('Failed to load save code:', error);
            this.addSystemMessage("INVALID SAVE CODE", 1000);
            return false;
        }
    }

    getStateIdFromNumeric(numericId) {
        // Reverse mapping from numeric ID to state ID
        const reverseMap = {
            1000: 'start',
            1001: 'establish_contact',
            1002: 'assess_injury',
            1003: 'diagnostic_check',
            1004: 'power_reroute',
            1005: 'find_route',
            1006: 'maintenance_shaft',
            1007: 'shaft_escape',
            1008: 'reach_pods',
            1009: 'launch_escape',
            1010: 'debris_shortcut',
            1011: 'trapped_escape',
            1012: 'stabilize_ship',
            1013: 'emergency_protocols',
            1014: 'beacon_launch',
            1015: 'time_assessment',
            1016: 'oxygen_optimization',
            1017: 'escape_priority',
            1018: 'calm_approach',
            1019: 'schematic_check',
            1020: 'service_corridor',
            1021: 'pod_check',
            1022: 'pod_systems_check',
            1023: 'fix_navigation',
            1024: 'emergency_oxygen'
        };
        
        return reverseMap[numericId];
    }

    decodeStats(statsHash) {
        // Approximate reconstruction of stats from hash
        const oxygen = Math.floor((statsHash / 1000) % 10) * 10;
        const power = Math.floor((statsHash / 100) % 10) * 10;
        const stress = Math.floor((statsHash / 10) % 10) * 10;
        const trust = Math.floor(statsHash % 10) * 10;
        
        return {
            choicesMade: 0, // Reset choices since we can't reconstruct them
            survivalTime: 0,
            stressLevel: stress,
            trustLevel: trust,
            oxygenLevel: oxygen,
            powerLevel: power
        };
    }

    showSaveCode() {
        const saveCode = this.generateSaveCode();
        
        // Format code with dashes for readability: XXXX-XXXX-XXXX
        const formattedCode = `${saveCode.substring(0, 4)}-${saveCode.substring(4, 8)}-${saveCode.substring(8, 12)}`;
        
        // Create save code display
        const saveDisplay = document.createElement('div');
        saveDisplay.className = 'save-code-display';
        saveDisplay.innerHTML = `
            <div class="save-code-header">
                <h3>SAVE CODE</h3>
                <p>Tap to copy this code to continue later</p>
            </div>
            <div class="save-code-content">
                <span class="save-code-label">CODE:</span>
                <span class="save-code-value" id="save-code-text">${formattedCode}</span>
            </div>
            <div class="save-code-info">
                <p>Game State: ${this.currentState?.id || 'start'}</p>
                <p>Choices Made: ${this.gameStats.choicesMade}</p>
                <p>Oxygen: ${this.gameStats.oxygenLevel}% | Power: ${this.gameStats.powerLevel}%</p>
            </div>
            <button class="save-code-close" onclick="this.parentElement.remove()">CLOSE</button>
        `;
        
        // Add click to copy functionality (copy without dashes)
        const codeElement = saveDisplay.querySelector('#save-code-text');
        codeElement.addEventListener('click', () => {
            navigator.clipboard.writeText(saveCode).then(() => {
                codeElement.classList.add('copied');
                setTimeout(() => codeElement.classList.remove('copied'), 2000);
            });
        });
        
        // Add to page
        document.body.appendChild(saveDisplay);
    }

    showLoadCode() {
        // Create load code input
        const loadDisplay = document.createElement('div');
        loadDisplay.className = 'load-code-display';
        loadDisplay.innerHTML = `
            <div class="load-code-header">
                <h3>LOAD SAVE CODE</h3>
                <p>Enter your save code to continue</p>
            </div>
            <div class="load-code-content">
                <textarea id="load-code-input" placeholder="Paste your save code here..."></textarea>
            </div>
            <div class="load-code-actions">
                <button class="load-code-btn" onclick="gameEngine.loadFromInput()">LOAD</button>
                <button class="load-code-close" onclick="gameEngine.closeLoadWindow()">CANCEL</button>
            </div>
        `;
        
        // Add click outside to close
        loadDisplay.addEventListener('click', (e) => {
            if (e.target === loadDisplay) {
                this.closeLoadWindow();
            }
        });
        
        // Add to page
        document.body.appendChild(loadDisplay);
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('load-code-input');
            if (input) input.focus();
        }, 100);
    }

    closeLoadWindow() {
        const loadDisplay = document.querySelector('.load-code-display');
        if (loadDisplay) {
            loadDisplay.remove();
        }
    }

    closeAllModals() {
        // Close load window
        this.closeLoadWindow();
        
        // Close save window
        const saveDisplay = document.querySelector('.save-code-display');
        if (saveDisplay) {
            saveDisplay.remove();
        }
    }

    loadFromInput() {
        const input = document.getElementById('load-code-input');
        let saveCode = input.value.trim();
        
        // Remove dashes and spaces for processing
        saveCode = saveCode.replace(/[-\s]/g, '');
        
        if (saveCode) {
            const success = this.loadFromSaveCode(saveCode);
            if (success) {
                // Close the load display
                const loadDisplay = document.querySelector('.load-code-display');
                if (loadDisplay) loadDisplay.remove();
            }
        } else {
            this.addSystemMessage("PLEASE ENTER A SAVE CODE", 1000);
        }
    }

    // New: Start gameplay timers
    startGameplayTimers() {
        // Main game timer
        this.timer = setInterval(() => {
            this.updateGameTime();
        }, 1000);

        // Stress level timer (increases over time)
        this.stressTimer = setInterval(() => {
            this.updateStressLevel();
        }, 5000);

        // Oxygen level timer (decreases over time)
        this.oxygenTimer = setInterval(() => {
            this.updateOxygenLevel();
        }, 8000);

        // Power level timer (decreases over time)
        this.powerTimer = setInterval(() => {
            this.updatePowerLevel();
        }, 10000);
    }

    // New: Update game time
    updateGameTime() {
        if (this.gameStartTime) {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            this.gameStats.survivalTime = elapsed;
            this.updateStatusDisplay();
            
            // Check for critical time-based events
            this.checkCriticalEvents(elapsed);
        }
    }

    // New: Update stress level
    updateStressLevel() {
        if (this.gameStats.stressLevel < 100) {
            this.gameStats.stressLevel += Math.floor(Math.random() * 3) + 1;
            this.updateStatusDisplay();
            
            // High stress affects character behavior
            if (this.gameStats.stressLevel > 80) {
                this.addStressEffect();
            }
        }
    }

    // New: Update oxygen level
    updateOxygenLevel() {
        if (this.gameStats.oxygenLevel > 0) {
            this.gameStats.oxygenLevel -= Math.floor(Math.random() * 2) + 1;
            this.updateStatusDisplay();
            
            // Low oxygen creates urgency
            if (this.gameStats.oxygenLevel < 20) {
                this.addOxygenWarning();
            }
        }
    }

    // New: Update power level
    updatePowerLevel() {
        if (this.gameStats.powerLevel > 0) {
            this.gameStats.powerLevel -= Math.floor(Math.random() * 2) + 1;
            this.updateStatusDisplay();
            
            // Low power affects systems
            if (this.gameStats.powerLevel < 30) {
                this.addPowerWarning();
            }
        }
    }

    // New: Update status display
    updateStatusDisplay() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            const oxygen = this.gameStats.oxygenLevel;
            const power = this.gameStats.powerLevel;
            const stress = this.gameStats.stressLevel;
            
            let status = `O2: ${oxygen}% | PWR: ${power}% | STRESS: ${stress}%`;
            
            if (oxygen < 20) status += ' | OXYGEN CRITICAL';
            if (power < 30) status += ' | POWER LOW';
            if (stress > 80) status += ' | STRESS HIGH';
            
            statusElement.textContent = status;
            
            // Update status color based on conditions
            if (oxygen < 20 || power < 30) {
                statusElement.className = 'status-weak';
            } else if (stress > 80) {
                statusElement.className = 'status-stress';
            } else {
                statusElement.className = 'status-online';
            }
        }
    }

    // New: Add stress effects
    addStressEffect() {
        if (Math.random() < 0.3) { // 30% chance
            this.addSystemMessage("WARNING: CHARACTER SHOWING SIGNS OF PANIC", 1000);
        }
    }

    // New: Add oxygen warnings
    addOxygenWarning() {
        if (Math.random() < 0.4) { // 40% chance
            this.addSystemMessage("CRITICAL: OXYGEN LEVELS DANGEROUSLY LOW", 1000);
        }
    }

    // New: Add power warnings
    addPowerWarning() {
        if (Math.random() < 0.4) { // 40% chance
            this.addSystemMessage("WARNING: POWER SYSTEMS FAILING", 1000);
        }
    }

    // New: Check for critical events
    checkCriticalEvents(elapsedTime) {
        // Example: At 5 minutes, oxygen systems start failing faster
        if (elapsedTime === 300 && !this.criticalEvents.includes('oxygen_crisis')) {
            this.criticalEvents.push('oxygen_crisis');
            this.addSystemMessage("CRITICAL: LIFE SUPPORT SYSTEMS DEGRADING", 1000);
            // Increase oxygen consumption rate
            clearInterval(this.oxygenTimer);
            this.oxygenTimer = setInterval(() => {
                this.updateOxygenLevel();
            }, 4000); // Twice as fast
        }
    }

    // Enhanced choice processing with telemetry effects
    async processChoice(choice) {
        this.playerChoices.push(choice);
        this.gameStats.choicesMade++;
        
        // Add player message to show the choice
        await this.addPlayerMessage(choice.text);
        await this.delay(1000);
        
        // Handle restart
        if (choice.type === 'restart') {
            this.restartGame();
            return;
        }
        
        // Handle save completion
        if (choice.type === 'save_completion') {
            this.showSaveCode();
            return;
        }
        
        // Update trust level based on choice type
        if (choice.type === 'safe') {
            this.gameStats.trustLevel += 5;
        } else if (choice.type === 'urgent') {
            this.gameStats.trustLevel -= 3;
            this.gameStats.stressLevel += 10;
        } else if (choice.type === 'technical') {
            this.gameStats.trustLevel += 3;
        } else if (choice.type === 'supportive') {
            this.gameStats.trustLevel += 8;
            this.gameStats.stressLevel -= 5;
        } else if (choice.type === 'professional') {
            this.gameStats.trustLevel += 2;
        } else if (choice.type === 'military') {
            this.gameStats.trustLevel += 1;
        }
        
        // Clamp values
        this.gameStats.trustLevel = Math.max(0, Math.min(100, this.gameStats.trustLevel));
        this.gameStats.stressLevel = Math.max(0, Math.min(100, this.gameStats.stressLevel));
        
        this.updateStatusDisplay();
        
        // Process the choice
        if (choice.next && STORY_DATA[choice.next]) {
            this.currentState = STORY_DATA[choice.next];
            await this.processGameState();
        }
    }

    restartGame() {
        // Clear messages
        this.clearMessages();
        
        // Reset game state
        this.currentState = null;
        this.gameHistory = [];
        this.playerChoices = [];
        this.gameStartTime = null;
        
        // Reset stats
        this.gameStats = {
            choicesMade: 0,
            survivalTime: 0,
            stressLevel: 35,
            trustLevel: 50,
            oxygenLevel: 78,
            powerLevel: 42
        };
        
        // Stop all timers
        if (this.timer) clearInterval(this.timer);
        if (this.stressTimer) clearInterval(this.stressTimer);
        if (this.oxygenTimer) clearInterval(this.oxygenTimer);
        if (this.powerTimer) clearInterval(this.powerTimer);
        
        // Hide game over screen if visible
        const gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
        
        // Start fresh
        this.startGame();
    }

    applyTelemetryEffect(effect) {
        if (effect.oxygenLevel !== undefined) {
            this.gameStats.oxygenLevel = effect.oxygenLevel;
        }
        if (effect.powerLevel !== undefined) {
            this.gameStats.powerLevel = effect.powerLevel;
        }
        if (effect.stressLevel !== undefined) {
            this.gameStats.stressLevel = effect.stressLevel;
        }
        if (effect.trustLevel !== undefined) {
            this.gameStats.trustLevel = effect.trustLevel;
        }
        
        this.updateStatusDisplay();
    }

    async showEnding(ending) {
        // Stop all timers
        if (this.timer) clearInterval(this.timer);
        if (this.stressTimer) clearInterval(this.stressTimer);
        if (this.oxygenTimer) clearInterval(this.oxygenTimer);
        if (this.powerTimer) clearInterval(this.powerTimer);
        
        // Show ending message
        await this.addSystemMessage(`MISSION ${ending.type.toUpperCase()}: ${ending.title}`, 2000);
        await this.delay(2000);
        await this.addSystemMessage(ending.message, 2000);
        await this.delay(2000);
        
        // Show final stats
        if (ending.stats) {
            await this.addSystemMessage(`SURVIVAL TIME: ${ending.stats.survivalTime}`, 1000);
            await this.addSystemMessage(`CHOICES MADE: ${ending.stats.choicesMade}`, 1000);
            await this.addSystemMessage(`TRUST LEVEL: ${ending.stats.trustLevel}`, 1000);
            await this.addSystemMessage(`ENDING: ${ending.stats.ending}`, 1000);
        }
        
        // Show ending options
        this.showChoices([
            {
                text: "Save Completion Code",
                type: "save_completion",
                next: "save_completion"
            },
            {
                text: "Play Again",
                type: "restart",
                next: "restart"
            }
        ]);
    }
}