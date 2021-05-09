from random import shuffle
from time import sleep
from tkinter import *
from PIL import Image, ImageTk


card_vals = {'A': 1, '2': 2, '3': 3, '4': 4, '5': 5,'6': 6, '7': 7, '8': 8, 
             '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10}

class Blackjack:

    def __init__(self):
        self.shuffle()
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


    def reset(self):
        self.__init__()
        for widget in dealer_card_frame.winfo_children():
            widget.destroy()
        for widget in player_hand_1_frame.winfo_children():
            widget.destroy()
        # for widget in player_hand_2_frame.winfo_children():
        #     widget.destroy()
        dealer_score.set('Dealer: ')
        player_score.set('Player: ')
        winner.set('')
        winner_label.grid_remove()
        # new_hand_button.grid_remove()


    def shuffle(self):
        shuffle(deck)


    def unmask(self):
        bj.masked_card_label.destroy()
        Label(dealer_card_frame, image = bj.dealer[1][1], relief = "raised").pack(side = "left")
        dealer_score.set(f'Dealer: {self.d_val}')
        self.masked = False


    def player_hit(self):
        player_card = deck.pop(0)
        if self.active_hand == 0:
            Label(player_hand_1_frame, image = player_card[1], relief = "raised").pack(side = "left")
            self.player.append(player_card)
        # else:
        #     Label(player_hand_2_frame, image = player_card[1], relief = "raised").pack(side = "left")
        #     self.player[1].append(player_card)
        self.get_hand_vals()
        # if self.h1_bust:
        #     root.after(1000, play_dealer)
        if self.turn == 'Dealer':
            root.after(1000, play_dealer)


    def dealer_hit(self):
        dealer_card = deck.pop(0)
        Label(dealer_card_frame, image = dealer_card[1], relief = "raised").pack(side = "left")
        self.dealer.append(dealer_card)
        self.get_hand_vals()


    def stand(self):
        if self.split and self.active_hand == 0:
            self.active_hand = 1
        else:
            self.turn = 'Dealer'
            self.get_hand_vals()
            root.after(1000, play_dealer)


    def surrender(self):
        if self.active_hand == 0:
            self.h1_surrender = True
            self.h1_win = 'Surrender.'
            if self.split:
                self.active_hand = 1
            else:
                self.hand_over = True
        elif self.active_hand == 1:
            self.h2_surrender = True
            self.h2_win = 'Surrender.'
            if self.h1_surrender:
                self.hand_over = True
            else:
                self.turn = 'Dealer'
        root.after(1000, play_dealer)        


    def can_split(self):
        if self.playing == True:
            if self.split:
                return (False, "\nHand can only be split once.")
            elif card_vals[self.player[0].value] != card_vals[self.player[1].value]:
                return (False, "\nCard values must be equal in order to split.")
            elif len(self.player) > 2:
                return (False, "\nHand can only be split as first action.")
            else:
                return True
        return False
        

    def split_hand(self):
        self.player = [[card] for card in self.player]
        self.player[0].append(deck.pop(0))
        self.player[1].append(deck.pop(0))
        self.bet_2 = self.bet_1
        self.split = True


    def can_double(self):
        if self.playing:
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
        return False


    def double(self):
        if self.active_hand == 0:
            self.balance -= self.bet_1
            self.bet_1 *= 2
            self.hit()
            if self.split:
                self.active_hand = 1
            else :
                self.turn = 'Dealer'
        else:
            self.balance -= self.bet_2
            self.bet_2 *= 2
            self.hit()
            self.turn = 'Dealer'


    def play_again(self):
        if self.balance <= 0:
            self.get_loan()

        if self.balance > 0:
            play = input('\nPlay another hand? (y/n): ')
            if play == 'y':
                self.reset()
                self.deal()
            else:
                balance = open("bj_balance.txt", "w")
                balance.write(str(self.balance))
                balance.close()
        else:
            self.playing = False
            balance = open("bj_balance.txt", "w")
            balance.write(str(self.balance))
            balance.close()
            print('\nThanks for playing!\n')


    def get_loan(self):
        self.balance = self.loan_amt
    

    def get_hand_vals(self):

        self.d_mask_val = card_vals[str(self.dealer[0][0])]
        dealer_vals = [str(card[0]) for card in self.dealer]

        d_val = 0
        ace = False

        for card in dealer_vals:
            card_val = card_vals[card]
            if card_val == 1 and not ace:
                ace = True
                card_val = 11
            d_val += card_val
            if d_val > 21 and ace:
                d_val -= 10
                ace = False
        self.d_val = d_val

        if self.split:
            player_vals = [[card.value for card in hand] for hand in self.player]
            h1_vals =  player_vals[0]
            h2_vals = player_vals[1]
        else:
            h1_vals = [str(card[0]) for card in self.player]
            h2_vals = None

        h1_val = 0
        ace = False

        for card in h1_vals:
            card_val = card_vals[card]
            if card_val == 1 and not ace:
                ace = True
                card_val = 11
            h1_val += card_val
            if h1_val > 21 and ace:
                h1_val -= 10
                ace = False
        self.h1_val = h1_val

        if h2_vals:
            h2_val = 0
            ace = False

            for card in dealer_vals:
                card_val = card_vals[card]
                if card_val == 1 and not ace:
                    ace = True
                    card_val = 11
                h2_val += card_val
                if h2_val > 21 and ace:
                    h2_val -= 10
                    ace = False
            self.h2_val = h2_val

        player_score.set(f'Player: {bj.h1_val} ')

        if bj.turn == 'Player':
            dealer_score.set(f'Dealer: {bj.d_mask_val} ')
        elif bj.turn == 'Dealer':
            dealer_score.set(f'Dealer: {bj.d_val} ')
        self.check_for_winner()


    def check_for_winner(self):
        if self.turn == 'Player':
            if self.h1_val == 21:
                if self.split:
                    if len(self.player[0]) == 2:
                        self.h1_bj = True
                        player_score.set(f'Player: {self.h1_val} - Blackjack')
                    if self.active_hand == 0:
                        self.active_hand = 1
                else:
                    if len(self.player) == 2:
                        self.h1_bj = True
                        player_score.set(f'Player: {self.h1_val} - Blackjack')
                    self.turn = 'Dealer'
            if self.h2_val == 21:
                if len(self.player[1]) == 2:
                    self.h2_bj = True
                if self.active_hand == 1:
                    self.turn = 'Dealer'
            if self.h1_val > 21:
                self.h1_bust = True
                player_score.set(f'Player: {self.h1_val} - Bust')
                if self.split:
                    if self.active_hand == 0:
                        self.active_hand = 1
                else:
                    self.h1_win = 'Dealer Wins.'
                    self.turn = 'Dealer'
            if self.h2_val > 21:
                self.h2_bust = True
                self.turn = 'Dealer'
        if self.turn == 'Dealer':
            if bj.masked:
                bj.unmask()
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
            else:
                if self.split:
                    if self.h1_bj and self.h2_bj and not self.d_bj:
                        self.h1_win = 'Player Wins!'
                        self.h2_win = 'Player Wins!'
                else:
                    if self.h1_bj and not self.d_bj:
                        self.h1_win = 'Player Wins!'
                if self.d_val > self.h1_val and self.d_val >= 17:
                    if self.h1_surrender:
                        self.h1_win = 'Surrender.'
                    else:
                        self.h1_win = 'Dealer Wins.'
                elif self.d_val == self.h1_val and self.d_val > 16:
                    if self.h1_surrender:
                        self.h1_win = 'Surrender'
                    elif self.h1_bj and not self.d_bj:
                        self.h1_win = 'Player Wins!'
                    else:
                        self.h1_win = 'Push.'
                elif self.d_val < self.h1_val and self.d_val >= 17:
                    if self.h1_surrender:
                        self.h1_win = 'Surrender.'
                    else:
                        if self.h1_bust:
                            self.h1_win = 'Dealer Wins.'
                        else:
                            self.h1_win = 'Player Wins!'
                if self.h2_val > 0:
                    if self.d_val > self.h2_val and self.d_val >= 17:
                        if self.h2_surrender:
                            self.h2_win = 'Surrender.'
                        else:
                            self.h2_win = 'Dealer Wins.'
                    elif self.d_val == self.h2_val:
                        if self.h2_surrender:
                            self.h2_win = 'Surrender.'
                        elif self.h2_bj and not self.d_bj:
                            self.h2_win = 'Player Wins!'
                        else:
                            self.h2_win = 'Push.'
                    elif self.d_val < self.h2_val and self.d_val >= 17:
                        if self.h2_surrender:
                            self.h2_win = 'Surrender.'
                        else:
                            if self.h2_bust:
                                self.h2_win = 'Dealer Wins.'
                            else:
                                self.h2_win = 'Player Wins!'
            if self.split:
                if self.h1_win and self.h2_win:
                    self.hand_over = True
            else:
                if self.h1_win:
                    self.hand_over = True
            

    def place_bet(self):
        self.bet_1 = bet_scale.get()
        self.previous_bet = self.bet_1
        self.balance -= self.bet_1
        balance.set(f' Balance: {self.balance} ')
        self.playing = True
        self.turn = 'Player'
        write_bet_and_balance()

        for button in buttons:
            button.grid()

        for item in betting:
            item.grid_remove()

        dealer_score_label.grid()
        player_score_label.grid()
        dealer_card_frame.grid()
        player_hand_1_frame.grid()
        button_frame.grid()
        bet_label.grid_remove()
        bet_label_2.grid()
        balance_label.grid_remove()
        balance_label_2.grid()

        self.deal()


    def deal(self):
        for i in range(2):
            dealer_card = deck.pop(0)
            if i == 1:
                self.masked_card_label = Label(dealer_card_frame, image = card_back, relief = "raised")
                self.masked_card_label.pack(side = "left")
            else:
                Label(dealer_card_frame, image = dealer_card[1], relief = "raised").pack(side = "left")
            self.dealer.append(dealer_card)
            player_card = deck.pop(0)
            Label(player_hand_1_frame, image = player_card[1], relief = "raised").pack(side = "left")
            self.player.append(player_card)

        self.get_hand_vals()
        if self.hand_over:
            root.after(1000, play_dealer)
    
    
    def resolve_bets(self):
        if self.h1_win == 'Player Wins!':
            if self.h1_bj:
                self.balance += self.bet_1 + self.bet_1 * 1.5
            else:
                self.balance += self.bet_1 * 2
        elif self.h1_win == 'Push.':
            self.balance += self.bet_1
        elif self.h1_win == 'Surrender':
            self.balance += self.bet_1 // 2     
        if self.h2_win == 'Player Wins!':
            if self.h2_bj:
                self.balance += self.bet_2 + self.bet_2 * 1.5
            else:
                self.balance += self.bet_2 * 2
        elif self.h2_win == 'Push.':
            self.balance += self.bet_2
        elif self.h1_win == 'Surrender':
            self.balance += round(self.bet_2 / 2, 2)
        if self.balance == 0:
            self.get_loan()
        balance.set(f' Balance: {self.balance} ')
        bet_scale['to'] = bj.balance
        write_bet_and_balance()


    def initialize_game(self):
        button_frame.grid_remove()

        for item in betting:
            item.grid()

        dealer_score_label.grid_remove()
        dealer_card_frame.grid_remove()
        player_score_label.grid_remove()
        player_hand_1_frame.grid_remove()

        bet.set(f' Bet: {bj.previous_bet} ')
        balance.set(f' Balance: {bj.balance} ')
        bet_label.grid()
        bet_label_2.grid_remove()
        balance_label.grid()
        balance_label_2.grid_remove()
        if bj.balance >= bj.previous_bet:
            bet_scale.set(bj.previous_bet)
        else:
            bet_scale.set(0)



def load_card_faces():
    card_images = []
    suits = ['C', 'S', 'H', 'D']

    name = 'images/card_faces/red_back.png'
    card_back = PhotoImage(file = name)

    for suit in suits:
        name = f'images/card_faces/A{suit}.png'
        image = PhotoImage(file = name)
        card_images.append(('A', image))

        for card in range(2, 11):
            name = f'images/card_faces/{card}{suit}.png'
            image = PhotoImage(file = name)
            card_images.append((card, image))

        for card in ('J', 'Q', 'K'):
            name = f'images/card_faces/{card}{suit}.png'
            image = PhotoImage(file = name)
            card_images.append((card, image))

    return card_images, card_back


def new_hand():
    bj.reset()
    bj.initialize_game()


def play_dealer():
    bj.check_for_winner()
    if bj.hand_over:
        winner.set(bj.h1_win)
        winner_label.grid()
        bj.resolve_bets()
        root.after(3000, new_hand)
    else:
        if bj.d_val <= bj.h1_val and bj.d_val < 17:
            bj.dealer_hit()
            root.after(1000, play_dealer)


def bet_slider(bet_amt):
    bet.set(f' Bet: {int(bet_amt)} ')


def write_bet_and_balance():
    balance = open("bj_balance.txt", "w")
    balance.write(str(bj.balance))
    balance.write('\n')
    balance.write(str(bj.previous_bet))
    balance.close()


def on_closing():
    balance = open("bj_balance.txt", "w")
    balance.write(str(bj.balance))
    balance.write('\n')
    balance.write('0')
    balance.close()
    root.destroy()


root = Tk()
deck, card_back = load_card_faces()
bj = Blackjack()
root.title("Blackjack")
w_root = 780 # width for the TK root
h_root = 780 # height for the TK root
# get screen width and height
ws = root.winfo_screenwidth() # width of the screen
hs = root.winfo_screenheight() # height of the screen
# calculate x and y coordinates for the Tk root window
x = (ws/2) - (w_root/2)
y = (hs/2) - (h_root/2) - 20
# set the dimensions of the screen 
# and where it is placed
root.geometry(f'{w_root}x{h_root}+{int(x)}+{int(y)}')
img = Image.open('images/felt.png')
bg_img = ImageTk.PhotoImage(img)
background = Label(image = bg_img)
background.image = bg_img
background.place(x=0, y=0)

root.rowconfigure(0, weight=1)
root.rowconfigure(1, weight=1)
root.rowconfigure(2, weight=1)
root.rowconfigure(3, minsize = 10, weight=1)
root.rowconfigure(4, minsize = 10, weight=1)
root.rowconfigure(5, minsize = 10, weight=1)
root.rowconfigure(6, minsize = 50, weight=1)

root.columnconfigure(0, minsize = 65)


header = Label(root, text = 'BLACKJACK', font = ('Elephant', 36), bg = 'red', fg = "white", relief = 'raised', padx = 150, bd = 3)
header.grid(row = 0, column = 1, columnspan = 5)#, sticky = 'W')

dealer_score = StringVar()
dealer_score_label = Label(root, textvariable = dealer_score, font = ("Verdana", 20), bg = '#468C4E', fg = "white",
            relief = 'raised', padx = 10)
dealer_score_label.grid(row = 1, column = 1, sticky = 'SW')

dealer_card_frame = Frame(root, relief = 'sunken', bg = 'black')
dealer_card_frame.grid(row = 2, column = 1, columnspan = 4, sticky = 'W')

winner = StringVar()
winner_label = Label(root, textvariable = winner, font = ("Verdana", 20), bg = '#468C4E', fg = "white", relief = 'raised')
winner_label.grid(row = 3, column = 2, columnspan = 1, sticky = 'W')
winner_label.grid_remove()

player_hand_1_frame = Frame(root)
player_hand_1_frame.grid(row = 4, column = 1, columnspan = 4, rowspan = 1, sticky = 'W')

player_score = StringVar()
player_score_label = Label(root, textvariable = player_score, font = ("Verdana", 20), bg = '#468C4E', fg = "white",
            relief = 'raised', padx = 10)
player_score_label.grid(row = 5, column = 1, columnspan = 1, sticky = 'NW')


place_bet_label = Label(root, text = 'Please place your bet.', bg = '#468C4E', fg = "white", font = ('Verdana', 20), relief = 'raised', pady = 5)
place_bet_label.grid(row = 1, column = 2, columnspan = 3)#, sticky = 'E')

bet = StringVar()
bet.set(f'Bet: {bj.previous_bet}')
bet_label = Label(root, textvariable = bet, font = ('Verdana', 20), bg = '#468C4E', fg = "white",
            relief = 'raised', width = 7)
bet_label.grid(row = 2, column = 2, columnspan = 3)

balance = StringVar()
balance.set(f'Balance: {bj.balance}' )
balance_label = Label(root, textvariable = balance, font = ('Verdana', 20), bg = '#468C4E', fg = 'white', relief = 'raised', padx = 10)
balance_label.grid(row = 3, column = 2, columnspan = 3)

bet_label_2 = Label(root, textvariable = bet, font = ('Verdana', 20), bg = '#468C4E', fg = "white", relief = 'raised', width = 7)
bet_label_2.grid(row = 5, column = 2, sticky = 'NW')
balance_label_2 = Label(root, textvariable = balance, font = ('Verdana', 20), bg = '#468C4E', fg = 'white', relief = 'raised', padx = 10)
balance_label_2.grid(row = 5, column = 3, sticky = 'NE')

bet_scale = Scale(root, activebackground = 'red', bg = '#468C4E', font = ('Verdana', 20), fg = 'white', length = 350, width = 35, command = bet_slider,
            from_ = 1, to = bj.balance, orient = HORIZONTAL, resolution = 5)
bet_scale.grid(row = 4, column = 2, columnspan = 3, sticky = 'S')

place_bet_button = Button(text = 'Place Bet', bg = '#468C4E', fg = 'white', command = bj.place_bet, width = 7, height = 1, padx = 10,
            font = ('Verdana', 16))
place_bet_button.grid(row = 5, column = 3)

betting = [place_bet_label, bet_scale, place_bet_button]

button_height = 1
button_width = 7
button_font = 'Verdana'
button_font_size = 18

button_frame = Frame(root)
button_frame.grid(row = 6, column = 1, columnspan = 5, sticky = 'w')


hit_button = Button(button_frame, text = "Hit", font = (button_font, button_font_size), bg = '#468C4E', fg = "white",
                            command = bj.player_hit, padx = 8, height = button_height, width = button_width)
hit_button.grid(row = 0, column = 1)


stand_button = Button(button_frame, text="Stand", font = (button_font, button_font_size), bg = '#468C4E', fg = "white",
                            command = bj.stand, padx = 8, height = button_height, width = button_width)
stand_button.grid(row = 0, column = 2)


double_button = Button(button_frame, text = "Double", font = (button_font, button_font_size), bg = '#468C4E', fg = "white",
                            command = bj.double, padx = 8, height = button_height, width = button_width)
double_button.grid(row = 0, column = 3)

if bj.can_double:
    double_button["state"] = 'normal'
else:
    double_button["state"] = 'disabled'


split_button = Button(button_frame, text = "Split", font = (button_font, button_font_size), bg = '#468C4E', fg = "white",
                            command = bj.split, padx = 8, height = button_height, width = button_width)
split_button.grid(row = 0, column = 4)
if not bj.can_split():
    split_button['state'] = 'normal'
else:
    split_button['state'] = 'disabled'


surrender_button = Button(button_frame, text="Surrender", font = (button_font, button_font_size), bg = '#468C4E', fg = "white",
                            command=bj.surrender, padx=8, height = button_height, width = button_width)
surrender_button.grid(row = 0, column = 5)

buttons = [hit_button, stand_button, double_button, split_button, surrender_button]

# new_hand_button = Button(button_frame, text = "New Hand", font = ("Arial", 20), bg = '#468C4E', fg = "white",
#                             command = new_hand, padx=8, height = 2, width = 7)
# new_hand_button.grid(row = 0, column = 6)
# new_hand_button.grid_remove()

# print(root.grid_size())

# bet_frame = Frame(root, bg = '#468C4E', relief = 'raised')
# bet_frame.grid(row = 5, column = 1, sticky = 'W')


# bet_label = Label(bet_frame, text = 'Bet: ', font = ('Verdana', 18), bg = '#468C4E', fg = 'white')
# bet_label.grid(row = 1, column = 0, sticky = 'W')

# bet = StringVar
# bet_entry = Entry(bet_frame, width = 10, textvariable = bet)
# bet_entry.grid(row = 1, column = 1, sticky = 'W')

# Label(bet_frame, bg = '#468C4E').grid(row = 1, column = 2, sticky = 'W')


def play():
    # bj.deal()
    bj.initialize_game()
    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()


if __name__ == '__main__':
    play()
