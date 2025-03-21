/**
 * ジャパンランナー - メインゲームスクリプト
 * サブウェイサーファーズのようなゲームメカニクスに日本文化要素を組み込んだエンドレスランナーゲーム
 */

// ゲームの状態管理
const GAME_STATE = {
    LOADING: 0,
    START: 1,
    PLAYING: 2,
    GAME_OVER: 3
};

// ゲームの設定
const GAME_CONFIG = {
    // キャンバス設定
    canvasWidth: 800,
    canvasHeight: 600,
    
    // プレイヤー設定
    playerWidth: 60,
    playerHeight: 90,
    playerStartX: 400,
    playerStartY: 450,
    playerSpeed: 8,
    jumpForce: 20,
    gravity: 1,
    
    // ゲーム設定
    initialSpeed: 5,
    maxSpeed: 15,
    speedIncrement: 0.0005,
    laneWidth: 200,
    lanes: 3,
    
    // 障害物設定
    obstacleMinDistance: 300,
    obstacleMaxDistance: 600,
    
    // コイン設定
    coinChance: 0.7,
    coinValue: 10,
    
    // パワーアップ設定
    powerupChance: 0.05,
    powerupDuration: 5000,
};

// ゲームクラス
class JapanRunner {
    constructor() {
        // DOM要素の取得
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.startScreen = document.querySelector('.game-start-screen');
        this.playScreen = document.querySelector('.game-play-screen');
        this.gameOverScreen = document.querySelector('.game-over-screen');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.progressBar = document.querySelector('.progress');
        
        // スコア表示要素
        this.scoreElement = document.getElementById('score');
        this.coinsElement = document.getElementById('coins');
        this.distanceElement = document.getElementById('distance');
        this.finalScoreElement = document.getElementById('final-score');
        this.highScoreElement = document.getElementById('high-score');
        
        // ボタン要素
        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
        
        // ゲーム状態の初期化
        this.gameState = GAME_STATE.LOADING;
        this.score = 0;
        this.coins = 0;
        this.distance = 0;
        this.speed = GAME_CONFIG.initialSpeed;
        this.highScore = this.getHighScore();
        
        // ゲームオブジェクト
        this.player = null;
        this.obstacles = [];
        this.coins = [];
        this.powerups = [];
        this.backgrounds = [];
        
        // アセットの読み込み状態
        this.assetsLoaded = 0;
        this.totalAssets = 0;
        
        // キー入力状態
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };
        
        // ゲームループのタイムスタンプ
        this.lastTime = 0;
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // キャンバスのサイズ設定
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // アセットの読み込み開始
        this.loadAssets();
    }
    
    // キャンバスのリサイズ
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        GAME_CONFIG.canvasWidth = this.canvas.width;
        GAME_CONFIG.canvasHeight = this.canvas.height;
        GAME_CONFIG.playerStartX = this.canvas.width / 2;
        GAME_CONFIG.playerStartY = this.canvas.height - 150;
        GAME_CONFIG.laneWidth = this.canvas.width / 3;
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        // キーボード入力
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
        
        // タッチ操作（モバイル対応）
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            
            if (y > this.canvas.height * 0.7) {
                // 下部エリアのタッチはスライディング
                this.keys.ArrowDown = true;
            } else if (y < this.canvas.height * 0.3) {
                // 上部エリアのタッチはジャンプ
                this.keys.ArrowUp = true;
            } else if (x < this.canvas.width * 0.3) {
                // 左エリアのタッチは左移動
                this.keys.ArrowLeft = true;
            } else if (x > this.canvas.width * 0.7) {
                // 右エリアのタッチは右移動
                this.keys.ArrowRight = true;
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            // タッチ終了時にすべてのキー入力をリセット
            this.keys.ArrowLeft = false;
            this.keys.ArrowRight = false;
            this.keys.ArrowUp = false;
            this.keys.ArrowDown = false;
        });
        
        // ゲーム開始ボタン
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
        
        // リスタートボタン
        this.restartButton.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    // アセットの読み込み
    loadAssets() {
        // 仮のアセット読み込み処理（実際のアセットはまだ実装していない）
        // 実際のゲームでは画像やサウンドを読み込む
        setTimeout(() => {
            this.progressBar.style.width = '100%';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                this.gameState = GAME_STATE.START;
                this.startScreen.style.display = 'flex';
            }, 500);
        }, 1000);
    }
    
    // ゲーム開始
    startGame() {
        this.gameState = GAME_STATE.PLAYING;
        this.startScreen.style.display = 'none';
        this.playScreen.style.display = 'block';
        
        // プレイヤーの初期化
        this.player = new Player(
            GAME_CONFIG.playerStartX,
            GAME_CONFIG.playerStartY,
            GAME_CONFIG.playerWidth,
            GAME_CONFIG.playerHeight
        );
        
        // ゲームループの開始
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // ゲームオーバー
    gameOver() {
        this.gameState = GAME_STATE.GAME_OVER;
        this.finalScoreElement.textContent = this.score;
        
        // ハイスコアの更新
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.highScoreElement.textContent = this.highScore;
        this.gameOverScreen.style.display = 'flex';
    }
    
    // ゲームの再開
    restartGame() {
        this.gameOverScreen.style.display = 'none';
        this.score = 0;
        this.coins = 0;
        this.distance = 0;
        this.speed = GAME_CONFIG.initialSpeed;
        this.obstacles = [];
        this.coins = [];
        this.powerups = [];
        
        this.startGame();
    }
    
    // ハイスコアの取得
    getHighScore() {
        const highScore = localStorage.getItem('japanRunnerHighScore');
        return highScore ? parseInt(highScore) : 0;
    }
    
    // ハイスコアの保存
    saveHighScore() {
        localStorage.setItem('japanRunnerHighScore', this.highScore.toString());
    }
    
    // ゲームループ
    gameLoop(currentTime) {
        // 時間差分の計算
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // ゲームが実行中の場合のみ更新
        if (this.gameState === GAME_STATE.PLAYING) {
            // ゲーム状態の更新
            this.update(deltaTime);
            
            // 描画
            this.render();
            
            // 次のフレームをリクエスト
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    // ゲーム状態の更新
    update(deltaTime) {
        // プレイヤーの更新
        this.player.update(deltaTime, this.keys);
        
        // 速度の増加
        this.speed += GAME_CONFIG.speedIncrement * deltaTime;
        if (this.speed > GAME_CONFIG.maxSpeed) {
            this.speed = GAME_CONFIG.maxSpeed;
        }
        
        // 距離の更新
        this.distance += this.speed * 0.1;
        
        // 障害物の生成
        this.generateObstacles();
        
        // 障害物の更新
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.update(this.speed);
            
            // 画面外に出た障害物の削除
            if (obstacle.y > GAME_CONFIG.canvasHeight) {
                this.obstacles.splice(i, 1);
                continue;
            }
            
            // 衝突判定
            if (this.checkCollision(this.player, obstacle)) {
                this.gameOver();
                return;
            }
        }
        
        // スコアの更新
        this.score = Math.floor(this.distance) + (this.coins * GAME_CONFIG.coinValue);
        this.scoreElement.textContent = this.score;
        this.distanceElement.textContent = Math.floor(this.distance);
        this.coinsElement.textContent = this.coins;
    }
    
    // 障害物の生成
    generateObstacles() {
        // 最後の障害物からの距離が十分であれば新しい障害物を生成
        const lastObstacle = this.obstacles[this.obstacles.length - 1];
        if (!lastObstacle || 
            lastObstacle.y > GAME_CONFIG.obstacleMinDistance) {
            
            // ランダムなレーンに障害物を配置
            const lane = Math.floor(Math.random() * GAME_CONFIG.lanes);
            const x = lane * GAME_CONFIG.laneWidth + GAME_CONFIG.laneWidth / 2;
            
            // 障害物の種類をランダムに選択（0: 低い障害物, 1: 高い障害物）
            const type = Math.floor(Math.random() * 2);
            
            // 障害物の作成
            const obstacle = new Obstacle(
                x, 
                -100, 
                80, 
                type === 0 ? 40 : 80, 
                type
            );
            
            this.obstacles.push(obstacle);
        }
    }
    
    // 衝突判定
    checkCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
    
    // 描画
    render() {
        // キャンバスのクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 背景の描画
        this.renderBackground();
        
        // 障害物の描画
        for (const obstacle of this.obstacles) {
            obstacle.render(this.ctx);
        }
        
        // プレイヤーの描画
        this.player.render(this.ctx);
    }
    
    // 背景の描画
    renderBackground() {
        // 仮の背景（グラデーション）
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');  // 空色
        gradient.addColorStop(1, '#E0F7FA');  // 薄い水色
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 地面の描画
        this.ctx.fillStyle = '#8BC34A';  // 緑色
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
        
        // レーンの区切り線
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 5;
        this.ctx.setLineDash([20, 10]);
        
        for (let i = 1; i < GAME_CONFIG.lanes; i++) {
            const x = i * GAME_CONFIG.laneWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height - 100);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }
}

// プレイヤークラス
class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lane = 1;  // 中央レーン
        this.jumping = false;
        this.sliding = false;
        this.verticalVelocity = 0;
        this.originalHeight = height;
    }
    
    update(deltaTime, keys) {
        // レーン移動
        if (keys.ArrowLeft && this.lane > 0) {
            this.lane--;
            keys.ArrowLeft = false;  // キー入力をリセット
        }
        
        if (keys.ArrowRight && this.lane < GAME_CONFIG.lanes - 1) {
            this.lane++;
            keys.ArrowRight = false;  // キー入力をリセット
        }
        
        // 目標のX座標を計算
        const targetX = this.lane * GAME_CONFIG.laneWidth + GAME_CONFIG.laneWidth / 2 - this.width / 2;
        
        // 現在のX座標から目標のX座標に向かって移動
        if (this.x < targetX) {
            this.x += GAME_CONFIG.playerSpeed;
            if (this.x > targetX) this.x = targetX;
        } else if (this.x > targetX) {
            this.x -= GAME_CONFIG.playerSpeed;
            if (this.x < targetX) this.x = targetX;
        }
        
        // ジャンプ
        if (keys.ArrowUp && !this.jumping && !this.sliding) {
            this.jumping = true;
            this.verticalVelocity = -GAME_CONFIG.jumpForce;
            keys.ArrowUp = false;  // キー入力をリセット
        }
        
        // スライディング
        if (keys.ArrowDown && !this.jumping && !this.sliding) {
            this.sliding = true;
            this.height = this.originalHeight / 2;
            this.y += this.originalHeight / 2;
            
            // スライディングは一定時間後に解除
            setTimeout(() => {
                this.sliding = false;
                this.height = this.originalHeight;
                this.y -= this.originalHeight / 2;
            }, 1000);
            
            keys.ArrowDown = false;  // キー入力をリセット
        }
        
        // ジャンプ中の処理
        if (this.jumping) {
            this.y += this.verticalVelocity;
            this.verticalVelocity += GAME_CONFIG.gravity;
            
            // 地面に着地したらジャンプ終了
            if (this.y >= GAME_CONFIG.playerStartY) {
                this.y = GAME_CONFIG.playerStartY;
                this.jumping = false;
                this.verticalVelocity = 0;
            }
        }
    }
    
    render(ctx) {
        // 仮のプレイヤー描画（赤い四角形）
        ctx.fillStyle = '#FF4081';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 目や顔のパーツを描画して人間らしく
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + this.width * 0.2, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.1);
        ctx.fillRect(this.x + this.width * 0.6, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.1);
        
        // 口
        if (this.jumping) {
            // ジャンプ中は「O」の形
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height * 0.6, this.width * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        } else if (this.sliding) {
            // スライディング中は横線
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + this.width * 0.3, this.y + this.height * 0.6, this.width * 0.4, this.height * 0.05);
        } else {
            // 通常時は笑顔
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height * 0.6, this.width * 0.2, 0, Math.PI);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }
    }
}

// 障害物クラス
class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x - width / 2;  // 中心に配置するための調整
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;  // 0: 低い障害物, 1: 高い障害物
    }
    
    update(speed) {
        this.y += speed;
    }
    
    render(ctx) {
        // 障害物の種類によって色を変える
        if (this.type === 0) {
            // 低い障害物（青）
            ctx.fillStyle = '#2196F3';
        } else {
            // 高い障害物（紫）
            ctx.fillStyle = '#9C27B0';
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// コインクラス
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.collected = false;
    }
    
    update(speed) {
        this.y += speed;
    }
    
    render(ctx) {
        if (!this.collected) {
            // 金色の円形
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 中央に穴（五円玉風）
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ゲームの初期化
document.addEventListener('DOMContentLoaded', () => {
    const game = new JapanRunner();
});
