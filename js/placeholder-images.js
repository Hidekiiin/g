/**
 * placeholder-images.js
 * Provides default images for the game elements
 */

// Define the images object that game.js is trying to access
const images = {
    // Player character images
    player: {
        default: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="15" r="10" fill="%23FFD700"/><rect x="15" y="25" width="20" height="20" fill="brown"/></svg>',
        custom: null
    },
    
    // Enemy images
    enemy: {
        default: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="red"/><rect x="15" y="15" width="5" height="5" fill="black"/><rect x="30" y="15" width="5" height="5" fill="black"/><path d="M15,30 Q25,20 35,30" stroke="black" fill="transparent" stroke-width="2"/></svg>',
        custom: null
    },
    
    // Background images
    background: {
        default: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23333d46"/></svg>',
        custom: null
    },
    
    // Coin images
    coin: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="gold" stroke="darkgoldenrod" stroke-width="2"/><text x="15" y="20" font-family="Arial" font-size="12" text-anchor="middle" fill="darkgoldenrod">¥</text></svg>',
    
    // Obstacle images
    obstacle: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" fill="brown"/></svg>'
};

// Function to set custom images
function setCustomImage(type, imageData) {
    if (type === 'player') {
        images.player.custom = imageData;
    } else if (type === 'enemy') {
        images.enemy.custom = imageData;
    } else if (type === 'background') {
        images.background.custom = imageData;
    }
}

// Function to get current image based on type and whether custom is available
function getImage(type, useCustom = false) {
    if (type === 'player') {
        return useCustom && images.player.custom ? images.player.custom : images.player.default;
    } else if (type === 'enemy') {
        return useCustom && images.enemy.custom ? images.enemy.custom : images.enemy.default;
    } else if (type === 'background') {
        return useCustom && images.background.custom ? images.background.custom : images.background.default;
    } else if (type === 'coin') {
        return images.coin;
    } else if (type === 'obstacle') {
        return images.obstacle;
    }
    return null;
}

console.log('Placeholder images loaded successfully');
