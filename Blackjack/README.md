# Blackjack Game

A Python implementation of the classic Blackjack card game with a graphical user interface built using Tkinter.

## Features

- Full graphical interface with card visuals
- Complete implementation of standard Blackjack rules
- Player balance tracking and persistence
- Visual card representation
- Betting system

## Requirements

- Python 3.6 or higher
- Tkinter (included with most Python installations)

## Installation

1. Clone the repository
   ```
   git clone https://github.com/Abernaughty/git-maber.git
   ```

2. Navigate to the Blackjack directory
   ```
   cd git-maber/Blackjack
   ```

3. Run the game
   ```
   python Blackjack.py
   ```

## How to Play

1. The game starts by asking for your bet amount
2. You'll be dealt two cards and can see one of the dealer's cards
3. Choose to:
   - Hit (get another card)
   - Stand (keep current hand)
   - Double Down (double your bet and get one more card)
   - Split (if you have two cards of the same value)

4. Try to get as close to 21 as possible without going over
5. The dealer will then play according to standard rules
6. Your balance is automatically saved between games

## Project Structure

- `Blackjack.py` - Main game file containing all game logic and UI code
- `bj_balance.txt` - File storing player's current balance
- `images/` - Directory containing card images and assets

## Game Rules

- The goal is to have a hand value closer to 21 than the dealer without exceeding 21
- Number cards are worth their face value
- Face cards (Jack, Queen, King) are worth 10
- Aces are worth 1 or 11, whichever is more favorable
- If you exceed 21, you "bust" and lose your bet
- Blackjack (an Ace and a 10-value card) pays 3:2

## Customization

You can modify the starting balance by editing the `bj_balance.txt` file.

## Related Projects

A web-based version of this game is available in the [blackjack-web](/blackjack-web) directory.
