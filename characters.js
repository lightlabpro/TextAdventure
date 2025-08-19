/**
 * Character definitions for the text adventure
 */

const CHARACTERS = {
    alex_chen: {
        name: "Alex Chen",
        avatar: "🚀",
        role: "Research Scientist",
        background: "Xenobiologist aboard the research vessel Meridian, studying potential life signs near Europa.",
        personality: [
            "Intelligent and analytical",
            "Tends to overthink in crisis situations", 
            "Trusts the player's judgment",
            "Becomes more decisive under pressure"
        ],
        responses: {
            grateful: [
                "Thank you for staying with me through this.",
                "I couldn't have made it without your guidance.",
                "Your advice saved my life."
            ],
            scared: [
                "I'm really scared right now...",
                "What if we're making the wrong choice?",
                "I can hear the ship falling apart around me."
            ],
            determined: [
                "Okay, I can do this.",
                "You're right, I need to focus.",
                "Let's get through this together."
            ],
            technical: [
                "Let me check the system diagnostics...",
                "The readings are showing...",
                "According to the manual..."
            ]
        }
    }
};

// Character state management
class CharacterManager {
    constructor() {
        this.currentCharacter = CHARACTERS.alex_chen;
        this.mood = 'neutral';
        this.trustLevel = 50; // 0-100 scale
    }

    updateMood(newMood) {
        this.mood = newMood;
    }

    adjustTrust(delta) {
        this.trustLevel = Math.max(0, Math.min(100, this.trustLevel + delta));
    }

    getResponse(type) {
        const responses = this.currentCharacter.responses[type];
        if (responses && responses.length > 0) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return "...";
    }

    willFollowAdvice() {
        // Character is more likely to follow advice if trust is high
        return Math.random() * 100 < this.trustLevel;
    }
}
