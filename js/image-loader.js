// image-loader.js
// 画像の代わりに直接描画する関数を提供するファイル

// プレイヤーを描画する関数
function drawPlayer(ctx, x, y, width, height, isJumping, isSliding) {
  // 体（赤い四角形）
  ctx.fillStyle = '#FF4081';
  ctx.fillRect(x, y, width, height);
  
  // 目
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + width * 0.2, y + height * 0.2, width * 0.2, height * 0.1);
  ctx.fillRect(x + width * 0.6, y + height * 0.2, width * 0.2, height * 0.1);
  
  // 口
  if (isJumping) {
    // ジャンプ中は「O」の形
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height * 0.6, width * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  } else if (isSliding) {
    // スライディング中は横線
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + width * 0.3, y + height * 0.6, width * 0.4, height * 0.05);
  } else {
    // 通常時は笑顔
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height * 0.6, width * 0.2, 0, Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }
}

// 敵を描画する関数
function drawEnemy(ctx, x, y, width, height, type) {
  // 障害物の種類によって色を変える
  if (type === 0) {
    // 低い障害物（青）
    ctx.fillStyle = '#2196F3';
  } else {
    // 高い障害物（紫）
    ctx.fillStyle = '#9C27B0';
  }
  
  ctx.fillRect(x, y, width, height);
}

// コインを描画する関数
function drawCoin(ctx, x, y, radius) {
  // 金色の円形
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // 中央に穴（五円玉風）
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, radius / 2, 0, Math.PI * 2);
  ctx.fill();
}

// 背景を描画する関数
function drawBackground(ctx, width, height) {
  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#87CEEB');  // 空色
  gradient.addColorStop(1, '#E0F7FA');  // 薄い水色
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 地面
  ctx.fillStyle = '#8BC34A';  // 緑色
  ctx.fillRect(0, height - 100, width, 100);
}

// Player.prototype.renderを上書き
document.addEventListener('DOMContentLoaded', function() {
  if (typeof Player !== 'undefined' && Player.prototype) {
    Player.prototype.render = function(ctx) {
      drawPlayer(ctx, this.x, this.y, this.width, this.height, this.jumping, this.sliding);
    };
  }
  
  if (typeof Obstacle !== 'undefined' && Obstacle.prototype) {
    Obstacle.prototype.render = function(ctx) {
      drawEnemy(ctx, this.x, this.y, this.width, this.height, this.type);
    };
  }
  
  console.log('画像の代わりに直接描画する関数を設定しました');
});
