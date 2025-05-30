// import { utils } from 'near-api-js';
import { loadAllModules } from './imports.js';
import { Wallet } from './near-wallet.js';
import { HigherLowerGame } from './higher-lower-game.js';
import { BackgroundEffect } from './background-effect.js';
import { CardEffect } from './card-effect.js';

let wallet;
let game;
let backgroundEffect;
let cardEffect;

// Initialize the application
async function init() {
  // Load all external modules first
  await loadAllModules();
  
  // Then initialize our wallet
  wallet = new Wallet({ network: 'testnet' });

  // Button clicks
  document.querySelector('#sign-in-button').onclick = () => { wallet.signIn(); };
  document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };
  document.querySelector('#welcome-sign-in').onclick = () => { wallet.signIn(); };

  // Start the wallet, which checks if the user is already signed in
  await wallet.startUp(handleSignIn);

  // Initialize game
  game = new HigherLowerGame();
  
  // Initialize effects
  backgroundEffect = new BackgroundEffect();
  cardEffect = new CardEffect();
  
  // Apply crypto styling
  applyCryptoStyling();
  
  // Add event listeners
  setupEventListeners();
}

// Handle sign in status
function handleSignIn(accountId) {
  if (accountId) {
    signedInUI(accountId);
  } else {
    signedOutUI();
  }
}

// UI: Display the signed-out container
function signedOutUI() {
  document.querySelector('#sign-in-button').classList.remove('d-none');
  document.querySelector('#sign-out-button').classList.add('d-none');
  document.querySelector('#welcome-screen').classList.remove('d-none');
  document.querySelector('#game-screen').classList.add('d-none');
}

// UI: Displaying the signed in flow container and fill in account-specific data
function signedInUI(signedAccount) {
  document.querySelector('#welcome-screen').classList.add('d-none');
  document.querySelector('#game-screen').classList.remove('d-none');
  document.querySelector('#sign-in-button').classList.add('d-none');
  document.querySelector('#sign-out-button').classList.remove('d-none');
  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = signedAccount;
  });
}

// Apply crypto styling to page
function applyCryptoStyling() {
  // Add dark background
  document.body.style.backgroundColor = '#0a0a1a';
  document.body.style.color = 'white';
  
  // Style navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.backgroundColor = 'rgba(26, 32, 53, 0.8)';
    navbar.style.backdropFilter = 'blur(10px)';
    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    navbar.style.position = 'sticky';
    navbar.style.top = '0';
    navbar.style.zIndex = '1000';
    navbar.style.marginBottom = '20px';
  }
  
  // Style buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.style.backgroundColor = '#5dabfc';
    btn.style.borderColor = '#5dabfc';
    btn.style.boxShadow = '0 4px 6px rgba(93, 171, 252, 0.2)';
    btn.style.fontWeight = 'bold';
  });
  
  document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.style.backgroundColor = '#2d3748';
    btn.style.borderColor = '#2d3748';
    btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  });
  
  document.querySelectorAll('.btn-success').forEach(btn => {
    btn.style.backgroundColor = '#10b981';
    btn.style.borderColor = '#10b981';
    btn.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)';
    btn.style.fontWeight = 'bold';
    btn.style.letterSpacing = '0.5px';
  });
  
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.style.backgroundColor = '#ef4444';
    btn.style.borderColor = '#ef4444';
    btn.style.boxShadow = '0 4px 6px rgba(239, 68, 68, 0.2)';
    btn.style.fontWeight = 'bold';
    btn.style.letterSpacing = '0.5px';
  });
  
  // Add hover effects to all buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.filter = 'brightness(1.1)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.filter = 'brightness(1)';
    });
    
    btn.style.transition = 'all 0.3s ease';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    
    // Add ripple effect to buttons
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      btn.appendChild(ripple);
      
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size * 2}px`;
      ripple.style.position = 'absolute';
      ripple.style.top = `${e.clientY - rect.top - size}px`;
      ripple.style.left = `${e.clientX - rect.left - size}px`;
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add a style tag for keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes glow {
      0% { filter: drop-shadow(0 0 5px rgba(93, 171, 252, 0.6)); }
      50% { filter: drop-shadow(0 0 15px rgba(93, 171, 252, 0.8)); }
      100% { filter: drop-shadow(0 0 5px rgba(93, 171, 252, 0.6)); }
    }
  `;
  document.head.appendChild(style);
  
  // Style welcome screen
  const welcomeScreen = document.querySelector('#welcome-screen');
  if (welcomeScreen) {
    welcomeScreen.style.background = 'linear-gradient(135deg, rgba(26, 32, 53, 0.8) 0%, rgba(20, 30, 48, 0.8) 100%)';
    welcomeScreen.style.backdropFilter = 'blur(10px)';
    welcomeScreen.style.borderRadius = '12px';
    welcomeScreen.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    welcomeScreen.style.padding = '40px 20px';
    welcomeScreen.style.marginTop = '50px';
    
    // Add NEAR logo with animation
    const logoContainer = document.createElement('div');
    logoContainer.style.marginBottom = '30px';
    logoContainer.style.animation = 'float 4s ease-in-out infinite, glow 2s ease-in-out infinite';
    
    const logo = document.createElement('div');
    logo.textContent = 'Ⓝ';
    logo.style.fontSize = '80px';
    logo.style.color = '#5dabfc';
    
    logoContainer.appendChild(logo);
    welcomeScreen.prepend(logoContainer);
  }
  
  // Style game screen header
  const gameScreenHeader = document.querySelector('#game-screen h1');
  if (gameScreenHeader) {
    gameScreenHeader.style.fontSize = '3rem';
    gameScreenHeader.style.background = 'linear-gradient(to right, #5dabfc, #10b981)';
    gameScreenHeader.style.WebkitBackgroundClip = 'text';
    gameScreenHeader.style.WebkitTextFillColor = 'transparent';
    gameScreenHeader.style.fontWeight = 'bold';
    gameScreenHeader.style.marginBottom = '30px';
  }
  
  // Style game over screen
  const gameOver = document.querySelector('#game-over');
  if (gameOver) {
    gameOver.style.background = 'linear-gradient(135deg, rgba(26, 32, 53, 0.9) 0%, rgba(20, 30, 48, 0.9) 100%)';
    gameOver.style.backdropFilter = 'blur(10px)';
    gameOver.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    gameOver.style.borderRadius = '12px';
  }
  
  // Style score display
  const scoreDisplay = document.querySelector('#score-display');
  if (scoreDisplay) {
    scoreDisplay.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(93, 171, 252, 0.3)';
    scoreDisplay.style.minWidth = '300px';
  }
  
  // Make scores more visible
  const scores = document.querySelectorAll('#score, #best-score, #final-score');
  scores.forEach(score => {
    score.style.color = '#5dabfc';
    score.style.fontWeight = 'bold';
    score.style.textShadow = '0 0 10px rgba(93, 171, 252, 0.5)';
  });
  
  // Enhance card visibility
  const termCards = document.querySelectorAll('.term-card');
  termCards.forEach(card => {
    card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(93, 171, 252, 0.2)';
    card.style.border = '2px solid rgba(93, 171, 252, 0.3)';
  });
}

// Start the application
init();

function updateUI() {
  // Update the current game state
  document.querySelector('#term1').innerText = game.currentTerm1;
  document.querySelector('#term2').innerText = game.currentTerm2;
  document.querySelector('#searches1').innerText = formatNumber(game.currentSearches1);
  
  if (game.isRoundComplete) {
    document.querySelector('#searches2').innerText = formatNumber(game.currentSearches2);
    document.querySelector('#searches2').classList.remove('searches-hidden');
    
    // Set card styling based on correct/incorrect guess
    const card2 = document.querySelector('#searches2').closest('.term-card');
    if (game.lastGuessCorrect) {
      card2.classList.add('correct-guess');
      card2.classList.remove('wrong-guess');
    } else {
      card2.classList.add('wrong-guess');
      card2.classList.remove('correct-guess');
    }
    
    // If game over, show game over screen
    if (game.isGameOver) {
      setTimeout(() => {
        document.querySelector('#game-area').classList.add('d-none');
        document.querySelector('#game-over').classList.remove('d-none');
        document.querySelector('#final-score').innerText = game.score;
        
        const messageElement = document.querySelector('#game-result-message');
        if (game.score >= 10) {
          messageElement.innerText = `Congratulations! You won ${formatNumber(calculateWinnings(game.score, game.betAmount))} NEAR!`;
          messageElement.classList.add('win-message');
          messageElement.classList.remove('lose-message');
          
          // Add particle celebration
          createWinCelebration();
          
          // Send the reward to the player
          try {
            sendWinnings(game.score, game.betAmount);
          } catch (error) {
            console.error("Error sending winnings:", error);
          }
          
          // Try to update best score if needed
          if (game.score > game.bestScore) {
            try {
              wallet.callMethod({ 
                contractId: 'guest-book.testnet', 
                method: 'setBestScore', 
                args: { score: game.score }
              });
            } catch (error) {
              console.log("Could not update best score, probably not implemented in contract");
            }
          }
        } else {
          messageElement.innerText = `You need at least 10 points to win. You lost ${game.betAmount} NEAR.`;
          messageElement.classList.add('lose-message');
          messageElement.classList.remove('win-message');
        }
      }, 1500);
    } else {
      // Prepare for next round after a delay
      setTimeout(() => {
        game.nextRound();
        document.querySelector('#searches2').classList.add('searches-hidden');
        document.querySelector('#searches2').innerText = '?';
        const card2 = document.querySelector('#searches2').closest('.term-card');
        card2.classList.remove('correct-guess', 'wrong-guess');
        updateUI();
        
        // Update card effects for new cards
        if (cardEffect) cardEffect.updateCards();
      }, 1500);
    }
  } else {
    document.querySelector('#searches2').innerText = '?';
    document.querySelector('#searches2').classList.add('searches-hidden');
  }
  
  // Update score
  document.querySelector('#score').innerText = game.score;
  document.querySelector('#best-score').innerText = Math.max(game.score, game.bestScore);
}

function createWinCelebration() {
  // Create confetti effect
  const colors = ['#5dabfc', '#10b981', '#f1c40f', '#9b59b6', '#3498db'];
  const numConfetti = 100;
  
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '9999';
  
  document.body.appendChild(confettiContainer);
  
  for (let i = 0; i < numConfetti; i++) {
    const confetti = document.createElement('div');
    
    // Random confetti properties
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? 'circle' : 'rect';
    
    // Positioning
    confetti.style.position = 'absolute';
    confetti.style.top = '0';
    confetti.style.left = `${Math.random() * 100}%`;
    
    if (shape === 'circle') {
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.borderRadius = '50%';
    } else {
      confetti.style.width = `${size * 0.8}px`;
      confetti.style.height = `${size * 1.5}px`;
      confetti.style.borderRadius = '2px';
    }
    
    confetti.style.backgroundColor = color;
    confetti.style.opacity = Math.random() * 0.5 + 0.5;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Animation
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    confetti.style.animation = `
      fall ${duration}s ease-in ${delay}s forwards,
      sway ${duration / 2}s ease-in-out ${delay}s infinite alternate
    `;
    
    confettiContainer.appendChild(confetti);
  }
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall {
      0% { transform: translateY(0) rotate(0); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    @keyframes sway {
      0% { transform: translateX(-10px) rotate(-10deg); }
      100% { transform: translateX(10px) rotate(10deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Remove container after animation
  setTimeout(() => {
    confettiContainer.remove();
  }, 6000);
}

function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

function calculateWinnings(score, betAmount) {
  // Base multiplier starts at 1x
  let multiplier = 1;
  
  // For scores of 10 or more, increase the multiplier
  if (score >= 10) {
    multiplier = 2;  // 2x for 10 points
    
    // Add 0.5x for each point above 10
    if (score > 10) {
      multiplier += (score - 10) * 0.5;
    }
  }
  
  return betAmount * multiplier;
}

async function sendWinnings(score, betAmount) {
  const winnings = calculateWinnings(score, betAmount);
  
  try {
    // Try to send the winnings to the user
    // In a real app, this would be handled by a smart contract
    console.log(`Sending ${winnings} NEAR to ${wallet.accountId}`);
    
    // Simulate sending winnings (in a real app, this would use a smart contract)
    // This is just a simulation since we don't have a real contract set up
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      amount: winnings
    };
  } catch (error) {
    console.error('Error sending winnings:', error);
    return {
      success: false,
      error: 'Failed to send winnings. Please try again.'
    };
  }
}

// Set up all event listeners
async function setupEventListeners() {
  // Try to load best score from contract
  try {
    const bestScore = await wallet.viewMethod({ 
      contractId: 'guest-book.testnet', 
      method: 'getBestScore',
      args: { account_id: wallet.accountId } 
    });
    
    if (bestScore) {
      document.querySelector('#best-score').innerText = bestScore;
      game.bestScore = bestScore;
    }
  } catch (error) {
    console.log("Could not load best score, probably not implemented in contract");
  }

  // Start game button
  document.querySelector('#start-game').addEventListener('click', async () => {
    const betAmount = document.querySelector('#bet-amount').value;
    
    if (betAmount < 1) {
      alert('Please bet at least 1 NEAR');
      return;
    }
    
    game.betAmount = betAmount;
    document.querySelector('#bet-form').classList.add('d-none');
    document.querySelector('#game-area').classList.remove('d-none');
    
    // Start the game
    game.startGame();
    updateUI();
    
    // Update card effects when cards are shown
    setTimeout(() => {
      if (cardEffect) cardEffect.updateCards();
    }, 100);
  });

  // Higher button
  document.querySelector('#higher-btn').addEventListener('click', () => {
    if (game.isRoundComplete) return;
    
    game.makeGuess('higher');
    updateUI();
    
    // Trigger background effect
    if (backgroundEffect) {
      backgroundEffect.triggerEffect(game.lastGuessCorrect);
    }
    
    // Trigger card effect
    if (cardEffect) {
      const rightCard = document.querySelector('#searches2').closest('.term-card');
      cardEffect.revealCard(rightCard, game.lastGuessCorrect);
    }
  });

  // Lower button
  document.querySelector('#lower-btn').addEventListener('click', () => {
    if (game.isRoundComplete) return;
    
    game.makeGuess('lower');
    updateUI();
    
    // Trigger background effect
    if (backgroundEffect) {
      backgroundEffect.triggerEffect(game.lastGuessCorrect);
    }
    
    // Trigger card effect
    if (cardEffect) {
      const rightCard = document.querySelector('#searches2').closest('.term-card');
      cardEffect.revealCard(rightCard, game.lastGuessCorrect);
    }
  });

  // Play again button
  document.querySelector('#play-again').addEventListener('click', () => {
    document.querySelector('#game-over').classList.add('d-none');
    document.querySelector('#bet-form').classList.remove('d-none');
    document.querySelector('#game-area').classList.add('d-none');
  });
}
