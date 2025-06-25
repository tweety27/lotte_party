// 게임 상태
const screens = {
  intro: document.getElementById('intro'),
  game: document.getElementById('game'),
  party: document.getElementById('party'),
};
const startBtn = document.getElementById('startBtn');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const messageDiv = document.getElementById('message');
const partyMusic = document.getElementById('partyMusic');
const pledgeInput = document.getElementById('pledgeInput');
const submitPledge = document.getElementById('submitPledge');
const finalPledge = document.getElementById('finalPledge');

let gameState = {
  player: { x: 50, y: 200, size: 64 },
  npcs: [
    { name: '아버지', x: 500, y: 80, invited: false },
    { name: '친구1', x: 100, y: 350, invited: false },
    { name: '친구2', x: 500, y: 300, invited: false },
    { name: '어머니', x: 300, y: 200, invited: false },
  ],
  invitedCount: 0,
  totalNpcs: 4,
  inGame: false,
};

// 플레이어 이미지 로드
const playerImg = new Image();
playerImg.src = 'assets/characters/seoyeon.png';

// 이미지 로드
const npcImages = {
  '아버지': new Image(),
  '친구1': new Image(),
  '친구2': new Image(),
  '어머니': new Image(),
};
npcImages['아버지'].src = 'assets/characters/sunghun.png';
npcImages['친구1'].src = 'assets/characters/yeram.png';
npcImages['친구2'].src = 'assets/characters/hyun.png';
npcImages['어머니'].src = 'assets/characters/jimin.png';

function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = 'none');
  screens[name].style.display = 'flex';
}

startBtn.onclick = () => {
  showScreen('game');
  gameState.inGame = true;
  drawGame();
  messageDiv.textContent = '';
};

function drawGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  // 플레이어
  if (playerImg.complete) {
    ctx.drawImage(playerImg, gameState.player.x, gameState.player.y, gameState.player.size, gameState.player.size);
  } else {
    ctx.fillStyle = '#0078d7';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.size, gameState.player.size);
  }
  // NPCs
  gameState.npcs.forEach(npc => {
    const img = npcImages[npc.name];
    if (img && img.complete) {
      ctx.globalAlpha = npc.invited ? 0.5 : 1.0;
      ctx.drawImage(img, npc.x, npc.y, 64, 64);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.fillStyle = npc.invited ? '#aaa' : '#ffb300';
      ctx.fillRect(npc.x, npc.y, 64, 64);
    }
    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.fillText(npc.name, npc.x, npc.y - 8);
    if (npc.invited) {
      ctx.fillText('✔', npc.x + 24, npc.y + 48);
    }
  });
}

document.addEventListener('keydown', e => {
  if (!gameState.inGame) return;
  let moved = false;
  if (e.key === 'ArrowLeft') { gameState.player.x -= 10; moved = true; }
  if (e.key === 'ArrowRight') { gameState.player.x += 10; moved = true; }
  if (e.key === 'ArrowUp') { gameState.player.y -= 10; moved = true; }
  if (e.key === 'ArrowDown') { gameState.player.y += 10; moved = true; }
  if (moved) {
    drawGame();
    messageDiv.textContent = '';
  }
  if (e.key === 'Enter') {
    let invited = false;
    gameState.npcs.forEach(npc => {
      if (!npc.invited && isNear(gameState.player, npc)) {
        npc.invited = true;
        gameState.invitedCount++;
        messageDiv.textContent = `${npc.name}에게 초대장을 전달했어요!`;
        invited = true;
      }
    });
    if (invited) {
      drawGame();
      if (gameState.invitedCount === gameState.totalNpcs) {
        setTimeout(() => {
          showParty();
        }, 1000);
      }
    }
  }
});

function isNear(player, npc) {
  return Math.abs(player.x - npc.x) < 64 && Math.abs(player.y - npc.y) < 64;
}

function showParty() {
  gameState.inGame = false;
  showScreen('party');
  partyMusic.play();
}

submitPledge.onclick = () => {
  const pledge = pledgeInput.value.trim();
  if (pledge) {
    finalPledge.textContent = `축하 메시지: ${pledge}`;
    finalPledge.style.display = 'inline-block';
    pledgeInput.style.display = 'none';
    submitPledge.style.display = 'none';
  }
}; 