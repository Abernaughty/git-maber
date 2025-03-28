#
# ~/.bashrc
#

[[ $- != *i* ]] && return

colors() {
	local fgc bgc vals seq0

	printf "Color escapes are %s\n" '\e[${value};...;${value}m'
	printf "Values 30..37 are \e[33mforeground colors\e[m\n"
	printf "Values 40..47 are \e[43mbackground colors\e[m\n"
	printf "Value  1 gives a  \e[1mbold-faced look\e[m\n\n"

	# foreground colors
	for fgc in {30..37}; do
		# background colors
		for bgc in {40..47}; do
			fgc=${fgc#37} # white
			bgc=${bgc#40} # black

			vals="${fgc:+$fgc;}${bgc}"
			vals=${vals%%;}

			seq0="${vals:+\e[${vals}m}"
			printf "  %-9s" "${seq0:-(default)}"
			printf " ${seq0}TEXT\e[m"
			printf " \e[${vals:+${vals+$vals;}}1mBOLD\e[m"
		done
		echo; echo
	done
}

[[ -f ~/.extend.bashrc ]] && . ~/.extend.bashrc

[ -r /usr/share/bash-completion/bash_completion   ] && . /usr/share/bash-completion/bash_completion

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
alias gitme='cd /home/maber/Git/git-maber/git-maber/'
alias nyan='telnet nyancat.dakko.us'
alias fishme='asciiquarium'
alias lol='fortune | cowsay | lolcat'
alias swiv='telnet towel.blinkenlights.nl'
alias redpill='cmatrix'
alias sf='screenfetch | lolcat'


export PS1="\[\033[38;5;68m\]*\[$(tput sgr0)\]\[\033[38;5;11m\]\u\[$(tput sgr0)\]\[\033[38;5;68m\]@\[$(tput sgr0)\]\[\033[38;5;11m\]\H\[$(tput sgr0)\]\[\033[38;5;68m\]*:[\[$(tput sgr0)\]\[\033[38;5;11m\]\w\[$(tput sgr0)\]\[\033[38;5;68m\]]:\[$(tput sgr0)\]\[\033[38;5;11m\]\\$\[$(tput sgr0)\]"

sf