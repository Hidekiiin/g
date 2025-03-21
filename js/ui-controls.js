/**
 * ui-controls.js
 * Handles user interface controls and interactions
 */

// Initialize UI controls once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Game control buttons
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resumeButton = document.getElementById('resumeButton');
    const quitButton = document.getElementById('quitButton');
    const restartButton = document.getElementById('restartButton');
    
    // Movement control buttons
    const leftButton = document.getElementById('leftButton');
    const jumpButton = document.getElementById('jumpButton');
    const rightButton = document.getElementById('rightButton');
    
    // Character selection
    const characterOptions = document.querySelectorAll('.character-option');
    const customCharacterInput = document.getElementById('customCharacter');
    
    // Custom image inputs
    const customEnemyInput = document.getElementById('customEnemy');
    const customBackgroundInput = document.getElementById('customBackground');
    
    // Game screens
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const pauseScreen = document.getElementById('pauseScreen');
    
    // Add event listeners to game control buttons
    if (startButton) {
        startButton.addEventListener('click', function() {
            startGame();
        });
    }
    
    if (pauseButton) {
        pauseButton.addEventListener('click', function() {
            pauseGame();
        });
    }
    
    if (resumeButton) {
        resumeButton.addEventListener('click', function() {
            resumeGame();
        });
    }
    
    if (quitButton) {
        quitButton.addEventListener('click', function() {
            quitGame();
        });
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', function() {
            restartGame();
        });
    }
    
    // Add event listeners to movement control buttons
    if (leftButton) {
        leftButton.addEventListener('click', function() {
            moveLeft();
        });
        
        // Also add touch events for mobile
        leftButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            moveLeft();
        });
    }
    
    if (jumpButton) {
        jumpButton.addEventListener('click', function() {
            jump();
        });
        
        // Also add touch events for mobile
        jumpButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            jump();
        });
    }
    
    if (rightButton) {
        rightButton.addEventListener('click', function() {
            moveRight();
        });
        
        // Also add touch events for mobile
        rightButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            moveRight();
        });
    }
    
    // Add event listeners for character selection
    if (characterOptions) {
        characterOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                characterOptions.forEach(function(opt) {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Set character type
                const characterType = this.getAttribute('data-character');
                setCharacter(characterType);
            });
        });
    }
    
    // Add event listeners for custom image uploads
    if (customCharacterInput) {
        customCharacterInput.addEventListener('change', function() {
            handleImageUpload(this, 'player');
        });
    }
    
    if (customEnemyInput) {
        customEnemyInput.addEventListener('change', function() {
            handleImageUpload(this, 'enemy');
        });
    }
    
    if (customBackgroundInput) {
        customBackgroundInput.addEventListener('change', function() {
            handleImageUpload(this, 'background');
        });
    }
    
    // Add keyboard controls
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowUp':
                jump();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'Escape':
                pauseGame();
                break;
            case ' ':
                if (startScreen && !startScreen.classList.contains('hidden')) {
                    startGame();
                } else if (gameOverScreen && !gameOverScreen.classList.contains('hidden')) {
                    restartGame();
                } else if (pauseScreen && !pauseScreen.classList.contains('hidden')) {
                    resumeGame();
                }
                break;
        }
    });
    
    // Placeholder functions that will be connected to game.js
    function startGame() {
        console.log('Starting game...');
        if (startScreen) {
            startScreen.classList.add('hidden');
        }
        // This will be connected to game.js functionality
        if (typeof window.gameStart === 'function') {
            window.gameStart();
        }
    }
    
    function pauseGame() {
        console.log('Pausing game...');
        if (pauseScreen) {
            pauseScreen.classList.remove('hidden');
        }
        // This will be connected to game.js functionality
        if (typeof window.gamePause === 'function') {
            window.gamePause();
        }
    }
    
    function resumeGame() {
        console.log('Resuming game...');
        if (pauseScreen) {
            pauseScreen.classList.add('hidden');
        }
        // This will be connected to game.js functionality
        if (typeof window.gameResume === 'function') {
            window.gameResume();
        }
    }
    
    function quitGame() {
        console.log('Quitting game...');
        if (pauseScreen) {
            pauseScreen.classList.add('hidden');
        }
        if (startScreen) {
            startScreen.classList.remove('hidden');
        }
        // This will be connected to game.js functionality
        if (typeof window.gameQuit === 'function') {
            window.gameQuit();
        }
    }
    
    function restartGame() {
        console.log('Restarting game...');
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
        // This will be connected to game.js functionality
        if (typeof window.gameRestart === 'function') {
            window.gameRestart();
        }
    }
    
    function moveLeft() {
        console.log('Moving left...');
        // This will be connected to game.js functionality
        if (typeof window.playerMoveLeft === 'function') {
            window.playerMoveLeft();
        }
    }
    
    function jump() {
        console.log('Jumping...');
        // This will be connected to game.js functionality
        if (typeof window.playerJump === 'function') {
            window.playerJump();
        }
    }
    
    function moveRight() {
        console.log('Moving right...');
        // This will be connected to game.js functionality
        if (typeof window.playerMoveRight === 'function') {
            window.playerMoveRight();
        }
    }
    
    function setCharacter(type) {
        console.log('Setting character to: ' + type);
        // This will be connected to game.js functionality
        if (typeof window.setPlayerCharacter === 'function') {
            window.setPlayerCharacter(type);
        }
    }
    
    function handleImageUpload(input, type) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                console.log('Custom ' + type + ' image uploaded');
                // Set the custom image in the placeholder-images.js
                if (typeof setCustomImage === 'function') {
                    setCustomImage(type, e.target.result);
                }
                
                // If it's a player character, select the custom character option
                if (type === 'player') {
                    characterOptions.forEach(function(opt) {
                        if (opt.getAttribute('data-character') === 'custom') {
                            opt.classList.add('selected');
                            setCharacter('custom');
                        } else {
                            opt.classList.remove('selected');
                        }
                    });
                }
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    }
});

console.log('UI controls loaded successfully');
