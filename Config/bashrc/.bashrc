export LS_OPTIONS='--color=auto'
eval "`dircolors`"
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

export PS1="\[$(tput bold)\]\[\033[38;5;68m\]*\[$(tput sgr0)\]\[\033[38;5;11m\]\u\[$(tput sgr0)\]\[\033[38;5;68m\]@\[$(tput
sgr0)\]\[\033[38;5;11m\]\h\[$(tput sgr0)\]\[\033[38;5;68m\]*:[\[$(tput sgr0)\]\[\033[38;5;11m\]\w\[$(tput
sgr0)\]\[\033[38;5;68m\]]:\[$(tput sgr0)\]\[\033[38;5;11m\]\\$\[$(tput sgr0)\]"
