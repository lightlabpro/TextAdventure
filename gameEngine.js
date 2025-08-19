/**
 * Game Engine - Core functionality for Lifeline-style text adventure
 * CLEAN VERSION - No emojis, dramatic timing
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
            survivalTime: 0
        };
        
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

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => this.saveGame());
        console.log('Events bound');
    }

    async startGame() {
        console.log('Starting game...');
        this.gameStartTime = Date.now();
        this.currentState = STORY_DATA.start;
        this.clearMessages();
        
        // Dramatic introduction sequence
        await this.addSystemMessage("ESTABLISHING COMMUNICATION LINK...", 1000);
        await this.delay(2000);
        await this.addSystemMessage("SIGNAL ACQUIRED. CONTACT ESTABLISHED.", 1000);
        await this.delay(1500);
        await this.addSystemMessage("INCOMING TRANSMISSION FROM MERIDIAN...", 1000);
        await this.delay(2000);
        
        // Start the story
        await this.processGameState();
    }

    async processGameState() {
        console.log('Processing game state:', this.currentState?.id);
        if (!this.currentState) {
            console.error('No current state found');
            return;
        }

        const state = this.currentState;
        
        // Update character info if provided
        if (state.character) {
            this.updateCharacterInfo(state.character);
        }

        // Show character messages with dramatic timing
        if (state.messages) {
            for (let i = 0; i < state.messages.length; i++) {
                const message = state.messages[i];
                await this.showTypingIndicator();
                
                // Longer typing time for more dramatic effect
                if (!this.fastMode) {
                    await this.delay(2000 + (message.length * 50)); // More realistic typing time
                }
                
                await this.hideTypingIndicator();
                await this.addCharacterMessage(message);
                
                if (i < state.messages.length - 1) {
                    await this.delay(this.getMessageDelay());
                }
            }
        }

        // Show choices or handle game end
        if (state.choices && state.choices.length > 0) {
            await this.delay(1000);
            this.showChoices(state.choices);
            this.enableRewind();
        } else if (state.gameOver) {
            await this.delay(2000);
            this.showGameOver(state.gameOver);
        }

        // Auto-save progress
        this.saveGame();
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

    scrollToBottom() {
        const chatArea = document.getElementById('chat-area');
        if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
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
}