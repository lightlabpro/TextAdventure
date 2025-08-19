/**
 * Game Engine - Core functionality for Lifeline-style text adventure
 * Handles real-time messaging, choice management, save/load, and game flow
 */

class GameEngine {
    constructor() {
        this.currentState = null;
        this.gameHistory = [];
        this.playerChoices = [];
        this.gameStartTime = null;
        this.fastMode = false;
        this.typingDelay = 50; // ms per character
        this.messageDelay = 2000; // ms between messages
        this.isTyping = false;
        this.gameStats = {
            choicesMade: 0,
            survivalTime: 0
        };
        
        this.initializeElements();
        this.bindEvents();
        this.loadGame();
    }

    initializeElements() {
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
    }

    bindEvents() {
        this.elements.rewindBtn.addEventListener('click', () => this.rewindToLastChoice());
        this.elements.fastModeBtn.addEventListener('click', () => this.toggleFastMode());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.tryDifferentBtn.addEventListener('click', () => this.rewindToLastChoice());

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => this.saveGame());
        
        // Handle visibility change for realistic timing
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseGame();
            } else {
                this.resumeGame();
            }
        });
    }

    async startGame() {
        this.gameStartTime = Date.now();
        this.currentState = STORY_DATA.start;
        this.clearMessages();
        
        // Show initial system message
        await this.addSystemMessage("📡 Establishing communication link...", 1000);
        await this.addSystemMessage("🔊 Signal acquired. Contact established.", 2000);
        
        // Start the story
        await this.processGameState();
    }

    async processGameState() {
        if (!this.currentState) {
            console.error('No current state found');
            return;
        }

        const state = this.currentState;
        
        // Update character info if provided
        if (state.character) {
            this.updateCharacterInfo(state.character);
        }

        // Show character messages
        if (state.messages) {
            for (let i = 0; i < state.messages.length; i++) {
                const message = state.messages[i];
                await this.showTypingIndicator();
                await this.addCharacterMessage(message);
                await this.hideTypingIndicator();
                
                if (i < state.messages.length - 1) {
                    await this.delay(this.getMessageDelay());
                }
            }
        }

        // Show choices or handle game end
        if (state.choices && state.choices.length > 0) {
            await this.delay(500);
            this.showChoices(state.choices);
            this.enableRewind();
        } else if (state.gameOver) {
            await this.delay(1000);
            this.showGameOver(state.gameOver);
        }

        // Auto-save progress
        this.saveGame();
    }

    async addCharacterMessage(messageText) {
        const messageElement = this.createMessageElement(messageText, 'character');
        this.elements.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Animate typing if not in fast mode
        if (!this.fastMode) {
            await this.animateTyping(messageElement.querySelector('.message-text'), messageText);
        }
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
            <div class="message-icon">📡</div>
            <div class="message-text">${messageText}</div>
        `;
        
        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    createMessageElement(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-from-${sender} fade-in`;
        
        const avatar = sender === 'character' ? '🚀' : '👤';
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

    async animateTyping(element, text) {
        if (this.fastMode) {
            element.textContent = text;
            return;
        }

        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(this.typingDelay);
        }
    }

    showChoices(choices) {
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
                    await this.addSystemMessage(`⏳ ${action.message || 'Processing...'}`);
                    await this.delay(action.duration || 3000);
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
        this.scrollToBottom();
    }

    async hideTypingIndicator() {
        this.isTyping = false;
        this.elements.typingIndicator.classList.add('hidden');
    }

    updateCharacterInfo(character) {
        if (character.name) {
            this.elements.characterName.textContent = character.name;
        }
        if (character.status) {
            this.updateConnectionStatus(character.status);
        }
    }

    updateConnectionStatus(status) {
        const statusElement = this.elements.connectionStatus;
        statusElement.className = `status-${status}`;
        
        const statusTexts = {
            online: '● Signal Strong',
            weak: '● Signal Weak',
            offline: '● Signal Lost'
        };
        
        statusElement.textContent = statusTexts[status] || statusTexts.online;
    }

    showGameOver(gameOverData) {
        this.updateGameStats();
        
        this.elements.gameOverTitle.textContent = gameOverData.title || 'Mission Complete';
        this.elements.gameOverMessage.textContent = gameOverData.message || 'You\'ve reached the end of this story branch.';
        this.elements.survivalTime.textContent = this.formatSurvivalTime();
        this.elements.choicesMade.textContent = this.gameStats.choicesMade.toString();
        
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
            // This is a simplified approach - in a real implementation,
            // you'd want to track message timestamps more precisely
            if (messages[i].classList.contains('message-from-player')) {
                messages[i].remove();
                break;
            }
        }
    }

    enableRewind() {
        this.elements.rewindBtn.disabled = false;
    }

    disableRewind() {
        this.elements.rewindBtn.disabled = true;
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
        return this.fastMode ? 100 : this.messageDelay;
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
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    clearMessages() {
        this.elements.messagesContainer.innerHTML = '';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    pauseGame() {
        // Handle game pause when tab becomes hidden
    }

    resumeGame() {
        // Handle game resume when tab becomes visible
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
        const saved = localStorage.getItem('textAdventureGame');
        if (saved) {
            try {
                const gameState = JSON.parse(saved);
                
                // Only load if there's meaningful progress
                if (gameState.playerChoices && gameState.playerChoices.length > 0) {
                    this.playerChoices = gameState.playerChoices;
                    this.gameStats = gameState.gameStats || { choicesMade: 0, survivalTime: 0 };
                    this.gameStartTime = gameState.gameStartTime;
                    this.fastMode = gameState.fastMode || false;
                    
                    if (gameState.currentState) {
                        this.currentState = this.getStateById(gameState.currentState);
                        this.elements.fastModeBtn.classList.toggle('active', this.fastMode);
                        this.processGameState();
                        return;
                    }
                }
            } catch (e) {
                console.warn('Failed to load saved game:', e);
            }
        }
        
        // Start new game if no valid save found
        this.startGame();
    }
}
```

