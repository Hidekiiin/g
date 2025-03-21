// カスタマイズシステムの拡張
function enhanceCustomizationSystem() {
    // SVGをPNGに変換する関数
    function convertSvgToPng(svgElement, width, height) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // SVGデータをBase64エンコード
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBase64 = btoa(svgData);
            const imgSrc = `data:image/svg+xml;base64,${svgBase64}`;
            
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = function(err) {
                reject(err);
            };
            img.src = imgSrc;
        });
    }
    
    // SVGファイルを読み込んでゲームで使用する
    function loadSvgAsImage(svgPath, callback) {
        fetch(svgPath)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.documentElement;
                
                // SVGの幅と高さを取得
                let width = parseInt(svgElement.getAttribute('width') || 100);
                let height = parseInt(svgElement.getAttribute('height') || 100);
                
                // SVGをPNGに変換
                convertSvgToPng(svgElement, width, height)
                    .then(pngDataUrl => {
                        const img = new Image();
                        img.onload = function() {
                            callback(img);
                        };
                        img.src = pngDataUrl;
                    })
                    .catch(err => {
                        console.error('SVG to PNG conversion failed:', err);
                    });
            })
            .catch(err => {
                console.error('Failed to load SVG:', err);
            });
    }
    
    // デフォルト画像の読み込みを拡張
    function loadDefaultImagesEnhanced() {
        // プレイヤー画像
        loadSvgAsImage('images/player-default.svg', function(img) {
            images.player = img;
            player.image = img;
        });
        
        // 敵画像
        loadSvgAsImage('images/enemy-default.svg', function(img) {
            images.enemy = img;
        });
        
        // 障害物画像
        loadSvgAsImage('images/obstacle-default.svg', function(img) {
            images.obstacle = img;
        });
        
        // コイン画像
        loadSvgAsImage('images/coin-default.svg', function(img) {
            images.coin = img;
        });
        
        // 背景画像
        loadSvgAsImage('images/background-default.svg', function(img) {
            images.background = img;
        });
    }
    
    // プレビュー機能の追加
    function addPreviewFunctionality() {
        // キャラクター選択のプレビュー
        const characterOptions = document.querySelectorAll('.character-option');
        characterOptions.forEach(option => {
            option.addEventListener('click', function() {
                characterOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // デフォルトキャラクターを選択した場合
                if (this.dataset.character === 'default') {
                    loadSvgAsImage('images/player-default.svg', function(img) {
                        images.player = img;
                        player.image = img;
                    });
                }
            });
        });
        
        // カスタムキャラクターのプレビュー
        document.getElementById('customCharacter').addEventListener('change', function(event) {
            handleCustomCharacter(event);
            
            // カスタムオプションを選択状態にする
            characterOptions.forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.character-option[data-character="custom"]').classList.add('selected');
        });
        
        // 敵のカスタマイズプレビュー
        const enemyPreview = document.createElement('div');
        enemyPreview.className = 'preview-container';
        enemyPreview.innerHTML = '<h4>敵のプレビュー</h4><div class="preview-image"></div>';
        document.querySelector('.customization-options .option:nth-child(1)').appendChild(enemyPreview);
        
        document.getElementById('customEnemy').addEventListener('change', function(event) {
            handleCustomEnemy(event);
            
            // プレビュー表示
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    enemyPreview.querySelector('.preview-image').innerHTML = `<img src="${e.target.result}" alt="敵のプレビュー" style="max-width: 50px; max-height: 50px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 背景のカスタマイズプレビュー
        const bgPreview = document.createElement('div');
        bgPreview.className = 'preview-container';
        bgPreview.innerHTML = '<h4>背景のプレビュー</h4><div class="preview-image"></div>';
        document.querySelector('.customization-options .option:nth-child(2)').appendChild(bgPreview);
        
        document.getElementById('customBackground').addEventListener('change', function(event) {
            handleCustomBackground(event);
            
            // プレビュー表示
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    bgPreview.querySelector('.preview-image').innerHTML = `<img src="${e.target.result}" alt="背景のプレビュー" style="max-width: 100px; max-height: 50px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // カスタマイズパネルのスタイル追加
    function addCustomizationStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .preview-container {
                margin-top: 10px;
                text-align: center;
            }
            .preview-container h4 {
                margin: 5px 0;
                font-size: 0.9em;
            }
            .preview-image {
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                padding: 5px;
                min-height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .character-option img {
                object-fit: contain;
                max-width: 100%;
                max-height: 100%;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // 初期化時に拡張機能を追加
    const originalInitGame = window.initGame;
    window.initGame = function() {
        originalInitGame();
        
        // デフォルト画像の読み込み関数を置き換え
        loadDefaultImagesEnhanced();
        
        // プレビュー機能の追加
        addPreviewFunctionality();
        
        // スタイルの追加
        addCustomizationStyles();
    };
}

// ページ読み込み時にカスタマイズシステムを拡張
window.addEventListener('load', function() {
    enhanceCustomizationSystem();
});
