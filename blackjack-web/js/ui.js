/**
 * Blackjack UI Helper Functions
 * Handles all UI updates and manipulation
 */

// Toggle visibility of betting UI
function toggleBettingUI(show) {
    const bettingUI = document.getElementById('betting-ui');
    if (show) {
        bettingUI.classList.remove('hidden');
    } else {
        bettingUI.classList.add('hidden');
    }
}

// Toggle visibility of game UI
function toggleGameUI(show) {
    const gameUI = document.getElementById('game-ui');
    if (show) {
        gameUI.classList.remove('hidden');
    } else {
        gameUI.classList.add('hidden');
    }
}

// Toggle split UI visibility
function toggleSplitUI(show) {
    const singleHandArea = document.getElementById('player-single-hand');
    const splitHandsArea = document.getElementById('player-split-hands');
    
    if (show) {
        singleHandArea.classList.add('hidden');
        splitHandsArea.classList.remove('hidden');
    } else {
        singleHandArea.classList.remove('hidden');
        splitHandsArea.classList.add('hidden');
    }
}

// Toggle hand highlight for split hands
function toggleHandHighlight(handIndex, highlight) {
    const handElement = handIndex === 0 
        ? document.querySelector('#player-split-hands .hand-1')
        : document.querySelector('#player-split-hands .hand-2');
    
    if (highlight) {
        handElement.classList.add('hand-highlight');
    } else {
        handElement.classList.remove('hand-highlight');
    }
}

// Update bet display in slider UI
function updateBetDisplay(betAmount) {
    document.getElementById('bet-amount').textContent = `Bet: ${betAmount}`;
}

// Update player bet display in game UI
function updatePlayerBet(betAmount) {
    document.getElementById('player-bet').textContent = `Bet: ${betAmount}`;
}

// Update player bet display for split hands
function updatePlayerBetSplit(betAmount, handIndex) {
    const betElement = handIndex === 0 
        ? document.getElementById('player-bet-1')
        : document.getElementById('player-bet-2');
    
    betElement.textContent = `Bet: ${betAmount}`;
}

// Update balance display
function updateBalanceDisplay(balance) {
    document.getElementById('balance').textContent = `Balance: ${balance}`;
}

// Update dealer score display
function updateDealerScore(score, blackjack = false, bust = false) {
    const dealerScoreElement = document.getElementById('dealer-score');
    
    if (blackjack) {
        dealerScoreElement.textContent = `Dealer: ${score} - Blackjack`;
    } else if (bust) {
        dealerScoreElement.textContent = `Dealer: ${score} - Bust`;
    } else {
        dealerScoreElement.textContent = `Dealer: ${score}`;
    }
}

// Update player score display
function updatePlayerScore(score, blackjack = false, bust = false) {
    const playerScoreElement = document.getElementById('player-score');
    
    if (blackjack) {
        playerScoreElement.textContent = `Player: ${score} - Blackjack`;
    } else if (bust) {
        playerScoreElement.textContent = `Player: ${score} - Bust`;
    } else {
        playerScoreElement.textContent = `Player: ${score}`;
    }
}

// Update player score for split hands
function updatePlayerScoreSplit(score, handIndex, blackjack = false, bust = false) {
    const scoreElement = handIndex === 0 
        ? document.getElementById('player-score-1')
        : document.getElementById('player-score-2');
    
    if (blackjack) {
        scoreElement.textContent = `Player: ${score} - Blackjack`;
    } else if (bust) {
        scoreElement.textContent = `Player: ${score} - Bust`;
    } else {
        scoreElement.textContent = `Player: ${score}`;
    }
}

// Display winner for single hand
function displayWinner(result) {
    const winnerElement = document.getElementById('winner-announcement');
    winnerElement.textContent = result;
    winnerElement.classList.remove('hidden');
    
    // Set background color based on result
    if (result === 'Dealer Wins.') {
        winnerElement.classList.add('dealer-wins');
    } else if (result === 'Push.') {
        winnerElement.classList.add('push');
    } else {
        // Player wins or surrender
        winnerElement.classList.remove('dealer-wins', 'push');
    }
}

// Display winners for split hands
function displayWinnerSplit(result, handIndex) {
    const winnerElement = handIndex === 0 
        ? document.getElementById('winner-1')
        : document.getElementById('winner-2');
    
    winnerElement.textContent = result;
    winnerElement.classList.remove('hidden');
    
    // Set background color based on result
    if (result === 'Dealer Wins.') {
        winnerElement.classList.add('dealer-wins');
    } else if (result === 'Push.') {
        winnerElement.classList.add('push');
    } else {
        // Player wins or surrender
        winnerElement.classList.remove('dealer-wins', 'push');
    }
}

// Clear winner displays
function clearWinners() {
    const winnerElement = document.getElementById('winner-announcement');
    winnerElement.textContent = '';
    winnerElement.classList.add('hidden');
    winnerElement.classList.remove('dealer-wins', 'push');
    
    const winner1Element = document.getElementById('winner-1');
    winner1Element.textContent = '';
    winner1Element.classList.add('hidden');
    winner1Element.classList.remove('dealer-wins', 'push');
    
    const winner2Element = document.getElementById('winner-2');
    winner2Element.textContent = '';
    winner2Element.classList.add('hidden');
    winner2Element.classList.remove('dealer-wins', 'push');
}

// Reset all score displays
function resetScores() {
    document.getElementById('dealer-score').textContent = 'Dealer: ';
    document.getElementById('player-score').textContent = 'Player: ';
    document.getElementById('player-score-1').textContent = 'Player: ';
    document.getElementById('player-score-2').textContent = 'Player: ';
}

// Display dealer card
function displayDealerCard(card, faceDown = false) {
    const dealerCardsElement = document.getElementById('dealer-cards');
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    if (faceDown) {
        // Show card back
        cardElement.classList.add('card-back');
        cardElement.style.backgroundImage = `url('assets/images/card_faces/red_back.png')`;
        cardElement.style.backgroundSize = 'contain';
        cardElement.style.backgroundRepeat = 'no-repeat';
        cardElement.style.width = '80px';
        cardElement.style.height = '116px';
    } else {
        // Show card face
        cardElement.style.backgroundImage = `url('${card.imgPath}')`;
        cardElement.style.backgroundSize = 'contain';
        cardElement.style.backgroundRepeat = 'no-repeat';
        cardElement.style.width = '80px';
        cardElement.style.height = '116px';
    }
    
    dealerCardsElement.appendChild(cardElement);
}

// Display player card (single hand)
function displayPlayerCard(card) {
    const playerCardsElement = document.getElementById('player-cards');
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    cardElement.style.backgroundImage = `url('${card.imgPath}')`;
    cardElement.style.backgroundSize = 'contain';
    cardElement.style.backgroundRepeat = 'no-repeat';
    cardElement.style.width = '80px';
    cardElement.style.height = '116px';
    
    playerCardsElement.appendChild(cardElement);
}

// Display player card for split hands
function displayPlayerCardSplit(card, handIndex) {
    const playerCardsElement = handIndex === 0 
        ? document.getElementById('player-cards-1')
        : document.getElementById('player-cards-2');
    
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    cardElement.style.backgroundImage = `url('${card.imgPath}')`;
    cardElement.style.backgroundSize = 'contain';
    cardElement.style.backgroundRepeat = 'no-repeat';
    cardElement.style.width = '80px';
    cardElement.style.height = '116px';
    
    playerCardsElement.appendChild(cardElement);
}

// Clear all card displays
function clearCards() {
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('player-cards-1').innerHTML = '';
    document.getElementById('player-cards-2').innerHTML = '';
}

// Enable button
function enableButton(buttonId) {
    document.getElementById(buttonId).disabled = false;
}

// Disable button
function disableButton(buttonId) {
    document.getElementById(buttonId).disabled = true;
}