/**
 * japanese-elements.js
 * Manages Japanese language elements and text
 */

// Japanese text translations
const japaneseText = {
    // Game title and main screen
    gameTitle: 'ランナーゲーム',
    gameSubtitle: 'Angry Gran Run + Subway Surfers 風',
    gameInstructions: '左右にスワイプして障害物を避け、敵を倒してコインを集めよう！',
    
    // Buttons and controls
    startButton: 'ゲームスタート',
    pauseButton: '一時停止',
    resumeButton: 'ゲームに戻る',
    quitButton: 'タイトルに戻る',
    restartButton: 'もう一度プレイ',
    leftButton: '←',
    jumpButton: '↑',
    rightButton: '→',
    
    // Character selection
    characterSelection: 'キャラクター選択',
    defaultCharacter: 'デフォルト',
    customCharacter: 'カスタム',
    
    // Game elements
    score: 'スコア',
    coins: 'コイン',
    
    // Game over screen
    gameOver: 'ゲームオーバー',
    finalScore: 'スコア',
    finalCoins: 'コイン',
    
    // Customization
    customization: 'カスタマイズ',
    enemyImage: '敵の画像',
    backgroundImage: '背景の画像'
};

// Apply Japanese text to UI elements
function applyJapaneseText() {
    // Game title and instructions
    const titleElements = document.querySelectorAll('h1');
    titleElements.forEach(element => {
        if (element.textContent.trim() === 'ランナーゲーム') {
            element.textContent = japaneseText.gameTitle;
        } else if (element.textContent.trim() === 'ゲームオーバー') {
            element.textContent = japaneseText.gameOver;
        } else if (element.textContent.trim() === '一時停止') {
            element.textContent = japaneseText.pauseButton;
        }
    });
    
    // Game instructions
    const instructionElement = document.querySelector('#startScreen p');
    if (instructionElement) {
        instructionElement.textContent = japaneseText.gameInstructions;
    }
    
    // Buttons
    const startButtonElement = document.getElementById('startButton');
    if (startButtonElement) {
        startButtonElement.textContent = japaneseText.startButton;
    }
    
    const pauseButtonElement = document.getElementById('pauseButton');
    if (pauseButtonElement) {
        pauseButtonElement.textContent = japaneseText.pauseButton;
    }
    
    const resumeButtonElement = document.getElementById('resumeButton');
    if (resumeButtonElement) {
        resumeButtonElement.textContent = japaneseText.resumeButton;
    }
    
    const quitButtonElement = document.getElementById('quitButton');
    if (quitButtonElement) {
        quitButtonElement.textContent = japaneseText.quitButton;
    }
    
    const restartButtonElement = document.getElementById('restartButton');
    if (restartButtonElement) {
        restartButtonElement.textContent = japaneseText.restartButton;
    }
    
    const leftButtonElement = document.getElementById('leftButton');
    if (leftButtonElement) {
        leftButtonElement.textContent = japaneseText.leftButton;
    }
    
    const jumpButtonElement = document.getElementById('jumpButton');
    if (jumpButtonElement) {
        jumpButtonElement.textContent = japaneseText.jumpButton;
    }
    
    const rightButtonElement = document.getElementById('rightButton');
    if (rightButtonElement) {
        rightButtonElement.textContent = japaneseText.rightButton;
    }
    
    // Character selection
    const characterSelectionElement = document.querySelector('.character-select h2');
    if (characterSelectionElement) {
        characterSelectionElement.textContent = japaneseText.characterSelection;
    }
    
    const defaultCharacterElement = document.querySelector('[data-character="default"] p');
    if (defaultCharacterElement) {
        defaultCharacterElement.textContent = japaneseText.defaultCharacter;
    }
    
    const customCharacterElement = document.querySelector('[data-character="custom"] p');
    if (customCharacterElement) {
        customCharacterElement.textContent = japaneseText.customCharacter;
    }
    
    // Score and coins
    const scoreContainer = document.querySelector('.score-container');
    if (scoreContainer) {
        scoreContainer.childNodes[0].textContent = japaneseText.score + ': ';
    }
    
    const coinsContainer = document.querySelector('.coins-container');
    if (coinsContainer) {
        coinsContainer.childNodes[0].textContent = japaneseText.coins + ': ';
    }
    
    // Game over screen
    const finalScoreElement = document.querySelector('#gameOverScreen p:nth-child(2)');
    if (finalScoreElement) {
        finalScoreElement.childNodes[0].textContent = japaneseText.finalScore + ': ';
    }
    
    const finalCoinsElement = document.querySelector('#gameOverScreen p:nth-child(3)');
    if (finalCoinsElement) {
        finalCoinsElement.childNodes[0].textContent = japaneseText.finalCoins + ': ';
    }
    
    // Customization
    const customizationElement = document.querySelector('.customization-panel h3');
    if (customizationElement) {
        customizationElement.textContent = japaneseText.customization;
    }
    
    const enemyImageLabel = document.querySelector('label[for="customEnemy"]');
    if (enemyImageLabel) {
        enemyImageLabel.textContent = japaneseText.enemyImage + ':';
    }
    
    const backgroundImageLabel = document.querySelector('label[for="customBackground"]');
    if (backgroundImageLabel) {
        backgroundImageLabel.textContent = japaneseText.backgroundImage + ':';
    }
}

// Apply Japanese text when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    applyJapaneseText();
});

// Function to get Japanese text by key
function getJapaneseText(key) {
    return japaneseText[key] || '';
}

console.log('Japanese elements loaded successfully');
