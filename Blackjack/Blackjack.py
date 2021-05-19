from random import shuffle
import tkinter as tk
from PIL import Image, ImageTk


class Blackjack:

    card_vals = {
        'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
        '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10
        }

    def __init__(self):
        self.loan_amt = 100
        self.balance = int(open("bj_balance.txt", "r").readlines()[0])
        self.previous_bet = int(open("bj_balance.txt", "r").readlines()[1])
        self.bet_1 = 0
        self.bet_2 = 0
        self.dealer = []
        self.player = []
        self.playing = False
        self.split = False
        self.active_hand = 0
        self.d_mask_val = 0
        self.d_val = 0
        self.h1_val = 0
        self.h2_val = 0
        self.h1_win = ''
        self.h2_win = ''
        self.h1_bust = False
        self.h2_bust = False
        self.h1_surrender = False
        self.h2_surrender = False
        self.d_bust = False
        self.h1_bj = False
        self.h2_bj = False
        self.d_bj = False
        self.turn = None
        self.masked = True
        self.hand_over = False

    def initialize_game(self):

        # Add in tkinter elements for betting stage.
        for item in betting:
            item.grid()

        # Remove tkinter items for playing the hand.
        for item in play_hand:
            item.grid_remove()
        for item in play_split_hand:
            item.grid_remove()

        # Set default bet to previous bet and update balance.
        hand_bet.set(f' Bet: {self.previous_bet} ')
        balance.set(f' Balance: {self.balance} ')

        # If balance < previous bet, set bet slider default to balance.
        if self.balance >= self.previous_bet:
            bet_scale.set(self.previous_bet)
        else:
            bet_scale.set(self.balance)

    def deal(self):

        # Pop 2 cards off top of deck for player and dealer,
        # pack their card images into hand frames,
        # and append them to player and dealer hands.
        for i in range(2):
            dealer_card = self.deck.pop(0)
            # Pack card back into frame instead of card face.
            if i == 1:
                self.masked_card_label = tk.Label(dealer_card_frame,
                                                  image=card_back,
                                                  relief="raised")
                self.masked_card_label.pack(side="left")
            else:
                tk.Label(
                         dealer_card_frame,
                         image=dealer_card[1],
                         relief="raised"
                         ).pack(side="left")
            self.dealer.append(dealer_card)
            player_card = self.deck.pop(0)
            tk.Label(
                     player_hand_frame,
                     image=player_card[1],
                     relief="raised"
                     ).pack(side="left")
            self.player.append(player_card)

        # Get hand values and check for blackjack/bust/winner.
        self.get_hand_vals()

        # Enable 'Double' button.
        double_button.config(state='normal')

        # For testing split functionality.
        split_button.config(state='normal')

        # If hand can be split enable 'Split' button, else disable button.
        if self.can_split():
            split_button.config(state='normal')
        else:
            split_button.config(state='disable')

        # If player has blackjack send action to dealer.
        if self.hand_over:
            root.after(1000, self.play_dealer)

    def player_hit(self):

        # Disable 'Double' and 'Split' buttons.
        if len(self.player[self.active_hand]) > 1:
            double_button.config(state='disabled')
            split_button.config(state='disable')
        else:
            split_button.config(state='disabled')

        # Pop card off top of deck, pack into appropriate
        # hand frame, and append to player hand.
        player_card = self.deck.pop(0)
        if self.active_hand == 0:
            if self.split:
                tk.Label(
                         player_hand_1_frame,
                         image=player_card[1],
                         relief="raised"
                         ).pack(side="left")
                self.player[0].append(player_card)
            else:
                tk.Label(
                         player_hand_frame,
                         image=player_card[1],
                         relief="raised"
                         ).pack(side="left")
                self.player.append(player_card)
        else:
            tk.Label(
                     player_hand_2_frame,
                     image=player_card[1],
                     relief="raised"
                     ).pack(side="left")
            self.player[1].append(player_card)

        # Get hand values and check for bust/winner.
        self.get_hand_vals()

        # If player turn is over, disable action buttons
        # and send action to dealer.
        if self.turn == 'Dealer':
            self.disable_buttons()
            root.after(1000, self.play_dealer)

    def dealer_hit(self):

        # Pop card off top of deck, pack into dealer hand frame,
        # and append to dealer hand.
        dealer_card = self.deck.pop(0)
        tk.Label(
                 dealer_card_frame,
                 image=dealer_card[1],
                 relief="raised"
                 ).pack(side="left")
        self.dealer.append(dealer_card)

        # Get hand values and check for blackjack/bust/winner.
        self.get_hand_vals()

    def can_double(self):
        # If active hand has max 2 cards and balance >= bet,
        # return True, else return False
        if self.split:
            if len(self.player[self.active_hand]) == 2:
                if self.active_hand == 0:
                    if self.balance >= self.bet_1:
                        return True
                elif self.active_hand == 1:
                    if self.balance >= self.bet_2:
                        return True
        else:
            if len(self.player) == 2 and self.balance >= self.bet_1:
                return True
        return False

    def double(self):

        # Disable 'Double' and 'Split' buttons.
        double_button.config(state='disabled')
        split_button.config(state='disable')

        # If hand 1 is active, double hand 1 bet,
        # update balance, and hit hand 1.
        if self.active_hand == 0:
            self.balance -= self.bet_1
            self.bet_1 *= 2
            self.player_hit()
            # If hand is split, set 2nd hand as active and hit 2nd hand.
            # Otherwise pass turn and action to dealer.
            if self.split:
                self.active_hand = 1
                root.after(500, self.player_hit)
            else:
                self.turn = 'Dealer'
                root.after(1000, self.play_dealer)
        # If hand 2 is the active hand, double hand 2 bet,
        # update balance, hit hand 2, disable action buttons,
        # and pass turn and action to dealer after 1000 ms.
        else:
            self.balance -= self.bet_2
            self.bet_2 *= 2
            self.player_hit()
            self.turn = 'Dealer'
            self.disable_buttons()
            root.after(1000, self.play_dealer)

    def can_split(self):

        card_1 = Blackjack.card_vals[str(self.player[0][0])]
        card_2 = Blackjack.card_vals[str(self.player[1][0])]

        # If player has already split hand, return False.
        if self.split:
            return False
        # If player has already hit active hand, return False.
        elif len(self.player) > 2:
            return False
        # If cards are not equal value, return False.
        elif card_1 != card_2:
            return False
        else:
            return True

    def split_hand(self):

        # Disable 'Split' button.
        split_button.config(state='disable')

        # Remove single hand tkinter items.
        for item in play_hand:
            item.grid_remove()

        # Add in split hand tkinter items.
        for item in play_split_hand:
            item.grid()

        # Split hand, place each card image into appropriate frame,
        # destroy old card images, update bets and balance,
        # and set frame highlight to active hand frame.
        # After 500 ms hit active hand.
        if not self.split:
            self.split = True
            self.player = [[card] for card in self.player]
            hand_1_card, hand_2_card = player_hand_frame.pack_slaves()
            tk.Label(
                     player_hand_1_frame,
                     image=self.player[0][0][1],
                     relief="raised"
                     ).pack(side="left")
            tk.Label(
                     player_hand_2_frame,
                     image=self.player[1][0][1],
                     relief="raised"
                     ).pack(side="left")
            hand_1_card.destroy()
            hand_2_card.destroy()
            self.bet_2 = self.bet_1
            self.balance -= self.bet_2
            hand_1_bet.set(f'Player: {self.bet_1} ')
            hand_2_bet.set(f'Player: {self.bet_1} ')
            balance.set(f' Balance: {self.balance} ')
            self.get_hand_vals()
            player_hand_1_frame.config(highlightthickness=5)
            root.after(500, self.split_hand)
        else:
            if len(self.player[0]) == 1:
                h1_hit = self.deck.pop(0)
                tk.Label(
                         player_hand_1_frame,
                         image=h1_hit[1],
                         relief="raised"
                         ).pack(side="left")
                self.player[0].append(h1_hit)
                self.get_hand_vals()

    def stand(self):
        # If hand is split and hand 1 is active, re-enable double button,
        # move frame highlight to second hand, and hit hand after 500 ms.
        # If hand isn't split or action is on second hand, disable buttons
        # and send action to dealer after 1000 ms.
        if self.split and self.active_hand == 0:
            player_hand_1_frame.config(highlightthickness=0)
            double_button.config(state='normal')
            self.active_hand = 1
            root.after(500, self.player_hit)
            player_hand_2_frame.config(highlightthickness=5)
        else:
            player_hand_2_frame.config(highlightthickness=0)
            self.disable_buttons()
            self.turn = 'Dealer'
            self.get_hand_vals()
            root.after(1000, self.play_dealer)

    def surrender(self):

        # If hands are split and hand 1 is active, pass action to hand 2
        # and hit after 500 ms. Otherwise disable buttons and send action
        # to dealer after 1000 ms.
        if self.active_hand == 0 and self.split:
            self.h1_surrender = True
            self.active_hand = 1
            player_hand_1_frame.config(highlightthickness=0)
            player_hand_2_frame.config(highlightthickness=5)
            root.after(500, self.player_hit)
        else:
            if self.split:
                self.h2_surrender = True
                player_hand_2_frame.config(highlightthickness=0)
            self.disable_buttons()
            self.hand_over = True
            self.turn = 'Dealer'
            root.after(1000, self.play_dealer)

    def get_hand_vals(self):

        # Create list of dealer's card values for lookup in card_vals dict.
        dealer_vals = [str(c[0]) for c in self.dealer]
        d_val = 0
        ace = False

        # Find sum of dealer's hand. Aces are valued at 1
        # if hand would bust otherwise 11.
        for card in dealer_vals:
            card_val = Blackjack.card_vals[card]
            if card_val == 1 and not ace:
                ace = True
                card_val = 11
            d_val += card_val
            if d_val > 21 and ace:
                d_val -= 10
                ace = False
        self.d_val = d_val

        # Create list of values for each of player's hands.
        if self.split:
            player_vals = [[str(c[0]) for c in hand] for hand in self.player]
            h1_vals = player_vals[0]
            h2_vals = player_vals[1]
        else:
            h1_vals = [str(c[0]) for c in self.player]
            h2_vals = None

        h1_val = 0
        ace = False

        # Find sum of player hand 1. Aces are valued at 1
        # if hand would bust otherwise 11.
        for card in h1_vals:
            card_val = Blackjack.card_vals[card]
            if card_val == 1 and not ace:
                ace = True
                card_val = 11
            h1_val += card_val
            if h1_val > 21 and ace:
                h1_val -= 10
                ace = False
        self.h1_val = h1_val

        # If player has split, Find sum for player hand 2.
        # Aces are valued at 1 if hand would bust otherwise 11.
        if h2_vals:
            h2_val = 0
            ace = False

            for card in h2_vals:
                card_val = Blackjack.card_vals[card]
                if card_val == 1 and not ace:
                    ace = True
                    card_val = 11
                h2_val += card_val
                if h2_val > 21 and ace:
                    h2_val -= 10
                    ace = False
            self.h2_val = h2_val

        # Set hand values in tkinter frames.
        if self.split:
            hand_1_score.set(f'Player: {self.h1_val} ')
            hand_2_score.set(f'Player: {self.h2_val} ')
        else:
            hand_score.set(f'Player: {self.h1_val} ')

        # If player's turn, show only value of dealer's first card,
        # otherwise show full hand value.
        if self.turn == 'Player':
            self.d_mask_val = Blackjack.card_vals[str(self.dealer[0][0])]
            dealer_score.set(f'Dealer: {self.d_mask_val} ')
        elif self.turn == 'Dealer':
            dealer_score.set(f'Dealer: {self.d_val} ')
        self.check_for_winner()

    def check_for_winner(self):
        if self.turn == 'Player':
            # Check hand 1 for blackjack.
            if self.h1_val == 21:
                if self.split:
                    # Update hand 1 value in tkinter label.
                    if len(self.player[0]) == 2:
                        self.h1_bj = True
                        hand_1_score.set(f'Player: {self.h1_val} - Blackjack')
                    # If split, set hand 2 as active, move active
                    # hand highlight, enable double button, and
                    # hit after 500 ms.
                    if self.active_hand == 0:
                        self.active_hand = 1
                        player_hand_1_frame.config(highlightthickness=0)
                        player_hand_2_frame.config(highlightthickness=5)
                        double_button.config(state='normal')
                        root.after(500, self.player_hit)
                else:
                    # Update hand 1 value in tkinter label.
                    if len(self.player) == 2:
                        self.h1_bj = True
                        hand_score.set(f'Player: {self.h1_val} - Blackjack')
                    self.turn = 'Dealer'
            # Check hand 1 for bust.
            elif self.h1_val > 21:
                self.h1_bust = True
                if self.split:
                    # Update hand 1 value in tkinter label.
                    hand_1_score.set(f'Player: {self.h1_val} - Bust')
                    # If split, set hand 2 as active, move
                    # active hand highlight, enable double button,
                    # and hit after 500 ms.
                    if self.active_hand == 0:
                        self.active_hand = 1
                        player_hand_1_frame.config(highlightthickness=0)
                        player_hand_2_frame.config(highlightthickness=5)
                        double_button.config(state='normal')
                        root.after(500, self.player_hit)
                else:
                    # Update hand 1 value in tkinter label, remove active
                    # hand highlight, and send action to dealer.
                    hand_score.set(f'Player: {self.h1_val} - Bust')
                    player_hand_2_frame.config(highlightthickness=0)
                    self.h1_win = 'Dealer Wins.'
                    self.turn = 'Dealer'
                # Check hand 2 for blackjack.
                if self.h2_val == 21:
                    # Update hand 2 value in tkinter frame.
                    if len(self.player[1]) == 2:
                        self.h2_bj = True
                        hand_2_score.set(f'Player: {self.h2_val} - Blackjack')
                    # Send action to dealer.
                    self.turn = 'Dealer'
                # Check hand 2 for bust. If bust update hand 2 value in
                # tkinter label and send action to dealer.
                elif self.h2_val > 21:
                    self.h2_bust = True
                    hand_2_score.set(f'Player: {self.h2_val} - Bust')
                    self.turn = 'Dealer'
        if self.turn == 'Dealer':
            # Remove active hand highlight.
            player_hand_1_frame.config(highlightthickness=0)
            player_hand_2_frame.config(highlightthickness=0)
            # Unmask dealer's second card.
            if self.masked:
                self.unmask()
            # Check for dealer blackjack. If blackjack, update dealer hand
            # value in tkinter label and and assign winning hand(s).
            if self.d_val == 21 and len(self.dealer) == 2:
                self.d_bj = True
                dealer_score.set(f'Dealer: {self.d_val} - Blackjack')
                if self.h1_bj:
                    self.h1_win = 'Push.'
                else:
                    if self.h1_surrender:
                        self.h1_win = 'Surrender.'
                    else:
                        self.h1_win = 'Dealer Wins.'
                if self.h2_bj:
                    self.h2_win = 'Push.'
                else:
                    if self.h2_surrender:
                        self.h2_win = 'Surrender.'
                    else:
                        self.h2_win = 'Dealer Wins.'
            # Check for dealer bust. If bust, update dealer hand
            # value in tkinter label and assign winning hand(s).
            elif self.d_val > 21:
                self.d_bust = True
                dealer_score.set(f'Dealer: {self.d_val} - Bust')
                if self.h1_bust:
                    self.h1_win = 'Push.'
                else:
                    if self.h1_surrender:
                        self.h1_win = 'Surrender.'
                    else:
                        self.h1_win = 'Player Wins!'
                if self.h2_bust:
                    self.h2_win = 'Push.'
                else:
                    if self.h2_surrender:
                        self.h2_win = 'Surrender.'
                    else:
                        self.h2_win = 'Player Wins!'
            # If dealer hand value >= 17, assign winning hand(s).
            elif self.d_val >= 17:
                if self.h1_surrender:
                    self.h1_win = 'Surrender.'
                elif self.h1_val < self.d_val:
                    self.h1_win = 'Dealer Wins.'
                elif self.h1_val == self.d_val:
                    self.h1_win = 'Push.'
                else:
                    if self.h1_bust:
                        self.h1_win = 'Dealer Wins.'
                    else:
                        self.h1_win = 'Player Wins!'
                if self.h2_val > 0:
                    if self.h2_surrender:
                        self.h2_win = 'Surrender.'
                    elif self.h2_val < self.d_val:
                        self.h2_win = 'Dealer Wins.'
                    elif self.h1_val == self.d_val:
                        self.h1_win = 'Push.'
                    else:
                        if self.h2_bust:
                            self.h2_win = 'Dealer Wins.'
                        else:
                            self.h2_win = 'Player Wins!'
            # If player hand is blackjack/bust/surrender,
            # assign winning hand(s).
            else:
                if self.h1_bj:
                    self.h1_win = 'Player Wins.'
                elif self.h1_bust:
                    self.h1_win = 'Dealer Wins.'
                elif self.h1_surrender:
                    self.h1_win = 'Surrender.'
                elif self.d_val > self.h1_val:
                    self.h1_win = 'Dealer Wins.'
                if self.h2_bj:
                    self.h2_win = 'Player Wins.'
                elif self.h2_bust:
                    self.h2_win = 'Dealer Wins.'
                elif self.h2_surrender:
                    self.h2_win = 'Surrender.'
                elif self.d_val > self.h2_val:
                    self.h2_win = 'Dealer Wins.'
        # If all hands have been assigned a winner, hand is over.
        if self.split:
            if self.h1_win and self.h2_win:
                self.hand_over = True
        else:
            if self.h1_win:
                self.hand_over = True

    def play_dealer(self):
        self.check_for_winner()
        # If hand is over, remove active hand highlight,
        # set hand winners in tkinter labels, resolve bets,
        # and start new hand after 2000 ms.
        if self.hand_over:
            player_hand_1_frame.config(highlightthickness=0)
            player_hand_2_frame.config(highlightthickness=0)
            if self.split:
                hand_1_winner.set(self.h1_win)
                hand_2_winner.set(self.h2_win)
                hand_1_winner_label.grid()
                hand_2_winner_label.grid()
                if self.h1_win == 'Dealer Wins.':
                    hand_1_winner_label.config(
                                               bg='red',
                                               fg='white'
                                               )
                elif self.h1_win == 'Push.':
                    hand_1_winner_label.config(
                                               bg='white',
                                               fg='black'
                                               )
                else:
                    hand_1_winner_label.config(
                                               bg='#468C4E',
                                               fg='white'
                                               )
                if self.h2_win == 'Dealer Wins.':
                    hand_2_winner_label.config(
                                               bg='red',
                                               fg='white'
                                               )
                elif self.h2_win == 'Push.':
                    hand_2_winner_label.config(
                                               bg='white',
                                               fg='black'
                                               )
                else:
                    hand_2_winner_label.config(
                                               bg='#468C4E',
                                               fg='white'
                                               )
            else:
                winner.set(self.h1_win)
                if self.h1_win == 'Dealer Wins.':
                    winner_label.config(
                                        bg='red',
                                        fg='white'
                                        )
                elif self.h1_win == 'Push.':
                    winner_label.config(
                                        bg='white',
                                        fg='black'
                                        )
                else:
                    winner_label.config(
                                        bg='#468C4E',
                                        fg='white'
                                        )
                winner_label.grid()

            self.resolve_bets()
            root.after(2000, self.new_hand)
        # If hand not over, hit dealer and return to play_dealer after 1000 ms.
        else:
            # if self.d_val <= self.h1_val and self.d_val < 17:
            self.dealer_hit()
            root.after(1000, self.play_dealer)

    def resolve_bets(self):
        # Blackjack pays out 1.5:1.
        # Surrender only loses 1/2 of bet.
        if self.h1_win == 'Player Wins!':
            if self.h1_bj:
                self.balance += int(self.bet_1 + self.bet_1 * 1.5)
            else:
                self.balance += self.bet_1 * 2
        elif self.h1_win == 'Push.':
            self.balance += self.bet_1
        elif self.h1_win == 'Surrender':
            self.balance += self.bet_1 // 2
        if self.h2_win == 'Player Wins!':
            if self.h2_bj:
                self.balance += int(self.bet_2 + self.bet_2 * 1.5)
            else:
                self.balance += self.bet_2 * 2
        elif self.h2_win == 'Push.':
            self.balance += self.bet_2
        elif self.h1_win == 'Surrender':
            self.balance += self.bet_2 // 2
        # Player takes out loan if balance < 5.
        if self.balance < 5:
            self.get_loan()
        # Update balance in tkinter label.
        balance.set(f' Balance: {self.balance} ')
        # Set upper limit of bet slider to player balance.
        bet_scale['to'] = self.balance
        # Write player balance and last bet to bj_balance.txt
        self.write_bet_and_balance()

    def create_deck(self):
        # Create deck. Each card in deck is tuple of card value and card face.
        setattr(self, 'deck', [])
        suits = ['C', 'S', 'H', 'D']

        for suit in suits:
            # Create Aces.
            name = f'images/card_faces/A{suit}.png'
            image = tk.PhotoImage(file=name)
            self.deck.append(('A', image))

            # Create 2 - 10.
            for card in range(2, 11):
                name = f'images/card_faces/{card}{suit}.png'
                image = tk.PhotoImage(file=name)
                self.deck.append((card, image))

            # Create Jack, Queen, and King.
            for card in ('J', 'Q', 'K'):
                name = f'images/card_faces/{card}{suit}.png'
                image = tk.PhotoImage(file=name)
                self.deck.append((card, image))

    def shuffle(self):
        shuffle(self.deck)

    def place_bet(self):
        # Get bet from bet_scale, update bet and balance tkinter labels,
        # and write bet and balance to bj_balance.txt.
        self.bet_1 = bet_scale.get()
        self.previous_bet = self.bet_1
        self.balance -= self.bet_1
        balance.set(f' Balance: {self.balance} ')
        hand_bet.set(f' Bet: {self.bet_1} ')
        self.playing = True
        self.turn = 'Player'
        self.write_bet_and_balance()

        # Remove items in betting UI.
        for item in betting:
            item.grid_remove()

        # Add items in playing UI
        for item in play_hand:
            item.grid()

        # Deal starting hand.
        self.deal()

    def get_loan(self):
        self.balance = self.loan_amt

    def new_hand(self):
        self.reset()
        self.initialize_game()

    def reset(self):
        self.__init__()
        self.create_deck()
        self.shuffle()
        # Destroy cards in dealer hand.
        for widget in dealer_card_frame.winfo_children():
            widget.destroy()
        # Destroy cards in player hands.
        for widget in player_hand_frame.winfo_children():
            widget.destroy()
        for widget in player_hand_1_frame.winfo_children():
            widget.destroy()
        for widget in player_hand_2_frame.winfo_children():
            widget.destroy()
        # Reset hand values and winning hands in tkinter labels.
        dealer_score.set('Dealer: ')
        hand_1_score.set('Player: ')
        hand_2_score.set('Player: ')
        winner.set('')
        hand_1_winner.set('')
        hand_2_winner.set('')
        winner_label.grid_remove()
        hand_1_winner_label.grid_remove()
        hand_2_winner_label.grid_remove()
        # Enable action buttons.
        self.enable_buttons()

    def unmask(self):
        # Destroy card back in dealer hand and pack card face.
        game.masked_card_label.destroy()
        tk.Label(
                 dealer_card_frame,
                 image=game.dealer[1][1],
                 relief="raised"
                 ).pack(side="left")
        # Update dealer hand value in tkinter label.
        dealer_score.set(f'Dealer: {self.d_val}')
        self.masked = False

    def disable_buttons(self):
        # Disable hand action buttons.
        hit_button.config(state='disabled')
        stand_button.config(state='disabled')
        double_button.config(state='disabled')
        split_button.config(state='disable')
        surrender_button.config(state='disabled')

    def enable_buttons(self):
        # Enable hand action buttons.
        hit_button.config(state='normal')
        stand_button.config(state='normal')
        double_button.config(state='normal')
        split_button.config(state='normal')
        surrender_button.config(state='normal')

    def bet_slider(self, bet_amt):
        bet.set(f' Bet: {int(bet_amt)} ')

    def write_bet_and_balance(self):
        balance = open("bj_balance.txt", "w")
        balance.write(str(int(self.balance)))
        balance.write('\n')
        balance.write(str(int(self.previous_bet)))
        balance.close()

    def on_closing(self):
        balance = open("bj_balance.txt", "w")
        balance.write(str(self.balance))
        balance.write('\n')
        balance.write('0')
        balance.close()
        root.destroy()


# Root Window
root = tk.Tk()
game = Blackjack()
game.create_deck()
game.shuffle()
root.title("Blackjack")
w_root = 1000
h_root = 780
ws = root.winfo_screenwidth()
hs = root.winfo_screenheight()
x = (ws/2) - (w_root/2)
y = (hs/2) - (h_root/2) - 20
root.geometry(f'{w_root}x{h_root}+{int(x)}+{int(y)}')
img = Image.open('images/felt.png')
bg_img = ImageTk.PhotoImage(img)
background = tk.Label(image=bg_img)
background.image = bg_img
background.place(x=0, y=0)

root.rowconfigure(0, weight=1)
root.rowconfigure(1, weight=1)
root.rowconfigure(2, weight=1)
root.rowconfigure(3, minsize=40, weight=1)
root.rowconfigure(4, weight=1)
root.rowconfigure(5, weight=1)
root.rowconfigure(6, minsize=35, weight=1)
root.rowconfigure(7, weight=1)
root.rowconfigure(8, weight=1)


# Load card back
name = 'images/card_faces/red_back.png'
card_back = tk.PhotoImage(file=name)


# Header
header = tk.Label(
                  root,
                  text='BLACKJACK',
                  font=('Elephant', 36),
                  bg='red',
                  fg="white",
                  relief='raised',
                  width=30
                  )

header.grid(
            row=0,
            column=0,
            columnspan=9,
            sticky='N'
            )


# Dealer
dealer_score = tk.StringVar()
dealer_score_label = tk.Label(
                              root,
                              textvariable=dealer_score,
                              font=("Verdana", 16),
                              bg='#468C4E',
                              fg="white",
                              relief='raised',
                              padx=10
                              )

dealer_score_label.grid(
                        row=1,
                        column=0,
                        columnspan=9,
                        sticky='S'
                        )

dealer_score_label.grid_remove()

dealer_card_frame = tk.Frame(
                             root,
                             relief='sunken',
                             bg='black'
                             )

dealer_card_frame.grid(
                       row=2,
                       column=0,
                       columnspan=9,
                       sticky='S'
                       )

dealer_card_frame.grid_remove()


# Player Hand No Split
player_hand_frame = tk.Frame(root)
player_hand_frame.grid(
                       row=4,
                       column=0,
                       columnspan=9,
                       sticky='N'
                       )

player_hand_frame.grid_remove()

hand_score = tk.StringVar()
hand_score_label = tk.Label(
                            root,
                            textvariable=hand_score,
                            font=("Verdana", 16),
                            bg='#468C4E',
                            fg="white",
                            relief='raised',
                            padx=10
                            )

hand_score_label.grid(
                      row=5,
                      column=0,
                      columnspan=9,
                      sticky='N'
                      )

hand_score_label.grid_remove()

hand_bet = tk.StringVar()
hand_bet_label = tk.Label(
                          root,
                          textvariable=hand_bet,
                          font=('Verdana', 16),
                          bg='#468C4E',
                          fg="white",
                          relief='raised'
                          )

hand_bet_label.grid(
                    row=6,
                    column=0,
                    columnspan=9,
                    sticky='N'
                    )

hand_bet_label.grid_remove()


# Player Hand 1
player_hand_1_frame = tk.Frame(root)
player_hand_1_frame.config(
                           highlightbackground='yellow',
                           highlightcolor='yellow',
                           highlightthickness=0
                           )

player_hand_1_frame.grid(
                         row=4,
                         column=0,
                         columnspan=4,
                         sticky='N'
                         )

player_hand_1_frame.grid_remove()

hand_1_score = tk.StringVar()
hand_1_score_label = tk.Label(
                              root,
                              textvariable=hand_1_score,
                              font=("Verdana", 16),
                              bg='#468C4E',
                              fg="white",
                              relief='raised',
                              padx=10
                              )

hand_1_score_label.grid(
                        row=5,
                        column=0,
                        columnspan=4,
                        sticky='N'
                        )

hand_1_score_label.grid_remove()

hand_1_bet = tk.StringVar()
hand_1_bet_label = tk.Label(
                            root,
                            textvariable=hand_1_bet,
                            font=('Verdana', 16),
                            bg='#468C4E',
                            fg="white",
                            relief='raised',
                            padx=10
                            )

hand_1_bet_label.grid(
                      row=6,
                      column=0,
                      columnspan=4,
                      sticky='N'
                      )

hand_1_bet_label.grid_remove()


# Player Hand 2
player_hand_2_frame = tk.Frame(root)
player_hand_2_frame.config(
                           highlightbackground='yellow',
                           highlightcolor='yellow',
                           highlightthickness=0
                           )

player_hand_2_frame.grid(
                         row=4,
                         column=4,
                         columnspan=4,
                         sticky='N'
                         )

player_hand_2_frame.grid_remove()

hand_2_score = tk.StringVar()
hand_2_score_label = tk.Label(
                              root,
                              textvariable=hand_2_score,
                              font=("Verdana", 16),
                              bg='#468C4E',
                              fg="white",
                              relief='raised',
                              padx=10
                              )

hand_2_score_label.grid(
                        row=5,
                        column=4,
                        columnspan=4,
                        sticky='N'
                        )

hand_2_score_label.grid_remove()

hand_2_bet = tk.StringVar()
hand_2_bet_label = tk.Label(
                            root,
                            textvariable=hand_2_bet,
                            font=('Verdana', 16),
                            bg='#468C4E',
                            fg="white",
                            relief='raised',
                            padx=10
                            )

hand_2_bet_label.grid(
                      row=6,
                      column=4,
                      columnspan=4,
                      sticky='N'
                      )

hand_2_bet_label.grid_remove()


# Winner
winner = tk.StringVar()
winner_label = tk.Label(
                        root,
                        textvariable=winner,
                        font=("Verdana", 18),
                        bg='#468C4E',
                        fg="white",
                        relief='raised'
                        )

winner_label.grid(
                  row=3,
                  column=0,
                  columnspan=8,
                  padx=(20, 0)
                  )

winner_label.grid_remove()

hand_1_winner = tk.StringVar()
hand_1_winner_label = tk.Label(
                               root,
                               textvariable=hand_1_winner,
                               font=("Verdana", 18),
                               bg='#468C4E',
                               fg="white",
                               relief='raised'
                               )

hand_1_winner_label.grid(
                         row=3,
                         column=0,
                         columnspan=4
                         )

hand_1_winner_label.grid_remove()

hand_2_winner = tk.StringVar()
hand_2_winner_label = tk.Label(
                               root,
                               textvariable=hand_2_winner,
                               font=("Verdana", 18),
                               bg='#468C4E',
                               fg="white",
                               relief='raised'
                               )

hand_2_winner_label.grid(
                         row=3,
                         column=4,
                         columnspan=4
                         )

hand_2_winner_label.grid_remove()


# Betting UI
place_bet_label = tk.Label(
                           root,
                           text='Please place your bet.',
                           bg='#468C4E',
                           fg="white",
                           font=('Verdana', 20),
                           relief='raised',
                           pady=5
                           )

place_bet_label.grid(
                     row=1,
                     column=0,
                     columnspan=8
                     )

bet = tk.StringVar()
bet.set(f'Bet: {game.previous_bet}')
bet_label = tk.Label(
                     root,
                     textvariable=bet,
                     font=('Verdana', 20),
                     bg='#468C4E',
                     fg="white",
                     relief='raised', width=7
                     )

bet_label.grid(
               row=2,
               column=0,
               columnspan=8
               )

bet_scale = tk.Scale(
                     root,
                     activebackground='red',
                     bg='#468C4E',
                     font=('Verdana', 20),
                     fg='white',
                     length=350,
                     width=35,
                     command=game.bet_slider,
                     from_=1,
                     to=game.balance,
                     orient='horizontal',
                     resolution=5,
                     showvalue=0
                     )

bet_scale.grid(
               row=3,
               column=0,
               columnspan=8,
               sticky='S'
               )

place_bet_button = tk.Button(
                             text='Place Bet',
                             bg='#468C4E',
                             fg='white',
                             command=game.place_bet,
                             width=7,
                             height=1,
                             padx=10,
                             font=('Verdana', 20)
                             )

place_bet_button.grid(
                      row=4,
                      column=0,
                      columnspan=8
                      )


# Balance Footer
balance = tk.StringVar()
balance.set(f'Balance: {game.balance}')
balance_label = tk.Label(
                         root,
                         textvariable=balance,
                         font=('Verdana', 16),
                         bg='red',
                         fg='white',
                         relief='raised',
                         padx=10,
                         width=76
                         )

balance_label.grid(
                   row=8,
                   column=0,
                   columnspan=8,
                   sticky='S'
                   )


# Action Buttons
button_height = 1
button_width = 7
button_font = 'Verdana'
button_font_size = 16
disabled_color = 'gray70'

button_frame = tk.Frame(root)
button_frame.grid(row=7, column=0, columnspan=8)


# Hit Buton
hit_button = tk.Button(
                       button_frame,
                       text="Hit",
                       font=(button_font, button_font_size),
                       bg='#468C4E',
                       fg="white",
                       command=game.player_hit,
                       padx=8,
                       height=button_height,
                       width=button_width,
                       disabledforeground=disabled_color
                       )

hit_button.grid(
                row=0,
                column=1
                )


# Stand Button
stand_button = tk.Button(
                         button_frame,
                         text="Stand",
                         font=(button_font, button_font_size),
                         bg='#468C4E',
                         fg="white",
                         command=game.stand,
                         padx=8,
                         height=button_height,
                         width=button_width,
                         disabledforeground=disabled_color
                         )

stand_button.grid(
                  row=0,
                  column=2
                  )


# Double Button
double_button = tk.Button(
                          button_frame,
                          text="Double",
                          font=(button_font, button_font_size),
                          bg='#468C4E',
                          fg="white",
                          command=game.double,
                          padx=8,
                          height=button_height,
                          width=button_width,
                          disabledforeground=disabled_color
                          )

double_button.grid(
                   row=0,
                   column=3
                   )


# Split Button
split_button = tk.Button(
                         button_frame,
                         text="Split",
                         font=(button_font, button_font_size),
                         bg='#468C4E',
                         fg="white",
                         command=game.split_hand,
                         padx=8,
                         height=button_height,
                         width=button_width,
                         disabledforeground=disabled_color
                         )

split_button.grid(
                  row=0,
                  column=4
                  )

# Surrender Button
surrender_button = tk.Button(
                             button_frame,
                             text="Surrender",
                             font=(button_font, button_font_size),
                             bg='#468C4E',
                             fg="white",
                             command=game.surrender,
                             padx=8,
                             height=button_height,
                             width=button_width,
                             disabledforeground=disabled_color
                             )

surrender_button.grid(
                      row=0,
                      column=5
                      )


betting = [place_bet_label, bet_label, bet_scale, place_bet_button]

play_hand = [dealer_score_label, dealer_card_frame,
             player_hand_frame, hand_score_label,
             hand_bet_label, button_frame]

play_split_hand = [dealer_score_label, dealer_card_frame,
                   player_hand_1_frame, hand_1_score_label, hand_1_bet_label,
                   player_hand_2_frame, hand_2_score_label, hand_2_bet_label,
                   button_frame]


def play():
    game.initialize_game()
    root.protocol("WM_DELETE_WINDOW", game.on_closing)
    root.mainloop()


if __name__ == '__main__':
    play()
