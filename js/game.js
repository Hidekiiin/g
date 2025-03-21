// ゲームの設定
const gameSettings = {
    gravity: 0.5,
    playerSpeed: 5,
    jumpForce: 12,
    groundHeight: 50,
    obstacleSpeed: 5,
    obstacleFrequency: 100, // フレーム数
    coinFrequency: 150,     // フレーム数
    enemyFrequency: 200,    // フレーム数
    laneWidth: 100,         // レーン幅
    laneCount: 3,           // レーン数
    initialDifficulty: 1,
    difficultyIncreaseRate: 0.0001
};

// ゲームの状態
let gameState = {
    running: false,
    paused: false,
    score: 0,
    coins: 0,
    distance: 0,
    difficulty: gameSettings.initialDifficulty,
    frameCount: 0,
    lastObstacleFrame: 0,
    lastCoinFrame: 0,
    lastEnemyFrame: 0
};

// ゲームオブジェクト
let player = {
    x: 0,
    y: 0,
    width: 50,
    height: 80,
    lane: 1,
    jumping: false,
    falling: false,
    velocity: 0,
    image: null
};

let obstacles = [];
let coins = [];
let enemies = [];
let backgrounds = [];

// キャンバスとコンテキスト
let canvas;
let ctx;

// 画像リソース
let images = {
    player: null,
    enemy: null,
    obstacle: null,
    coin: null,
    background: null
};

// ゲームの初期化
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // キャンバスのサイズをコンテナに合わせる
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // デフォルト画像の読み込み
    loadDefaultImages();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // 背景の初期化
    initBackgrounds();
}

// キャンバスのリサイズ
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // プレイヤーの初期位置を設定
    resetPlayerPosition();
}

// プレイヤーの位置をリセット
function resetPlayerPosition() {
    player.lane = 1;
    player.x = calculateLanePosition(player.lane);
    player.y = canvas.height - gameSettings.groundHeight - player.height;
    player.jumping = false;
    player.falling = false;
    player.velocity = 0;
}

// レーン位置の計算
function calculateLanePosition(lane) {
    const laneWidth = canvas.width / gameSettings.laneCount;
    return (lane * laneWidth) - (laneWidth / 2) - (player.width / 2);
}

// プレイヤーを描画する関数
function drawPlayer(ctx, x, y, width, height) {
  // 体（赤い四角形）
  ctx.fillStyle = '#FF4081';
  ctx.fillRect(x, y, width, height);
  
  // 目
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + width * 0.2, y + height * 0.2, width * 0.2, height * 0.1);
  ctx.fillRect(x + width * 0.6, y + height * 0.2, width * 0.2, height * 0.1);
  
  // 口（笑顔）
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height * 0.6, width * 0.2, 0, Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}

// 敵を描画する関数
function drawEnemy(ctx, x, y, width, height) {
  // 体（紫の四角形）
  ctx.fillStyle = '#9C27B0';
  ctx.fillRect(x, y, width, height);
  
  // 目
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + width * 0.2, y + height * 0.2, width * 0.2, height * 0.1);
  ctx.fillRect(x + width * 0.6, y + height * 0.2, width * 0.2, height * 0.1);
  
  // 口（怒った表情）
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height * 0.7, width * 0.2, Math.PI, 0);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}

// コインを描画する関数
function drawCoin(ctx, x, y, radius) {
  // 金色の円
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // 中央の穴
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, radius / 2, 0, Math.PI * 2);
  ctx.fill();
}

// 画像オブジェクトの初期化
// 変数を再宣言せず、既存の変数に値を代入
images.player = new Image();
images.enemy = new Image();
// ...
  player: new Image(),
  enemy: new Image(),
  coin: new Image(),
  obstacle: new Image(),
  background: new Image()
};

// 画像の読み込み
function loadImages() {
  // SVGファイルを使用するように変更
  images.player.src = './images/player-default.svg';
  images.enemy.src = './images/enemy-default.svg';
  images.coin.src = './images/coin-default.svg';
  images.obstacle.src = './images/obstacle-default.svg';
  images.background.src = './images/background-default.svg';
  
  // 画像の読み込み完了を待つ
  const promises = Object.values(images).map(img => {
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  });
  
  return Promise.all(promises).catch(error => {
    console.error('画像の読み込みに失敗しました:', error);
    // 画像が読み込めない場合のフォールバック処理
    useDefaultShapes();
  });
}

// 画像が読み込めない場合に単純な図形を使用
function useDefaultShapes() {
  console.log('デフォルトの図形を使用します');
  // 画像の代わりに描画する関数を上書き
  // 実際の実装はゲームのコードに合わせて調整してください
}

// デフォルト画像の読み込み
function loadDefaultImages() {
    // プレイヤー画像
    images.player = new Image();
    images.player.src = 'images/player-default.svg';
    images.player.onload = function() {
        player.image = images.player;
    };
    
    // 敵画像
    images.enemy = new Image();
    images.enemy.src = 'images/enemy-default.svg';
    
    // 障害物画像
    images.obstacle = new Image();
    images.obstacle.src = 'images/obstacle-default.svg';
    
    // コイン画像
    images.coin = new Image();
    images.coin.src = 'images/coin-default.svg';
    
    // 背景画像
    images.background = new Image();
    images.background.src = 'images/background-default.svg';
}

// イベントリスナーの設定
function setupEventListeners() {
    // スタートボタン
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // リスタートボタン
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    // 一時停止ボタン
    document.getElementById('pauseButton').addEventListener('click', togglePause);
    
    // 再開ボタン
    document.getElementById('resumeButton').addEventListener('click', resumeGame);
    
    // 終了ボタン
    document.getElementById('quitButton').addEventListener('click', quitGame);
    
    // キーボード操作
    window.addEventListener('keydown', handleKeyDown);
    
    // モバイルコントロール
    document.getElementById('leftButton').addEventListener('click', moveLeft);
    document.getElementById('rightButton').addEventListener('click', moveRight);
    document.getElementById('jumpButton').addEventListener('click', jump);
    
    // キャラクター選択
    const characterOptions = document.querySelectorAll('.character-option');
    characterOptions.forEach(option => {
        option.addEventListener('click', function() {
            characterOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // カスタム画像アップロード
    document.getElementById('customCharacter').addEventListener('change', handleCustomCharacter);
    document.getElementById('customEnemy').addEventListener('change', handleCustomEnemy);
    document.getElementById('customBackground').addEventListener('change', handleCustomBackground);
}

// 背景の初期化
function initBackgrounds() {
    // 複数の背景レイヤーを作成（パララックス効果用）
    backgrounds = [
        { x: 0, speed: 1 },
        { x: canvas.width, speed: 1 }
    ];
}

// ゲーム開始
function startGame() {
    // スタート画面を非表示
    document.getElementById('startScreen').classList.add('hidden');
    
    // ゲーム状態のリセット
    resetGame();
    
    // ゲームループの開始
    gameState.running = true;
    requestAnimationFrame(gameLoop);
}

// ゲームのリスタート
function restartGame() {
    // ゲームオーバー画面を非表示
    document.getElementById('gameOverScreen').classList.add('hidden');
    
    // ゲーム状態のリセット
    resetGame();
    
    // ゲームループの再開
    gameState.running = true;
    requestAnimationFrame(gameLoop);
}

// ゲーム状態のリセット
function resetGame() {
    gameState = {
        running: false,
        paused: false,
        score: 0,
        coins: 0,
        distance: 0,
        difficulty: gameSettings.initialDifficulty,
        frameCount: 0,
        lastObstacleFrame: 0,
        lastCoinFrame: 0,
        lastEnemyFrame: 0
    };
    
    resetPlayerPosition();
    obstacles = [];
    coins = [];
    enemies = [];
    
    // スコア表示のリセット
    document.getElementById('score').textContent = '0';
    document.getElementById('coins').textContent = '0';
}

// 一時停止の切り替え
function togglePause() {
    if (gameState.running) {
        if (gameState.paused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
}

// ゲームの一時停止
function pauseGame() {
    gameState.paused = true;
    document.getElementById('pauseScreen').classList.remove('hidden');
}

// ゲームの再開
function resumeGame() {
    gameState.paused = false;
    document.getElementById('pauseScreen').classList.add('hidden');
    requestAnimationFrame(gameLoop);
}

// ゲームの終了（タイトルに戻る）
function quitGame() {
    gameState.running = false;
    gameState.paused = false;
    document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    resetGame();
}

// キーボード入力の処理
function handleKeyDown(event) {
    if (!gameState.running || gameState.paused) return;
    
    switch (event.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowUp':
        case ' ':
            jump();
            break;
        case 'p':
            togglePause();
            break;
    }
}

// 左に移動
function moveLeft() {
    if (!gameState.running || gameState.paused) return;
    if (player.lane > 0) {
        player.lane--;
        player.x = calculateLanePosition(player.lane);
    }
}

// 右に移動
function moveRight() {
    if (!gameState.running || gameState.paused) return;
    if (player.lane < gameSettings.laneCount - 1) {
        player.lane++;
        player.x = calculateLanePosition(player.lane);
    }
}

// ジャンプ
function jump() {
    if (!gameState.running || gameState.paused || player.jumping || player.falling) return;
    
    player.jumping = true;
    player.velocity = -gameSettings.jumpForce;
}

// カスタムキャラクターの処理
function handleCustomCharacter(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                images.player = img;
                player.image = img;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// カスタム敵の処理
function handleCustomEnemy(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                images.enemy = img;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// カスタム背景の処理
function handleCustomBackground(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                images.background = img;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// ゲームループ
function gameLoop(timestamp) {
    if (!gameState.running) return;
    if (gameState.paused) return;
    
    // キャンバスのクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景の描画
    drawBackgrounds();
    
    // ゲーム状態の更新
    updateGameState();
    
    // オブジェクトの生成
    generateObjects();
    
    // オブジェクトの更新と描画
    updateAndDrawObjects();
    
    // プレイヤーの更新と描画
    updateAndDrawPlayer();
    
    // 衝突判定
    checkCollisions();
    
    // スコアの更新
    updateScore();
    
    // 次のフレームの要求
    requestAnimationFrame(gameLoop);
}

// 背景の描画
function drawBackgrounds() {
    // 背景画像がロードされていない場合は単色の背景を描画
    if (!images.background || !images.background.complete) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 地面の描画
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - gameSettings.groundHeight, canvas.width, gameSettings.groundHeight);
        return;
    }
    
    // 背景画像を使った背景の描画（パララックス効果）
    for (let i = 0; i < backgrounds.length; i++) {
        const bg = backgrounds[i];
        
        // 背景の位置を更新
        bg.x -= gameSettings.obstacleSpeed * bg.speed * gameState.difficulty;
        
        // 背景が画面外に出たら反対側に配置
        if (bg.x <= -canvas.width) {
            bg.x = canvas.width;
        }
        
        // 背景の描画
        ctx.drawImage(images.background, bg.x, 0, canvas.width, canvas.height);
    }
    
    // 地面の描画
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - gameSettings.groundHeight, canvas.width, gameSettings.groundHeight);
}

// ゲーム状態の更新
function updateGameState() {
    gameState.frameCount++;
    gameState.distance += gameSettings.obstacleSpeed * gameState.difficulty;
    gameState.difficulty += gameSettings.difficultyIncreaseRate;
}

// オブジェクトの生成
function generateObjects() {
    // 障害物の生成
    if (gameState.frameCount - gameState.lastObstacleFrame >= gameSettings.obstacleFrequency / gameState.difficulty) {
        generateObstacle();
        gameState.lastObstacleFrame = gameState.frameCount;
    }
    
    // コインの生成
    if (gameState.frameCount - gameState.lastCoinFrame >= gameSettings.coinFrequency / gameState.difficulty) {
        generateCoin();
        gameState.lastCoinFrame = gameState.frameCount;
    }
    
    // 敵の生成
    if (gameState.frameCount - gameState.lastEnemyFrame >= gameSettings.enemyFrequency / gameState.difficulty) {
        generateEnemy();
        gameState.lastEnemyFrame = gameState.frameCount;
    }
}

// 障害物の生成
function generateObstacle() {
    const lane = Math.floor(Math.random() * gameSettings.laneCount);
    const laneWidth = canvas.width / gameSettings.laneCount;
    const x = (lane * laneWidth) + (laneWidth / 2) - 25; // 障害物の幅の半分を引く
    
    obstacles.push({
        x: x,
        y: canvas.height - gameSettings.groundHeight - 30, // 障害物の高さを30とする
        width: 50,
        height: 30,
        lane: lane
    });
}

// コインの生成
function generateCoin() {
    const lane = Math.floor(Math.random() * gameSettings.laneCount);
    const laneWidth = canvas.width / gameSettings.laneCount;
    const x = (lane * laneWidth) + (laneWidth / 2) - 15; // コインの幅の半分を引く
    const y = canvas.height - gameSettings.groundHeight - 50 - Math.random() * 100; // 地面から少し上の位置
    
    coins.push({
        x: x,
        y: y,
        width: 30,
        height: 30,
        lane: lane
    });
}

// 敵の生成
function generateEnemy() {
    const lane = Math.floor(Math.random() * gameSettings.laneCount);
    const laneWidth = canvas.width / gameSettings.laneCount;
    const x = (lane * laneWidth) + (laneWidth / 2) - 25; // 敵の幅の半分を引く
    
    enemies.push({
        x: x,
        y: canvas.height - gameSettings.groundHeight - 60, // 敵の高さを60とする
        width: 50,
        height: 60,
        lane: lane,
        defeated: false
    });
}

// オブジェクトの更新と描画
function updateAndDrawObjects() {
    // 障害物の更新と描画
    updateAndDrawObstacles();
    
    // コインの更新と描画
    updateAndDrawCoins();
    
    // 敵の更新と描画
    updateAndDrawEnemies();
}

// 障害物の更新と描画
function updateAndDrawObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        
        // 障害物の位置を更新
        obstacle.x -= gameSettings.obstacleSpeed * gameState.difficulty;
        
        // 画面外に出た障害物を削除
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            continue;
        }
        
        // 障害物の描画
        if (images.obstacle && images.obstacle.complete) {
            ctx.drawImage(images.obstacle, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    }
}

// コインの更新と描画
function updateAndDrawCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        
        // コインの位置を更新
        coin.x -= gameSettings.obstacleSpeed * gameState.difficulty;
        
        // 画面外に出たコインを削除
        if (coin.x + coin.width < 0) {
            coins.splice(i, 1);
            continue;
        }
        
        // コインの描画
        if (images.coin && images.coin.complete) {
            ctx.drawImage(images.coin, coin.x, coin.y, coin.width, coin.height);
        } else {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 敵の更新と描画
function updateAndDrawEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // 敵の位置を更新
        enemy.x -= gameSettings.obstacleSpeed * gameState.difficulty;
        
        // 画面外に出た敵を削除
        if (enemy.x + enemy.width < 0) {
            enemies.splice(i, 1);
            continue;
        }
        
        // 倒された敵は描画しない
        if (enemy.defeated) {
            enemies.splice(i, 1);
            continue;
        }
        
        // 敵の描画
        if (images.enemy && images.enemy.complete) {
            ctx.drawImage(images.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}

// プレイヤーの更新と描画
function updateAndDrawPlayer() {
    // ジャンプと落下の処理
    if (player.jumping || player.falling) {
        player.velocity += gameSettings.gravity;
        player.y += player.velocity;
        
        // 地面に着地した場合
        if (player.y >= canvas.height - gameSettings.groundHeight - player.height) {
            player.y = canvas.height - gameSettings.groundHeight - player.height;
            player.jumping = false;
            player.falling = false;
            player.velocity = 0;
        }
    }
    
    // プレイヤーの描画
    if (player.image && player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

// 衝突判定
function checkCollisions() {
    // プレイヤーの衝突判定用の矩形
    const playerRect = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
    };
    
    // 障害物との衝突判定
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        
        if (checkCollision(playerRect, obstacle)) {
            gameOver();
            return;
        }
    }
    
    // コインとの衝突判定
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        
        if (checkCollision(playerRect, coin)) {
            // コインを獲得
            gameState.coins++;
            coins.splice(i, 1);
            
            // コイン表示の更新
            document.getElementById('coins').textContent = gameState.coins;
        }
    }
    
    // 敵との衝突判定
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        
        if (!enemy.defeated && checkCollision(playerRect, enemy)) {
            // プレイヤーがジャンプ中で、敵の上部に接触した場合は敵を倒す
            if (player.jumping && player.velocity > 0 && player.y + player.height < enemy.y + enemy.height / 2) {
                enemy.defeated = true;
                player.velocity = -gameSettings.jumpForce / 2; // 小さなジャンプ
                gameState.score += 100;
            } else {
                // それ以外の場合はゲームオーバー
                gameOver();
                return;
            }
        }
    }
}

// 矩形同士の衝突判定
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// スコアの更新
function updateScore() {
    // 距離に応じてスコアを増加
    gameState.score = Math.floor(gameState.distance / 10);
    
    // スコア表示の更新
    document.getElementById('score').textContent = gameState.score;
}

// ゲームオーバー
function gameOver() {
    gameState.running = false;
    
    // 最終スコアの表示
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalCoins').textContent = gameState.coins;
    
    // ゲームオーバー画面の表示
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// ページ読み込み時にゲームを初期化
window.addEventListener('load', initGame);

// SVGデータURLを使用して画像を読み込む関数
function loadImagesWithDataURL() {
  // 画像オブジェクトの初期化（既存のimages変数を使用）
  if (typeof images === 'undefined') {
    window.images = {
      player: new Image(),
      enemy: new Image(),
      coin: new Image(),
      obstacle: new Image(),
      background: new Image()
    };
  }
  
  // プレイヤーのSVGデータURL
  images.player.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160"><rect x="10" y="10" width="80" height="140" fill="%23FF4081" rx="10" /><circle cx="35" cy="50" r="10" fill="%23FFFFFF" /><circle cx="65" cy="50" r="10" fill="%23FFFFFF" /><path d="M30 100 Q50 120 70 100" stroke="%23FFFFFF" stroke-width="5" fill="none" /></svg>';
  
  // 敵のSVGデータURL
  images.enemy.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect x="10" y="10" width="80" height="100" fill="%239C27B0" rx="10" /><circle cx="35" cy="40" r="8" fill="%23FFFFFF" /><circle cx="65" cy="40" r="8" fill="%23FFFFFF" /><path d="M30 80 Q50 60 70 80" stroke="%23FFFFFF" stroke-width="5" fill="none" /></svg>';
  
  // コインのSVGデータURL
  images.coin.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23FFD700" /><circle cx="20" cy="20" r="8" fill="%23FFFFFF" /></svg>';
  
  // 障害物のSVGデータURL
  images.obstacle.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="5" y="5" width="50" height="50" fill="%232196F3" rx="5" /></svg>';
  
  // 背景のSVGデータURL
  images.background.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect x="0" y="0" width="800" height="300" fill="%2387CEEB" /><rect x="0" y="300" width="800" height="100" fill="%238BC34A" /></svg>';
  
  console.log('SVGデータURLを使用して画像を読み込みました') ;
}

// ゲームの初期化時に画像を読み込む
document.addEventListener('DOMContentLoaded', function() {
  // 既存のloadAssets関数を置き換えるか、その中で呼び出す
    // アセットの読み込み
loadAssets() {
    // SVGデータURLを使用して画像を読み込む
    loadImagesWithDataURL();
    
    // 読み込み完了の処理
    setTimeout(() => {
        this.progressBar.style.width = '100%';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.gameState = GAME_STATE.START;
            this.startScreen.style.display = 'flex';
        }, 500);
    }, 1000);
}

  loadImagesWithDataURL();
  
  // JapanRunnerクラスのインスタンスを作成（既存のコードにない場合）
  if (typeof JapanRunner !== 'undefined') {
    const game = new JapanRunner();
  }
});
