// ===================================
// SOLO LEVELING DASHBOARD - FULL JAVASCRIPT
// ===================================

// Game State Management
const gameState = {
  player: {
    name: "Sung Jin-Woo",
    level: 24,
    xp: 4500,
    xpToNextLevel: 5000,
    gold: 1200,
    class: "Shadow Monarch",
    attributes: {
      strength: 45,
      intelligence: 82,
      agility: 30,
      vitality: 60
    },
    availablePoints: 3
  },
  dailyQuests: [
    { id: 1, name: "Push-ups: 100", progress: 100, max: 100, completed: true },
    { id: 2, name: "Coding: 2 Hours", progress: 75, max: 120, completed: false, unit: "minutes" },
    { id: 3, name: "Run: 10km", progress: 0, max: 10, completed: false, unit: "km" }
  ],
  skills: [
    { id: 1, name: "Stealth", level: 2, type: "active", cooldown: 0 },
    { id: 2, name: "Sprint", level: 3, type: "active", cooldown: 12 },
    { id: 3, name: "Dagger Arts", level: 5, type: "passive", cooldown: 0 }
  ],
  notifications: 2,
  currentView: "status"
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  attachEventListeners();
  startGameLoop();
});

function initializeApp() {
  console.log('🎮 Solo Leveling Dashboard Initialized');
  updateAllUI();
  loadSavedState();
  showWelcomeNotification();
}

// ===================================
// EVENT LISTENERS
// ===================================

function attachEventListeners() {
  // Top Bar Events
  attachMenuListener();
  attachGoldListener();
  attachNotificationListener();
  
  // Alert Banner
  attachAlertBannerListener();
  
  // Profile Events
  attachLevelCircleListener();
  attachAttributeDetailsListener();
  attachAttributeCardListeners();
  
  // Daily Quest Events
  attachQuestCheckboxListeners();
  attachClaimRewardsListener();
  
  // Skill Events
  attachSkillCardListeners();
  
  // Navigation Events
  attachNavigationListeners();
}

// --- Top Bar Listeners ---
function attachMenuListener() {
  const menuIcon = document.querySelector('.sticky .material-symbols-outlined:first-child');
  if (menuIcon) {
    menuIcon.addEventListener('click', function() {
      showModal('Menu', `
        <div class="space-y-3">
          <button class="w-full p-3 bg-card-dark rounded-lg hover:bg-primary/20 transition-colors text-left">
            <span class="material-symbols-outlined inline-block mr-2">person</span>Profile
          </button>
          <button class="w-full p-3 bg-card-dark rounded-lg hover:bg-primary/20 transition-colors text-left">
            <span class="material-symbols-outlined inline-block mr-2">history</span>Quest History
          </button>
          <button class="w-full p-3 bg-card-dark rounded-lg hover:bg-primary/20 transition-colors text-left">
            <span class="material-symbols-outlined inline-block mr-2">leaderboard</span>Rankings
          </button>
          <button class="w-full p-3 bg-card-dark rounded-lg hover:bg-primary/20 transition-colors text-left">
            <span class="material-symbols-outlined inline-block mr-2">logout</span>Logout
          </button>
        </div>
      `);
    });
  }
}

function attachGoldListener() {
  const goldCounter = document.querySelector('.flex.items-center.gap-1');
  if (goldCounter) {
    goldCounter.addEventListener('click', function() {
      addGold(100);
      showToast('💰 Daily bonus: +100 Gold!', 'success');
    });
  }
}

function attachNotificationListener() {
  const notificationBell = document.querySelector('.relative .material-symbols-outlined');
  if (notificationBell && notificationBell.textContent.includes('notifications')) {
    notificationBell.addEventListener('click', function() {
      showNotifications();
    });
  }
}

// --- Alert Banner Listener ---
function attachAlertBannerListener() {
  const alertBanner = document.querySelector('.mx-4.mt-4.p-3');
  if (alertBanner) {
    alertBanner.addEventListener('click', function() {
      showAttributePointsModal();
    });
  }
}

// --- Profile Listeners ---
function attachLevelCircleListener() {
  const levelCircle = document.querySelector('.relative.flex.items-center.justify-center.w-32.h-32');
  if (levelCircle) {
    levelCircle.addEventListener('click', function() {
      showModal('Level Info', `
        <div class="text-center space-y-4">
          <h3 class="text-3xl font-bold text-primary">Level ${gameState.player.level}</h3>
          <p class="text-gray-400">XP: ${gameState.player.xp} / ${gameState.player.xpToNextLevel}</p>
          <div class="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-500" style="width: ${(gameState.player.xp / gameState.player.xpToNextLevel) * 100}%"></div>
          </div>
          <p class="text-sm text-gray-400">${gameState.player.xpToNextLevel - gameState.player.xp} XP until next level</p>
        </div>
      `);
    });
  }
}

function attachAttributeDetailsListener() {
  const detailsButton = document.querySelector('button.text-primary');
  if (detailsButton && detailsButton.textContent.includes('Details')) {
    detailsButton.addEventListener('click', function() {
      showAttributeDetailsModal();
    });
  }
}

function attachAttributeCardListeners() {
  const attributeCards = document.querySelectorAll('.grid.grid-cols-2.gap-3 > div');
  attributeCards.forEach((card, index) => {
    card.addEventListener('click', function() {
      const attributes = ['strength', 'intelligence', 'agility', 'vitality'];
      const attrName = attributes[index];
      const attrValue = gameState.player.attributes[attrName];
      
      showModal(`${capitalize(attrName)} Attribute`, `
        <div class="space-y-4">
          <div class="text-center">
            <p class="text-5xl font-bold text-white mb-2">${attrValue}</p>
            <p class="text-gray-400">Current ${capitalize(attrName)}</p>
          </div>
          <div class="bg-card-dark p-4 rounded-lg space-y-2 text-sm">
            <p><span class="text-gray-400">Effect:</span> ${getAttributeEffect(attrName, attrValue)}</p>
            <p><span class="text-gray-400">Next Level:</span> ${getAttributeEffect(attrName, attrValue + 1)}</p>
          </div>
          ${gameState.player.availablePoints > 0 ? `
            <button onclick="upgradeAttribute('${attrName}')" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all">
              Upgrade (+1 Point)
            </button>
          ` : '<p class="text-center text-gray-400 text-sm">No available points</p>'}
        </div>
      `);
    });
  });
}

// --- Daily Quest Listeners ---
function attachQuestCheckboxListeners() {
  const questItems = document.querySelectorAll('.p-4.space-y-4 > div');
  questItems.forEach((item, index) => {
    const checkbox = item.querySelector('.flex-shrink-0.h-6.w-6');
    if (checkbox) {
      checkbox.addEventListener('click', function() {
        toggleQuestCompletion(index);
      });
    }
  });
}

function attachClaimRewardsListener() {
  const claimButton = document.querySelector('.bg-primary.hover\\:bg-primary-dark');
  if (claimButton && claimButton.textContent.includes('CLAIM')) {
    claimButton.addEventListener('click', function() {
      claimDailyRewards();
    });
  }
}

// --- Skill Listeners ---
function attachSkillCardListeners() {
  const skillCards = document.querySelectorAll('.snap-center.min-w-\\[140px\\]');
  skillCards.forEach((card, index) => {
    card.addEventListener('click', function() {
      showSkillDetails(index);
    });
  });
}

// --- Navigation Listeners ---
function attachNavigationListeners() {
  const navButtons = document.querySelectorAll('.fixed.bottom-0 button');
  
  navButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      handleNavigation(index);
    });
  });
}

// ===================================
// GAME LOGIC FUNCTIONS
// ===================================

function toggleQuestCompletion(questIndex) {
  const quest = gameState.dailyQuests[questIndex];
  
  if (quest.completed) {
    showToast('Quest already completed!', 'info');
    return;
  }
  
  quest.progress = quest.max;
  quest.completed = true;
  
  updateQuestUI(questIndex);
  showToast(`✓ ${quest.name} completed!`, 'success');
  
  // Check if all quests are complete
  checkAllQuestsComplete();
}

function claimDailyRewards() {
  const completedQuests = gameState.dailyQuests.filter(q => q.completed).length;
  
  if (completedQuests === 0) {
    showToast('Complete some quests first!', 'error');
    return;
  }
  
  const xpGained = completedQuests * 500;
  const goldGained = completedQuests * 200;
  
  addXP(xpGained);
  addGold(goldGained);
  
  showModal('Rewards Claimed! 🎉', `
    <div class="text-center space-y-4">
      <div class="text-6xl mb-4">🏆</div>
      <h3 class="text-2xl font-bold text-primary">Daily Quest Rewards</h3>
      <div class="space-y-2">
        <p class="text-lg">+${xpGained} XP</p>
        <p class="text-lg">+${goldGained} Gold</p>
        <p class="text-lg">+${completedQuests} Attribute Points</p>
      </div>
      <p class="text-sm text-gray-400">Quests completed: ${completedQuests}/3</p>
    </div>
  `);
  
  // Add attribute points
  gameState.player.availablePoints += completedQuests;
  
  // Reset quests for next day
  setTimeout(() => {
    resetDailyQuests();
  }, 3000);
}

function resetDailyQuests() {
  gameState.dailyQuests.forEach(quest => {
    quest.progress = 0;
    quest.completed = false;
  });
  updateAllQuestsUI();
  showToast('Daily quests reset! New challenges await.', 'info');
}

function addXP(amount) {
  gameState.player.xp += amount;
  
  // Check for level up
  while (gameState.player.xp >= gameState.player.xpToNextLevel) {
    levelUp();
  }
  
  updateXPBar();
}

function levelUp() {
  gameState.player.xp -= gameState.player.xpToNextLevel;
  gameState.player.level++;
  gameState.player.xpToNextLevel = Math.floor(gameState.player.xpToNextLevel * 1.5);
  gameState.player.availablePoints += 3;
  
  showModal('LEVEL UP! ⚡', `
    <div class="text-center space-y-4">
      <div class="text-8xl mb-4 animate-bounce">🎊</div>
      <h3 class="text-4xl font-bold text-primary">Level ${gameState.player.level}</h3>
      <p class="text-xl">You've grown stronger!</p>
      <div class="bg-card-dark p-4 rounded-lg space-y-2">
        <p>+3 Attribute Points</p>
        <p>+100 HP</p>
        <p>+50 MP</p>
      </div>
    </div>
  `);
  
  updateLevelDisplay();
  playLevelUpAnimation();
}

function addGold(amount) {
  gameState.player.gold += amount;
  updateGoldDisplay();
  animateGoldCounter();
}

function upgradeAttribute(attrName) {
  if (gameState.player.availablePoints <= 0) {
    showToast('No available points!', 'error');
    return;
  }
  
  gameState.player.attributes[attrName]++;
  gameState.player.availablePoints--;
  
  updateAttributeUI(attrName);
  updateAvailablePoints();
  closeModal();
  
  showToast(`${capitalize(attrName)} increased to ${gameState.player.attributes[attrName]}!`, 'success');
}

function showSkillDetails(skillIndex) {
  const skill = gameState.skills[skillIndex];
  
  showModal(`${skill.name}`, `
    <div class="space-y-4">
      <div class="text-center">
        <p class="text-gray-400 mb-2">${skill.type.toUpperCase()}</p>
        <p class="text-3xl font-bold text-primary mb-2">Level ${skill.level}</p>
      </div>
      <div class="bg-card-dark p-4 rounded-lg space-y-2 text-sm">
        <p><span class="text-gray-400">Type:</span> ${capitalize(skill.type)}</p>
        <p><span class="text-gray-400">Cooldown:</span> ${skill.cooldown > 0 ? skill.cooldown + 's' : 'None'}</p>
        <p><span class="text-gray-400">Effect:</span> ${getSkillEffect(skill)}</p>
      </div>
      <button onclick="useSkill(${skillIndex})" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all ${skill.cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}">
        ${skill.cooldown > 0 ? `Cooldown: ${skill.cooldown}s` : 'Use Skill'}
      </button>
    </div>
  `);
}

function useSkill(skillIndex) {
  const skill = gameState.skills[skillIndex];
  
  if (skill.cooldown > 0) {
    showToast('Skill is on cooldown!', 'error');
    return;
  }
  
  showToast(`${skill.name} activated!`, 'success');
  closeModal();
  
  // Set cooldown
  if (skill.type === 'active') {
    skill.cooldown = 10 + (skillIndex * 5);
    startSkillCooldown(skillIndex);
  }
}

function startSkillCooldown(skillIndex) {
  const interval = setInterval(() => {
    const skill = gameState.skills[skillIndex];
    skill.cooldown--;
    
    if (skill.cooldown <= 0) {
      clearInterval(interval);
      showToast(`${skill.name} is ready!`, 'info');
    }
  }, 1000);
}

// ===================================
// UI UPDATE FUNCTIONS
// ===================================

function updateAllUI() {
  updateLevelDisplay();
  updateXPBar();
  updateGoldDisplay();
  updateAttributesUI();
  updateAllQuestsUI();
  updateAvailablePoints();
}

function updateLevelDisplay() {
  const levelText = document.querySelector('.absolute.flex.flex-col span:last-child');
  if (levelText) {
    levelText.textContent = gameState.player.level;
  }
  
  // Update circular progress
  const circle = document.querySelector('svg circle:last-child');
  if (circle) {
    const progress = (gameState.player.xp / gameState.player.xpToNextLevel) * 100;
    const circumference = 377;
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
}

function updateXPBar() {
  const xpBar = document.querySelector('.h-2.w-full.bg-card-dark .h-full.bg-primary');
  const xpText = document.querySelector('.flex.justify-between.text-xs.text-gray-400 span:last-child');
  
  if (xpBar) {
    const percentage = (gameState.player.xp / gameState.player.xpToNextLevel) * 100;
    xpBar.style.width = percentage + '%';
  }
  
  if (xpText) {
    xpText.textContent = `${gameState.player.xp} / ${gameState.player.xpToNextLevel}`;
  }
}

function updateGoldDisplay() {
  const goldText = document.querySelector('.flex.items-center.gap-1 span.text-sm.font-bold');
  if (goldText) {
    goldText.textContent = gameState.player.gold.toLocaleString();
  }
}

function updateAttributesUI() {
  const attributes = ['strength', 'intelligence', 'agility', 'vitality'];
  attributes.forEach((attr, index) => {
    updateAttributeUI(attr);
  });
}

function updateAttributeUI(attrName) {
  const attributes = ['strength', 'intelligence', 'agility', 'vitality'];
  const index = attributes.indexOf(attrName);
  const cards = document.querySelectorAll('.grid.grid-cols-2.gap-3 > div');
  
  if (cards[index]) {
    const valueSpan = cards[index].querySelector('.text-xl.font-bold');
    const progressBar = cards[index].querySelector('.h-1\\.5 > div');
    
    if (valueSpan) {
      valueSpan.textContent = gameState.player.attributes[attrName];
    }
    
    if (progressBar) {
      progressBar.style.width = gameState.player.attributes[attrName] + '%';
    }
  }
}

function updateQuestUI(questIndex) {
  const questItems = document.querySelectorAll('.p-4.space-y-4 > div');
  const quest = gameState.dailyQuests[questIndex];
  
  if (questItems[questIndex]) {
    const checkbox = questItems[questIndex].querySelector('.flex-shrink-0.h-6.w-6');
    const progressBar = questItems[questIndex].querySelector('.h-1\\.5 .h-full.bg-primary');
    const progressText = questItems[questIndex].querySelector('.text-xs.text-gray-400');
    const questName = questItems[questIndex].querySelector('.text-sm.font-medium');
    
    if (quest.completed) {
      checkbox.classList.add('border-primary', 'bg-primary');
      checkbox.innerHTML = '<span class="material-symbols-outlined text-white text-sm font-bold">check</span>';
      questName.classList.add('line-through', 'decoration-primary', 'decoration-2');
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) {
        progressText.textContent = 'COMPLETE';
        progressText.classList.remove('text-gray-400');
        progressText.classList.add('text-primary', 'font-bold');
      }
    } else {
      const percentage = (quest.progress / quest.max) * 100;
      if (progressBar) progressBar.style.width = percentage + '%';
      if (progressText) {
        const displayProgress = quest.unit === 'minutes' ? formatTime(quest.progress) : quest.progress + (quest.unit || '');
        const displayMax = quest.unit === 'minutes' ? formatTime(quest.max) : quest.max + (quest.unit || '');
        progressText.textContent = `${displayProgress} / ${displayMax}`;
      }
    }
  }
}

function updateAllQuestsUI() {
  gameState.dailyQuests.forEach((quest, index) => {
    updateQuestUI(index);
  });
}

function updateAvailablePoints() {
  const alertBanner = document.querySelector('.mx-4.mt-4.p-3');
  if (alertBanner) {
    const pointsText = alertBanner.querySelector('.text-xs');
    if (pointsText) {
      pointsText.textContent = `You have ${gameState.player.availablePoints} ability point${gameState.player.availablePoints !== 1 ? 's' : ''} available.`;
    }
    
    // Hide banner if no points
    if (gameState.player.availablePoints === 0) {
      alertBanner.style.display = 'none';
    } else {
      alertBanner.style.display = 'flex';
    }
  }
}

// ===================================
// NAVIGATION FUNCTIONS
// ===================================

function handleNavigation(navIndex) {
  const views = ['status', 'inventory', 'shop', 'skills', 'settings'];
  const navButtons = document.querySelectorAll('.fixed.bottom-0 button');
  
  // Remove active state from all buttons
  navButtons.forEach(btn => {
    btn.classList.remove('text-primary');
    btn.classList.add('text-gray-500');
  });
  
  // Add active state to clicked button
  navButtons[navIndex].classList.add('text-primary');
  navButtons[navIndex].classList.remove('text-gray-500');
  
  // Update current view
  gameState.currentView = views[navIndex];
  
  // Handle different views
  switch(navIndex) {
    case 0: // Status
      showToast('Status view', 'info');
      break;
    case 1: // Inventory
      showInventoryModal();
      break;
    case 2: // Shop
      showShopModal();
      break;
    case 3: // Skills
      showSkillsModal();
      break;
    case 4: // Settings
      showSettingsModal();
      break;
  }
}

function showInventoryModal() {
  showModal('Inventory', `
    <div class="space-y-4">
      <div class="grid grid-cols-4 gap-3">
        <div class="bg-card-dark p-3 rounded-lg border border-border-dark text-center">
          <div class="text-2xl mb-2">⚔️</div>
          <p class="text-xs text-gray-400">Iron Sword</p>
        </div>
        <div class="bg-card-dark p-3 rounded-lg border border-border-dark text-center">
          <div class="text-2xl mb-2">🛡️</div>
          <p class="text-xs text-gray-400">Steel Shield</p>
        </div>
        <div class="bg-card-dark p-3 rounded-lg border border-border-dark text-center">
          <div class="text-2xl mb-2">💊</div>
          <p class="text-xs text-gray-400">Health Potion</p>
        </div>
        <div class="bg-card-dark p-3 rounded-lg border border-border-dark text-center opacity-50">
          <div class="text-2xl mb-2">+</div>
          <p class="text-xs text-gray-400">Empty</p>
        </div>
      </div>
      <p class="text-center text-sm text-gray-400">4/20 slots used</p>
    </div>
  `);
}

function showShopModal() {
  showModal('Shop 🏪', `
    <div class="space-y-3">
      <div class="bg-card-dark p-4 rounded-lg border border-border-dark flex justify-between items-center">
        <div>
          <p class="font-bold">Health Potion</p>
          <p class="text-xs text-gray-400">Restores 50 HP</p>
        </div>
        <button onclick="buyItem('Health Potion', 100)" class="bg-primary hover:bg-primary-dark px-4 py-2 rounded text-sm font-bold">
          100G
        </button>
      </div>
      <div class="bg-card-dark p-4 rounded-lg border border-border-dark flex justify-between items-center">
        <div>
          <p class="font-bold">Mana Potion</p>
          <p class="text-xs text-gray-400">Restores 50 MP</p>
        </div>
        <button onclick="buyItem('Mana Potion', 150)" class="bg-primary hover:bg-primary-dark px-4 py-2 rounded text-sm font-bold">
          150G
        </button>
      </div>
      <div class="bg-card-dark p-4 rounded-lg border border-border-dark flex justify-between items-center">
        <div>
          <p class="font-bold">XP Boost (1h)</p>
          <p class="text-xs text-gray-400">+50% XP gain</p>
        </div>
        <button onclick="buyItem('XP Boost', 500)" class="bg-primary hover:bg-primary-dark px-4 py-2 rounded text-sm font-bold">
          500G
        </button>
      </div>
    </div>
  `);
}

function buyItem(itemName, cost) {
  if (gameState.player.gold >= cost) {
    gameState.player.gold -= cost;
    updateGoldDisplay();
    showToast(`Purchased ${itemName}!`, 'success');
    closeModal();
  } else {
    showToast('Not enough gold!', 'error');
  }
}

function showSkillsModal() {
  showModal('Skills & Abilities', `
    <div class="space-y-3">
      ${gameState.skills.map((skill, index) => `
        <div class="bg-card-dark p-4 rounded-lg border border-border-dark">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-bold">${skill.name}</p>
              <p class="text-xs text-gray-400">${capitalize(skill.type)} - Level ${skill.level}</p>
            </div>
            <button onclick="upgradeSkill(${index})" class="bg-primary hover:bg-primary-dark px-3 py-1 rounded text-xs font-bold">
              Upgrade
            </button>
          </div>
          <p class="text-sm text-gray-400">${getSkillEffect(skill)}</p>
        </div>
      `).join('')}
    </div>
  `);
}

function upgradeSkill(skillIndex) {
  const cost = 500;
  if (gameState.player.gold >= cost) {
    gameState.skills[skillIndex].level++;
    gameState.player.gold -= cost;
    updateGoldDisplay();
    showToast(`${gameState.skills[skillIndex].name} upgraded!`, 'success');
    closeModal();
  } else {
    showToast('Not enough gold!', 'error');
  }
}

function showSettingsModal() {
  showModal('Settings ⚙️', `
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="flex items-center justify-between">
          <span>Sound Effects</span>
          <input type="checkbox" checked class="toggle">
        </label>
        <label class="flex items-center justify-between">
          <span>Music</span>
          <input type="checkbox" checked class="toggle">
        </label>
        <label class="flex items-center justify-between">
          <span>Notifications</span>
          <input type="checkbox" checked class="toggle">
        </label>
      </div>
      <hr class="border-border-dark">
      <button onclick="resetGame()" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg">
        Reset Progress
      </button>
      <button onclick="saveGame()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">
        Save Game
      </button>
    </div>
  `);
}

function showAttributePointsModal() {
  showModal('Spend Attribute Points', `
    <div class="space-y-3">
      <p class="text-center text-gray-400">Available Points: <span class="text-primary font-bold">${gameState.player.availablePoints}</span></p>
      ${Object.entries(gameState.player.attributes).map(([attr, value]) => `
        <div class="bg-card-dark p-4 rounded-lg border border-border-dark flex justify-between items-center">
          <div>
            <p class="font-bold">${capitalize(attr)}</p>
            <p class="text-sm text-gray-400">Current: ${value}</p>
          </div>
          <button onclick="upgradeAttribute('${attr}')" class="bg-primary hover:bg-primary-dark px-4 py-2 rounded font-bold ${gameState.player.availablePoints === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
            +1
          </button>
        </div>
      `).join('')}
    </div>
  `);
}

function showAttributeDetailsModal() {
  showModal('Attribute Details', `
    <div class="space-y-3">
      ${Object.entries(gameState.player.attributes).map(([attr, value]) => `
        <div class="bg-card-dark p-4 rounded-lg border border-border-dark">
          <p class="font-bold mb-2">${capitalize(attr)}: ${value}</p>
          <p class="text-sm text-gray-400">${getAttributeEffect(attr, value)}</p>
        </div>
      `).join('')}
    </div>
  `);
}

// ===================================
// MODAL & NOTIFICATION SYSTEM
// ===================================

function showModal(title, content) {
  // Remove existing modal if any
  const existingModal = document.getElementById('customModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'customModal';
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.style.backdropFilter = 'blur(8px)';
  
  modal.innerHTML = `
    <div class="bg-background-dark border border-border-dark rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all" style="animation: modalSlideIn 0.3s ease-out;">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">${title}</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-white transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="text-white">
        ${content}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalSlideIn {
      from { opacity: 0; transform: translateY(-20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
}

function closeModal() {
  const modal = document.getElementById('customModal');
  if (modal) {
    modal.style.animation = 'modalSlideOut 0.2s ease-in';
    setTimeout(() => modal.remove(), 200);
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'fixed top-20 right-4 z-[110] px-4 py-3 rounded-lg shadow-lg transform transition-all';
  
  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-primary text-white',
    warning: 'bg-yellow-500 text-white'
  };
  
  toast.className += ' ' + colors[type];
  toast.style.animation = 'toastSlideIn 0.3s ease-out';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
  
  // Add toast animations
  if (!document.getElementById('toastAnimations')) {
    const style = document.createElement('style');
    style.id = 'toastAnimations';
    style.textContent = `
      @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes toastSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
      }
      @keyframes modalSlideOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(-20px) scale(0.95); }
      }
    `;
    document.head.appendChild(style);
  }
}

function showNotifications() {
  showModal('Notifications 🔔', `
    <div class="space-y-3">
      <div class="bg-card-dark p-4 rounded-lg border border-border-dark border-l-4 border-l-primary">
        <div class="flex justify-between items-start mb-2">
          <p class="font-bold text-sm">Daily Quest Available</p>
          <span class="text-xs text-gray-400">2m ago</span>
        </div>
        <p class="text-xs text-gray-400">New daily challenges are ready!</p>
      </div>
      <div class="bg-card-dark p-4 rounded-lg border border-border-dark border-l-4 border-l-green-500">
        <div class="flex justify-between items-start mb-2">
          <p class="font-bold text-sm">Level Up!</p>
          <span class="text-xs text-gray-400">1h ago</span>
        </div>
        <p class="text-xs text-gray-400">You reached Level ${gameState.player.level}!</p>
      </div>
      <div class="bg-card-dark p-4 rounded-lg border border-border-dark border-l-4 border-l-yellow-500">
        <div class="flex justify-between items-start mb-2">
          <p class="font-bold text-sm">New Items Available</p>
          <span class="text-xs text-gray-400">3h ago</span>
        </div>
        <p class="text-xs text-gray-400">Check the shop for new equipment!</p>
      </div>
    </div>
    <div class="mt-4 text-center">
      <button onclick="clearNotifications()" class="text-sm text-primary hover:text-primary-dark">
        Clear All
      </button>
    </div>
  `);
  
  // Clear notification badge
  gameState.notifications = 0;
  updateNotificationBadge();
}

function clearNotifications() {
  showToast('All notifications cleared', 'info');
  closeModal();
}

function updateNotificationBadge() {
  const badge = document.querySelector('.absolute.top-0.right-0.h-2.w-2');
  if (badge) {
    badge.style.display = gameState.notifications > 0 ? 'block' : 'none';
  }
}

function showWelcomeNotification() {
  setTimeout(() => {
    showToast('Welcome back, Shadow Monarch!', 'info');
  }, 1000);
}

// ===================================
// HELPER FUNCTIONS
// ===================================

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function getAttributeEffect(attr, value) {
  const effects = {
    strength: `Physical damage +${value * 2}. Carry capacity +${value * 5}kg.`,
    intelligence: `Magic damage +${value * 3}. MP +${value * 10}. Skill power +${value}%.`,
    agility: `Attack speed +${value}%. Movement speed +${value * 2}%. Dodge chance +${Math.floor(value / 10)}%.`,
    vitality: `Max HP +${value * 20}. HP regen +${value / 2}/min. Defense +${value}.`
  };
  return effects[attr] || 'Increases combat effectiveness.';
}

function getSkillEffect(skill) {
  const effects = {
    'Stealth': 'Become invisible for 5 seconds. Enemies cannot detect you.',
    'Sprint': 'Increase movement speed by 50% for 3 seconds.',
    'Dagger Arts': 'Passive: +15% critical strike chance with daggers.'
  };
  return effects[skill.name] || 'A powerful ability that aids in combat.';
}

function checkAllQuestsComplete() {
  const allComplete = gameState.dailyQuests.every(q => q.completed);
  if (allComplete) {
    showToast('All daily quests complete! Claim your rewards!', 'success');
  }
}

// ===================================
// ANIMATION FUNCTIONS
// ===================================

function playLevelUpAnimation() {
  const levelCircle = document.querySelector('.relative.flex.items-center.justify-center.w-32.h-32');
  if (levelCircle) {
    levelCircle.style.animation = 'none';
    setTimeout(() => {
      levelCircle.style.animation = 'levelUpPulse 0.6s ease-out';
    }, 10);
  }
  
  // Add level up animation
  if (!document.getElementById('levelUpAnimation')) {
    const style = document.createElement('style');
    style.id = 'levelUpAnimation';
    style.textContent = `
      @keyframes levelUpPulse {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.15); }
        50% { transform: scale(0.95); }
        75% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }
}

function animateGoldCounter() {
  const goldCounter = document.querySelector('.flex.items-center.gap-1');
  if (goldCounter) {
    goldCounter.style.animation = 'none';
    setTimeout(() => {
      goldCounter.style.animation = 'bounce 0.5s ease-out';
    }, 10);
  }
  
  // Add bounce animation
  if (!document.getElementById('bounceAnimation')) {
    const style = document.createElement('style');
    style.id = 'bounceAnimation';
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: scale(1) translateY(0); }
        25% { transform: scale(1.1) translateY(-5px); }
        50% { transform: scale(0.95) translateY(0); }
        75% { transform: scale(1.05) translateY(-2px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===================================
// GAME LOOP & AUTO-PROGRESSION
// ===================================

function startGameLoop() {
  // Update quest progress automatically
  setInterval(() => {
    // Auto-progress coding quest
    const codingQuest = gameState.dailyQuests[1];
    if (!codingQuest.completed && codingQuest.progress < codingQuest.max) {
      codingQuest.progress += 1;
      updateQuestUI(1);
      
      if (codingQuest.progress >= codingQuest.max) {
        codingQuest.completed = true;
        showToast('Coding quest completed!', 'success');
        checkAllQuestsComplete();
      }
    }
  }, 60000); // Every minute
  
  // Passive XP gain
  setInterval(() => {
    addXP(10);
  }, 30000); // Every 30 seconds
  
  // Random gold drops
  setInterval(() => {
    if (Math.random() > 0.7) {
      const goldAmount = Math.floor(Math.random() * 50) + 10;
      addGold(goldAmount);
      showToast(`Found ${goldAmount} gold!`, 'info');
    }
  }, 45000); // Every 45 seconds
}

// ===================================
// SAVE & LOAD SYSTEM
// ===================================

function saveGame() {
  try {
    const saveData = JSON.stringify(gameState);
    localStorage.setItem('soloLevelingSave', saveData);
    showToast('Game saved successfully!', 'success');
  } catch (error) {
    showToast('Failed to save game', 'error');
    console.error('Save error:', error);
  }
}

function loadSavedState() {
  try {
    const savedData = localStorage.getItem('soloLevelingSave');
    if (savedData) {
      const loadedState = JSON.parse(savedData);
      Object.assign(gameState, loadedState);
      updateAllUI();
      showToast('Game loaded!', 'info');
    }
  } catch (error) {
    console.error('Load error:', error);
  }
}

function resetGame() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
    localStorage.removeItem('soloLevelingSave');
    location.reload();
  }
}

// Auto-save every 2 minutes
setInterval(() => {
  saveGame();
}, 120000);

// Save before page unload
window.addEventListener('beforeunload', () => {
  saveGame();
});

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
  // ESC to close modal
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Number keys for navigation (1-5)
  if (e.key >= '1' && e.key <= '5') {
    const index = parseInt(e.key) - 1;
    handleNavigation(index);
  }
  
  // 'S' for save
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault();
    saveGame();
  }
  
  // 'I' for inventory
  if (e.key === 'i') {
    showInventoryModal();
  }
  
  // 'K' for skills
  if (e.key === 'k') {
    showSkillsModal();
  }
});

// ===================================
// QUEST PROGRESS SIMULATION
// ===================================

function simulateQuestProgress(questIndex, amount) {
  const quest = gameState.dailyQuests[questIndex];
  if (!quest.completed) {
    quest.progress = Math.min(quest.progress + amount, quest.max);
    updateQuestUI(questIndex);
    
    if (quest.progress >= quest.max) {
      quest.completed = true;
      showToast(`${quest.name} completed!`, 'success');
      checkAllQuestsComplete();
    }
  }
}

// Add test buttons for quest progression (for development)
function addTestControls() {
  const testDiv = document.createElement('div');
  testDiv.id = 'testControls';
  testDiv.style.cssText = 'position: fixed; bottom: 100px; right: 10px; z-index: 1000; display: none;';
  testDiv.innerHTML = `
    <div class="bg-card-dark p-3 rounded-lg border border-border-dark space-y-2">
      <button onclick="simulateQuestProgress(1, 30)" class="w-full bg-primary text-white text-xs px-2 py-1 rounded">
        +30min Coding
      </button>
      <button onclick="simulateQuestProgress(2, 2)" class="w-full bg-primary text-white text-xs px-2 py-1 rounded">
        +2km Run
      </button>
      <button onclick="addXP(500)" class="w-full bg-green-500 text-white text-xs px-2 py-1 rounded">
        +500 XP
      </button>
      <button onclick="addGold(1000)" class="w-full bg-yellow-500 text-white text-xs px-2 py-1 rounded">
        +1000 Gold
      </button>
    </div>
  `;
  document.body.appendChild(testDiv);
}

// Toggle test controls with Ctrl+Shift+T
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'T') {
    const testControls = document.getElementById('testControls');
    if (!testControls) {
      addTestControls();
    } else {
      testControls.style.display = testControls.style.display === 'none' ? 'block' : 'none';
    }
  }
});

// ===================================
// RANDOM EVENTS SYSTEM
// ===================================

function triggerRandomEvent() {
  const events = [
    {
      title: 'Rare Monster Appeared!',
      message: 'A powerful enemy has been detected nearby.',
      rewards: { xp: 1000, gold: 500 },
      chance: 0.1
    },
    {
      title: 'Hidden Chest Found!',
      message: 'You discovered a hidden treasure chest.',
      rewards: { gold: 300 },
      chance: 0.2
    },
    {
      title: 'System Message',
      message: 'Your training efficiency has increased.',
      rewards: { xp: 200 },
      chance: 0.3
    }
  ];
  
  const event = events.find(e => Math.random() < e.chance);
  if (event) {
    showModal(event.title, `
      <div class="text-center space-y-4">
        <p class="text-lg">${event.message}</p>
        <div class="bg-card-dark p-4 rounded-lg">
          ${event.rewards.xp ? `<p>+${event.rewards.xp} XP</p>` : ''}
          ${event.rewards.gold ? `<p>+${event.rewards.gold} Gold</p>` : ''}
        </div>
        <button onclick="claimEventRewards(${JSON.stringify(event.rewards).replace(/"/g, '&quot;')})" 
                class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg">
          Claim Rewards
        </button>
      </div>
    `);
  }
}

function claimEventRewards(rewards) {
  if (rewards.xp) addXP(rewards.xp);
  if (rewards.gold) addGold(rewards.gold);
  showToast('Rewards claimed!', 'success');
  closeModal();
}

// Trigger random events periodically
setInterval(() => {
  triggerRandomEvent();
}, 180000); // Every 3 minutes

// ===================================
// CONSOLE COMMANDS (Easter Egg)
// ===================================

window.soloLeveling = {
  addXP: (amount) => addXP(amount),
  addGold: (amount) => addGold(amount),
  levelUp: () => levelUp(),
  completeQuest: (index) => toggleQuestCompletion(index),
  resetGame: () => resetGame(),
  getState: () => gameState,
  godMode: () => {
    gameState.player.level = 100;
    gameState.player.gold = 999999;
    Object.keys(gameState.player.attributes).forEach(attr => {
      gameState.player.attributes[attr] = 100;
    });
    updateAllUI();
    showToast('God Mode Activated!', 'success');
  }
};

console.log('%c🎮 Solo Leveling Dashboard', 'color: #7f13ec; font-size: 20px; font-weight: bold;');
console.log('%cTry these commands:', 'color: #7f13ec; font-size: 14px;');
console.log('soloLeveling.addXP(1000) - Add XP');
console.log('soloLeveling.addGold(5000) - Add Gold');
console.log('soloLeveling.levelUp() - Level Up');
console.log('soloLeveling.godMode() - Activate God Mode');
console.log('%cPress Ctrl+Shift+T for test controls', 'color: #888; font-style: italic;');

// ===================================
// INITIALIZATION COMPLETE
// ===================================

console.log('✅ Solo Leveling Dashboard fully initialized and functional!');