/**
 * Blackjack Game - Main game logic
 * 
 * This file contains the core game logic for the Blackjack card game.
 * It handles all gameplay mechanics including dealing, betting, player actions,
 * hand evaluation, and game state management.
 * 
 * Game rules implemented:
 * - Standard blackjack rules with dealer standing on 17
 * - Blackjack pays 3:2
 * - Player can hit, stand, double down, split pairs, and surrender
 * - Split aces receive only one additional card each
 * - Player can double after splitting
 * 
 * @author Abernaughty
 * @version 1.0.0
 */

class Blackjack {
    constructor() {
        // Card values
        this.cardValues = {
            'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
            '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10
        };

        // Game state
        this.balance = 100;
        this.previousBet = 5;
        this.bet1 = 0;
        this.bet2 = 0;
        this.dealer = [];
        this.player = [];
        this.playing = false;
        this.split = false;
        this.activeHand = 0;
        this.dealerMaskVal = 0;
        this.dealerVal = 0;
        this.hand1Val = 0;
        this.hand2Val = 0;
        this.hand1Win = '';
        this.hand2Win = '';
        this.hand1Bust = false;
        this.hand2Bust = false;
        this.hand1Surrender = false;
        this.hand2Surrender = false;
        this.dealerBust = false;
        this.hand1Blackjack = false;
        this.hand2Blackjack = false;
        this.dealerBlackjack = false;
        this.turn = null;
        this.masked = true;
        this.handOver = false;
        this.deck = [];

        // Load saved game state if exists
        this.loadGameState();
        
        // Initialize the deck
        this.createDeck();
        this.shuffle();
        
        // Setup UI event listeners
        this.setupEventListeners();
    }

    loadGameState() {
        // Load balance and previous bet from localStorage
        const savedBalance = localStorage.getItem('blackjack_balance');
        const savedPreviousBet = localStorage.getItem('blackjack_previous_bet');
        
        if (savedBalance) {
            this.balance = parseInt(savedBalance);
        }
        
        if (savedPreviousBet) {
            this.previousBet = parseInt(savedPreviousBet);
        }
        
        // Update UI
        updateBalanceDisplay(this.balance);
        updateBetDisplay(this.previousBet);
    }

    saveGameState() {
        // Save balance and previous bet to localStorage
        localStorage.setItem('blackjack_balance', this.balance);
        localStorage.setItem('blackjack_previous_bet', this.previousBet);
    }

    setupEventListeners() {
        // Betting UI
        document.getElementById('bet-slider').addEventListener('input', (e) => {
            updateBetDisplay(parseInt(e.target.value));
        });
        
        document.getElementById('place-bet-btn').addEventListener('click', () => {
            this.placeBet();
        });
        
        // Game action buttons
        document.getElementById('hit-btn').addEventListener('click', () => {
            this.playerHit();
        });
        
        document.getElementById('stand-btn').addEventListener('click', () => {
            this.stand();
        });
        
        document.getElementById('double-btn').addEventListener('click', () => {
            this.double();
        });
        
        document.getElementById('split-btn').addEventListener('click', () => {
            this.splitHand();
        });
        
        document.getElementById('surrender-btn').addEventListener('click', () => {
            this.surrender();
        });
    }

    initializeGame() {
        // Reset game state
        this.reset();
        
        // Show betting UI, hide game UI
        toggleBettingUI(true);
        toggleGameUI(false);
        
        // Update bet slider max to balance
        const betSlider = document.getElementById('bet-slider');
        betSlider.max = this.balance;
        
        // Set default bet to previous bet or balance (whichever is smaller)
        const defaultBet = Math.min(this.previousBet, this.balance);
        betSlider.value = defaultBet;
        updateBetDisplay(defaultBet);
        
        // Update balance display
        updateBalanceDisplay(this.balance);
    }

    createDeck() {
        this.deck = [];
        const suits = ['C', 'S', 'H', 'D'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (const suit of suits) {
            for (const value of values) {
                this.deck.push({
                    value: value,
                    suit: suit,
                    imgPath: `assets/images/card_faces/${value}${suit}.png`
                });
            }
        }
    }

    shuffle() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    placeBet() {
        // Get bet from slider
        const betSlider = document.getElementById('bet-slider');
        this.bet1 = parseInt(betSlider.value);
        this.previousBet = this.bet1;
        
        // Update balance
        this.balance -= this.bet1;
        
        // Update displays
        updateBalanceDisplay(this.balance);
        updatePlayerBet(this.bet1);
        
        // Start the game
        this.playing = true;
        this.turn = 'Player';
        
        // Show game UI, hide betting UI
        toggleBettingUI(false);
        toggleGameUI(true);
        
        // Save game state
        this.saveGameState();
        
        // Deal initial cards
        this.deal();
    }

    deal() {
        // Clear any existing cards
        clearCards();
        
        // Deal 2 cards to player and dealer
        for (let i = 0; i < 2; i++) {
            // Deal to dealer
            const dealerCard = this.deck.pop();
            this.dealer.push(dealerCard);
            
            // For the second dealer card, show the back
            if (i === 1) {
                displayDealerCard(dealerCard, true);
            } else {
                displayDealerCard(dealerCard, false);
            }
            
            // Deal to player
            const playerCard = this.deck.pop();
            this.player.push(playerCard);
            displayPlayerCard(playerCard);
        }
        
        // Calculate hand values
        this.getHandValues();
        
        // Check for blackjack or if player can split
        this.checkForWinner();
        
        // Enable/disable action buttons
        this.updateActionButtons();
        
        // If player has blackjack, send action to dealer after delay
        if (this.handOver) {
            setTimeout(() => this.playDealer(), 1000);
        }
    }

    playerHit() {
        // Disable double and split after first hit
        if (!this.split && this.player.length > 2) {
            disableButton('double-btn');
            disableButton('split-btn');
        } else if (this.split && this.player[this.activeHand].length > 2) {
            disableButton('double-btn');
        }
        
        // Deal a card to the active hand
        const playerCard = this.deck.pop();
        
        if (this.split) {
            // Add to the appropriate split hand
            this.player[this.activeHand].push(playerCard);
            displayPlayerCardSplit(playerCard, this.activeHand);
        } else {
            // Add to the single hand
            this.player.push(playerCard);
            displayPlayerCard(playerCard);
        }
        
        // Recalculate hand values
        this.getHandValues();
        
        // Check for bust or 21
        this.checkForWinner();
        
        // If player turn is over, disable action buttons and let dealer play
        if (this.turn === 'Dealer') {
            this.disableButtons();
            setTimeout(() => this.playDealer(), 1000);
        }
    }

    stand() {
        if (this.split && this.activeHand === 0) {
            // Move to second hand
            this.activeHand = 1;
            toggleHandHighlight(0, false);
            toggleHandHighlight(1, true);
            enableButton('double-btn');
            
            // Auto-hit the second hand if it has only one card (from split)
            if (this.player[1].length === 1) {
                setTimeout(() => this.playerHit(), 500);
            }
        } else {
            // End player turn
            if (this.split) {
                toggleHandHighlight(1, false);
            }
            this.disableButtons();
            this.turn = 'Dealer';
            setTimeout(() => this.playDealer(), 1000);
        }
    }

    double() {
        // Disable double and split buttons
        disableButton('double-btn');
        disableButton('split-btn');
        
        if (this.activeHand === 0) {
            // Double bet for first hand
            this.balance -= this.bet1;
            this.bet1 *= 2;
            updateBalanceDisplay(this.balance);
            
            if (this.split) {
                updatePlayerBetSplit(this.bet1, 0);
                this.playerHit();
                
                // Move to second hand
                this.activeHand = 1;
                toggleHandHighlight(0, false);
                toggleHandHighlight(1, true);
                enableButton('double-btn');
                
                if (this.player[1].length === 1) {
                    setTimeout(() => this.playerHit(), 500);
                }
            } else {
                updatePlayerBet(this.bet1);
                this.playerHit();
                this.turn = 'Dealer';
                setTimeout(() => this.playDealer(), 1000);
            }
        } else {
            // Double bet for second hand
            this.balance -= this.bet2;
            this.bet2 *= 2;
            updateBalanceDisplay(this.balance);
            updatePlayerBetSplit(this.bet2, 1);
            
            this.playerHit();
            this.turn = 'Dealer';
            this.disableButtons();
            setTimeout(() => this.playDealer(), 1000);
        }
        
        // Save game state
        this.saveGameState();
    }

    canSplit() {
        // Already split
        if (this.split) {
            return false;
        }
        
        // Already hit
        if (!this.split && this.player.length > 2) {
            return false;
        }
        
        // Check if first two cards are the same value
        const card1 = this.cardValues[this.player[0].value];
        const card2 = this.cardValues[this.player[1].value];
        
        return card1 === card2 && this.balance >= this.bet1;
    }

    splitHand() {
        // Disable split button
        disableButton('split-btn');
        
        // Switch to split UI
        toggleSplitUI(true);
        
        if (!this.split) {
            // Mark as split
            this.split = true;
            
            // Create two separate hands from the current hand
            const hand1 = [this.player[0]];
            const hand2 = [this.player[1]];
            this.player = [hand1, hand2];
            
            // Set up second bet
            this.bet2 = this.bet1;
            this.balance -= this.bet2;
            
            // Update displays
            updateBalanceDisplay(this.balance);
            updatePlayerBetSplit(this.bet1, 0);
            updatePlayerBetSplit(this.bet1, 1);
            
            // Display cards in split view
            clearCards();
            displayDealerCard(this.dealer[0], false);
            displayDealerCard(this.dealer[1], true);
            displayPlayerCardSplit(this.player[0][0], 0);
            displayPlayerCardSplit(this.player[1][0], 1);
            
            // Highlight first hand
            toggleHandHighlight(0, true);
            
            // Calculate hand values
            this.getHandValues();
            
            // Deal an additional card to the first hand
            setTimeout(() => {
                const playerCard = this.deck.pop();
                this.player[0].push(playerCard);
                displayPlayerCardSplit(playerCard, 0);
                this.getHandValues();
                this.checkForWinner();
            }, 500);
        }
        
        // Save game state
        this.saveGameState();
    }

    surrender() {
        if (this.activeHand === 0 && this.split) {
            // Surrender first hand
            this.hand1Surrender = true;
            
            // Move to second hand
            this.activeHand = 1;
            toggleHandHighlight(0, false);
            toggleHandHighlight(1, true);
            
            if (this.player[1].length === 1) {
                setTimeout(() => this.playerHit(), 500);
            }
        } else {
            // Surrender second hand or single hand
            if (this.split) {
                this.hand2Surrender = true;
                toggleHandHighlight(1, false);
            } else {
                this.hand1Surrender = true;
            }
            
            this.disableButtons();
            this.handOver = true;
            this.turn = 'Dealer';
            
            setTimeout(() => this.playDealer(), 1000);
        }
    }

    dealerHit() {
        // Deal a card to the dealer
        const dealerCard = this.deck.pop();
        this.dealer.push(dealerCard);
        
        // Display the card
        displayDealerCard(dealerCard, false);
        
        // Recalculate hand values
        this.getHandValues();
    }

    playDealer() {
        // Check for winner
        this.checkForWinner();
        
        // If game is over
        if (this.handOver) {
            // Show dealer's hidden card
            if (this.masked) {
                this.unmask();
            }
            
            // Display winners
            if (this.split) {
                displayWinnerSplit(this.hand1Win, 0);
                displayWinnerSplit(this.hand2Win, 1);
            } else {
                displayWinner(this.hand1Win);
            }
            
            // Resolve bets
            this.resolveBets();
            
            // Start a new hand after delay
            setTimeout(() => this.initializeGame(), 2000);
        } else {
            // Show dealer's hidden card if still masked
            if (this.masked) {
                this.unmask();
            }
            
            // Dealer hits until 17 or higher
            if (this.dealerVal < 17) {
                this.dealerHit();
                setTimeout(() => this.playDealer(), 1000);
            } else {
                // Dealer stands, determine winners
                this.determineWinners();
                this.handOver = true;
                setTimeout(() => this.playDealer(), 500);
            }
        }
    }

    unmask() {
        // Show dealer's second card
        const dealerCardContainer = document.getElementById('dealer-cards');
        const maskedCard = dealerCardContainer.querySelector('.card-back');
        if (maskedCard) {
            dealerCardContainer.removeChild(maskedCard);
            displayDealerCard(this.dealer[1], false);
        }
        
        // Update dealer score display
        this.masked = false;
        updateDealerScore(this.dealerVal);
    }

    getHandValues() {
        // Calculate dealer hand value
        let dealerVal = 0;
        let aceCount = 0;
        
        for (const card of this.dealer) {
            const value = this.cardValues[card.value];
            if (card.value === 'A') {
                aceCount++;
            }
            dealerVal += value;
        }
        
        // Adjust for aces (can be 1 or 11)
        for (let i = 0; i < aceCount; i++) {
            if (dealerVal + 10 <= 21) {
                dealerVal += 10;
            }
        }
        
        this.dealerVal = dealerVal;
        
        // If it's player's turn, only show the value of dealer's first card
        if (this.turn === 'Player') {
            this.dealerMaskVal = this.cardValues[this.dealer[0].value];
            if (this.dealer[0].value === 'A') {
                this.dealerMaskVal = 11;
            }
            updateDealerScore(this.dealerMaskVal);
        } else if (this.turn === 'Dealer') {
            updateDealerScore(this.dealerVal);
        }
        
        // Calculate player hand value(s)
        if (this.split) {
            // Calculate hand 1 value
            let hand1Val = 0;
            let aceCount1 = 0;
            
            for (const card of this.player[0]) {
                const value = this.cardValues[card.value];
                if (card.value === 'A') {
                    aceCount1++;
                }
                hand1Val += value;
            }
            
            // Adjust for aces
            for (let i = 0; i < aceCount1; i++) {
                if (hand1Val + 10 <= 21) {
                    hand1Val += 10;
                }
            }
            
            // Calculate hand 2 value
            let hand2Val = 0;
            let aceCount2 = 0;
            
            for (const card of this.player[1]) {
                const value = this.cardValues[card.value];
                if (card.value === 'A') {
                    aceCount2++;
                }
                hand2Val += value;
            }
            
            // Adjust for aces
            for (let i = 0; i < aceCount2; i++) {
                if (hand2Val + 10 <= 21) {
                    hand2Val += 10;
                }
            }
            
            this.hand1Val = hand1Val;
            this.hand2Val = hand2Val;
            
            // Update score displays
            updatePlayerScoreSplit(this.hand1Val, 0);
            updatePlayerScoreSplit(this.hand2Val, 1);
        } else {
            // Calculate single hand value
            let handVal = 0;
            let aceCount = 0;
            
            for (const card of this.player) {
                const value = this.cardValues[card.value];
                if (card.value === 'A') {
                    aceCount++;
                }
                handVal += value;
            }
            
            // Adjust for aces
            for (let i = 0; i < aceCount; i++) {
                if (handVal + 10 <= 21) {
                    handVal += 10;
                }
            }
            
            this.hand1Val = handVal;
            
            // Update score display
            updatePlayerScore(this.hand1Val);
        }
    }

    checkForWinner() {
        if (this.turn === 'Player') {
            // Check for blackjack on hand 1
            if (this.hand1Val === 21) {
                if (this.split) {
                    if (this.player[0].length === 2) {
                        this.hand1Blackjack = true;
                        updatePlayerScoreSplit(this.hand1Val, 0, true);
                    }
                    
                    // Move to hand 2 if still on hand 1
                    if (this.activeHand === 0) {
                        this.activeHand = 1;
                        toggleHandHighlight(0, false);
                        toggleHandHighlight(1, true);
                        enableButton('double-btn');
                        
                        // Auto-hit second hand if it has only one card
                        if (this.player[1].length === 1) {
                            setTimeout(() => this.playerHit(), 500);
                        }
                    }
                } else {
                    // Single hand blackjack
                    if (this.player.length === 2) {
                        this.hand1Blackjack = true;
                        updatePlayerScore(this.hand1Val, true);
                    }
                    this.turn = 'Dealer';
                }
            }
            
            // Check for bust on hand 1
            else if (this.hand1Val > 21) {
                this.hand1Bust = true;
                
                if (this.split) {
                    updatePlayerScoreSplit(this.hand1Val, 0, false, true);
                    
                    // Move to hand 2 if still on hand 1
                    if (this.activeHand === 0) {
                        this.activeHand = 1;
                        toggleHandHighlight(0, false);
                        toggleHandHighlight(1, true);
                        enableButton('double-btn');
                        
                        // Auto-hit second hand if it has only one card
                        if (this.player[1].length === 1) {
                            setTimeout(() => this.playerHit(), 500);
                        }
                    }
                } else {
                    // Single hand bust
                    updatePlayerScore(this.hand1Val, false, true);
                    this.hand1Win = 'Dealer Wins.';
                    this.turn = 'Dealer';
                }
            }
            
            // Check for blackjack on hand 2
            if (this.split && this.hand2Val === 21) {
                if (this.player[1].length === 2) {
                    this.hand2Blackjack = true;
                    updatePlayerScoreSplit(this.hand2Val, 1, true);
                }
                this.turn = 'Dealer';
            }
            
            // Check for bust on hand 2
            else if (this.split && this.hand2Val > 21) {
                this.hand2Bust = true;
                updatePlayerScoreSplit(this.hand2Val, 1, false, true);
                this.turn = 'Dealer';
            }
        }
        
        if (this.turn === 'Dealer') {
            // Remove hand highlights
            if (this.split) {
                toggleHandHighlight(0, false);
                toggleHandHighlight(1, false);
            }
            
            // Show dealer's hidden card
            if (this.masked) {
                this.unmask();
            }
            
            // Check for dealer blackjack
            if (this.dealerVal === 21 && this.dealer.length === 2) {
                this.dealerBlackjack = true;
                updateDealerScore(this.dealerVal, true);
                
                this.determineWinners();
                this.handOver = true;
            }
            
            // Check for dealer bust
            else if (this.dealerVal > 21) {
                this.dealerBust = true;
                updateDealerScore(this.dealerVal, false, true);
                
                this.determineWinners();
                this.handOver = true;
            }
            
            // Dealer stands at 17 or more
            else if (this.dealerVal >= 17) {
                this.determineWinners();
                this.handOver = true;
            }
        }
    }

    determineWinners() {
        // Determine winner for hand 1
        if (this.hand1Surrender) {
            this.hand1Win = 'Surrender.';
        } else if (this.dealerBlackjack && this.hand1Blackjack) {
            this.hand1Win = 'Push.';
        } else if (this.dealerBlackjack && !this.hand1Blackjack) {
            this.hand1Win = 'Dealer Wins.';
        } else if (!this.dealerBlackjack && this.hand1Blackjack) {
            this.hand1Win = 'Player Wins!';
        } else if (this.dealerBust && !this.hand1Bust) {
            this.hand1Win = 'Player Wins!';
        } else if (!this.dealerBust && this.hand1Bust) {
            this.hand1Win = 'Dealer Wins.';
        } else if (!this.hand1Bust && !this.dealerBust) {
            if (this.hand1Val > this.dealerVal) {
                this.hand1Win = 'Player Wins!';
            } else if (this.hand1Val < this.dealerVal) {
                this.hand1Win = 'Dealer Wins.';
            } else {
                this.hand1Win = 'Push.';
            }
        } else {
            // Both bust
            this.hand1Win = 'Dealer Wins.';
        }
        
        // Determine winner for hand 2 (if split)
        if (this.split) {
            if (this.hand2Surrender) {
                this.hand2Win = 'Surrender.';
            } else if (this.dealerBlackjack && this.hand2Blackjack) {
                this.hand2Win = 'Push.';
            } else if (this.dealerBlackjack && !this.hand2Blackjack) {
                this.hand2Win = 'Dealer Wins.';
            } else if (!this.dealerBlackjack && this.hand2Blackjack) {
                this.hand2Win = 'Player Wins!';
            } else if (this.dealerBust && !this.hand2Bust) {
                this.hand2Win = 'Player Wins!';
            } else if (!this.dealerBust && this.hand2Bust) {
                this.hand2Win = 'Dealer Wins.';
            } else if (!this.hand2Bust && !this.dealerBust) {
                if (this.hand2Val > this.dealerVal) {
                    this.hand2Win = 'Player Wins!';
                } else if (this.hand2Val < this.dealerVal) {
                    this.hand2Win = 'Dealer Wins.';
                } else {
                    this.hand2Win = 'Push.';
                }
            } else {
                // Both bust
                this.hand2Win = 'Dealer Wins.';
            }
        }
    }

    resolveBets() {
        // Resolve hand 1 bet
        if (this.hand1Win === 'Player Wins!') {
            if (this.hand1Blackjack) {
                // Blackjack pays 3:2
                this.balance += Math.floor(this.bet1 * 2.5);
            } else {
                // Regular win pays 1:1
                this.balance += this.bet1 * 2;
            }
        } else if (this.hand1Win === 'Push.') {
            // Return bet
            this.balance += this.bet1;
        } else if (this.hand1Win === 'Surrender.') {
            // Return half of bet
            this.balance += Math.floor(this.bet1 / 2);
        }
        
        // Resolve hand 2 bet (if split)
        if (this.split) {
            if (this.hand2Win === 'Player Wins!') {
                if (this.hand2Blackjack) {
                    // Blackjack pays 3:2
                    this.balance += Math.floor(this.bet2 * 2.5);
                } else {
                    // Regular win pays 1:1
                    this.balance += this.bet2 * 2;
                }
            } else if (this.hand2Win === 'Push.') {
                // Return bet
                this.balance += this.bet2;
            } else if (this.hand2Win === 'Surrender.') {
                // Return half of bet
                this.balance += Math.floor(this.bet2 / 2);
            }
        }
        
        // Check if player needs a loan
        if (this.balance < 5) {
            this.getLoan();
        }
        
        // Update balance display
        updateBalanceDisplay(this.balance);
        
        // Update bet slider maximum to new balance
        const betSlider = document.getElementById('bet-slider');
        betSlider.max = this.balance;
        
        // Save game state
        this.saveGameState();
    }

    getLoan() {
        // Give player a loan of 100 chips
        this.balance = 100;
    }

    updateActionButtons() {
        // Enable/disable split button
        if (this.canSplit()) {
            enableButton('split-btn');
        } else {
            disableButton('split-btn');
        }
        
        // Enable/disable double button
        if (this.canDouble()) {
            enableButton('double-btn');
        } else {
            disableButton('double-btn');
        }
    }

    canDouble() {
        if (this.split) {
            // Can double if hand has 2 cards and balance >= bet
            if (this.activeHand === 0) {
                return this.player[0].length === 2 && this.balance >= this.bet1;
            } else {
                return this.player[1].length === 2 && this.balance >= this.bet2;
            }
        } else {
            // Can double if hand has 2 cards and balance >= bet
            return this.player.length === 2 && this.balance >= this.bet1;
        }
    }

    disableButtons() {
        disableButton('hit-btn');
        disableButton('stand-btn');
        disableButton('double-btn');
        disableButton('split-btn');
        disableButton('surrender-btn');
    }

    enableButtons() {
        enableButton('hit-btn');
        enableButton('stand-btn');
        enableButton('double-btn');
        enableButton('split-btn');
        enableButton('surrender-btn');
    }

    reset() {
        // Reset game state
        this.bet1 = 0;
        this.bet2 = 0;
        this.dealer = [];
        this.player = [];
        this.playing = false;
        this.split = false;
        this.activeHand = 0;
        this.dealerMaskVal = 0;
        this.dealerVal = 0;
        this.hand1Val = 0;
        this.hand2Val = 0;
        this.hand1Win = '';
        this.hand2Win = '';
        this.hand1Bust = false;
        this.hand2Bust = false;
        this.hand1Surrender = false;
        this.hand2Surrender = false;
        this.dealerBust = false;
        this.hand1Blackjack = false;
        this.hand2Blackjack = false;
        this.dealerBlackjack = false;
        this.turn = null;
        this.masked = true;
        this.handOver = false;
        
        // Reset UI
        clearCards();
        clearWinners();
        resetScores();
        
        // Create a new shuffled deck
        this.createDeck();
        this.shuffle();
        
        // Enable all buttons
        this.enableButtons();
    }
}

// Create game instance when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Blackjack();
    game.initializeGame();
    
    // Make game available globally (for debugging)
    window.blackjackGame = game;
});