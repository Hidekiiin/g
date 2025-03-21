/**
 * game-integration.js
 * Integrates various game components and initializes the game
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game variables
    let gameRunning = false;
    let gameCanvas = document.getElementById('gameCanvas');
    let gameContext = gameCanvas ? gameCanvas.getContext('2d') : null;
    let selectedCharacter = 'default';
    let useCustomEnemy = false;
    let useCustomBackground = false;
    
    // Set up global game functions that ui-controls.js will call
    window.gameStart = function() {
        console.log('Game integration: Starting game');
        gameRunning = true;
        initGame();
    };
    
    window.gamePause = function() {
        console.log('Game integration: Pausing game');
        gameRunning = false;
    };
    
    window.gameResume = function() {
        console.log('Game integration: Resuming game');
        gameRunning = true;
        // Resume game loop
        if (!gameLoopRunning) {
            gameLoop();
        }
    };
    
    window.gameQuit = function() {
        console.log('Game integration: Quitting game');
        gameRunning = false;
        resetGame();
    };
    
    window.gameRestart = function() {
        console.log('Game integration: Restarting game');
        resetGame();
        gameRunning = true;
        initGame();
    };
    
    window.playerMoveLeft = function() {
        console.log('Game integration: Player moving left');
        if (typeof movePlayerLeft === 'function') {
            movePlayerLeft();
        }
    };
    
    window.playerJump = function() {
        console.log('Game integration: Player jumping');
        // game.jsのjump関数を呼び出す（関数名が異なることを確認）
        if (typeof jumpPlayer === 'function') {
            jumpPlayer();
        }
    };
    
    
    window.playerMoveRight = function() {
        console.log('Game integration: Player moving right');
        if (typeof movePlayerRight === 'function') {
            movePlayerRight();
        }
    };
    
    window.setPlayerCharacter = function(type) {
        console.log('Game integration: Setting player character to ' + type);
        selectedCharacter = type;
        // Update player image if game is already initialized
        if (typeof updatePlayerImage === 'function') {
            updatePlayerImage(getImage('player', selectedCharacter === 'custom'));
        }
    };
    
    // Initialize the game
    function initGame() {
        console.log('Game integration: Initializing game');
        
        // Set up canvas size
        if (gameCanvas) {
            gameCanvas.width = gameCanvas.parentElement.clientWidth;
            gameCanvas.height = gameCanvas.parentElement.clientHeight;
        }
        
        // Initialize game elements using the images from placeholder-images.js
        initializeGameElements();
        
        // Start game loop
        gameLoopRunning = true;
        gameLoop();
    }
    
    // Reset the game state
    function resetGame() {
        console.log('Game integration: Resetting game');
        
        // Reset score and coins
        document.getElementById('score').textContent = '0';
        document.getElementById('coins').textContent = '0';
        document.getElementById('finalScore').textContent = '0';
        document.getElementById('finalCoins').textContent = '0';
        
        // Clear canvas
        if (gameContext) {
            gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        }
    }
    
    // Initialize game elements
    function initializeGameElements() {
        console.log('Game integration: Initializing game elements');
        
        // Use images from placeholder-images.js
        const playerImage = getImage('player', selectedCharacter === 'custom');
        const enemyImage = getImage('enemy', useCustomEnemy);
        const backgroundImage = getImage('background', useCustomBackground);
        const coinImage = getImage('coin');
        const obstacleImage = getImage('obstacle');
        
        // If game.js has initialization functions, call them
        if (typeof initPlayer === 'function') {
            initPlayer(playerImage);
        }
        
        if (typeof initEnemies === 'function') {
            initEnemies(enemyImage);
        }
        
        if (typeof initBackground === 'function') {
            initBackground(backgroundImage);
        }
        
        if (typeof initCoins === 'function') {
            initCoins(coinImage);
        }
        
        if (typeof initObstacles === 'function') {
            initObstacles(obstacleImage);
        }
    }
    
    // Game loop
    let gameLoopRunning = false;
    function gameLoop() {
        if (!gameRunning) {
            gameLoopRunning = false;
            return;
        }
        
        // Update game state
        if (typeof updateGame === 'function') {
            updateGame();
        }
        
        // Render game
        if (typeof renderGame === 'function') {
            renderGame();
        }
        
        // Continue loop
        requestAnimationFrame(gameLoop);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (gameCanvas) {
            gameCanvas.width = gameCanvas.parentElement.clientWidth;
            gameCanvas.height = gameCanvas.parentElement.clientHeight;
            
            // Re-render if game is running
            if (gameRunning && typeof renderGame === 'function') {
                renderGame();
            }
        }
    });
    
    // Handle custom image uploads
    const customEnemyInput = document.getElementById('customEnemy');
    if (customEnemyInput) {
        customEnemyInput.addEventListener('change', function() {
            useCustomEnemy = true;
            // Update enemy images if game is already initialized
            if (gameRunning && typeof updateEnemyImages === 'function') {
                updateEnemyImages(getImage('enemy', true));
            }
        });
    }
    
    const customBackgroundInput = document.getElementById('customBackground');
    if (customBackgroundInput) {
        customBackgroundInput.addEventListener('change', function() {
            useCustomBackground = true;
            // Update background if game is already initialized
            if (gameRunning && typeof updateBackground === 'function') {
                updateBackground(getImage('background', true));
            }
        });
    }
    
    console.log('Game integration initialized successfully');
});

console.log('Game integration loaded successfully');
