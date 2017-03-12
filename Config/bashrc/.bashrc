cd export LS_OPTIONS='--color=auto'

alias ls='ls $LS_OPTIONS'
alias ll='ls $LS_OPTIONS -l'
alias l='ls $LS_OPTIONS -lA'
alias dir='dir --color'
alias lsc='ls --color'
alias pacup="sudo pacman -Syu"
alias aup="yaourt -Syu --aur"
alias bashrc="nano ~/.bashrc && source ~/.bashrc"
alias bashrc="nano ~/.bashrc && source ~/.bashrc"
alias fstab="sudo nano /etc/fstab"
alias grub="sudo nano /etc/default/grub"
alias grubup="sudo update-grub"
alias reboot="sudo systemctl reboot"
alias poweroff="sudo systemctl poweroff"
alias resetcolors='konsoleprofile colors=DarkPastels'
alias groot='konsoleprofile colors=Groot;su;resetcolors;'
alias upgroot='exit'
alias speedtest='wget -O /dev/null http://speedtest.wdc01.softlayer.com/downloads/test10.zip'
alias fuck='sudo $(history -p !!)'
alias cd..='cd ..'
alias ..='cd ..'
alias ...='cd ../../../'
alias ....='cd ../../../../'
alias .....='cd ../../../../'
alias .4='cd ../../../../'
alias .5='cd ../../../../..'
alias c='clear'
alias grep='grep --color=auto'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias mount='mount |column -t'
alias h='history'
alias j='jobs -l'
alias path='echo -e ${PATH//:/\\n}'
alias now='date +"%T"'
alias nowtime=now
alias nowdate='date +"%d-%m-%Y"'
alias ping='ping -c 5'
alias fastping='ping -c 100 -s.2'
alias ports='netstat -tulanp'
alias disapprove='echo ಠ_ಠ'

export PS1="\[$(tput bold)\]\[\033[38;5;68m\]*\[$(tput sgr0)\]\[\033[38;5;11m\]\u\[$(tput sgr0)\]\[\033[38;5;68m\]@\[$(tput
sgr0)\]\[\033[38;5;11m\]\h\[$(tput sgr0)\]\[\033[38;5;68m\]*:[\[$(tput sgr0)\]\[\033[38;5;11m\]\w\[$(tput
sgr0)\]\[\033[38;5;68m\]]:\[$(tput sgr0)\]\[\033[38;5;11m\]\\$\[$(tput sgr0)\]"
