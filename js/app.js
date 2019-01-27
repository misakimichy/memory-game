class MemoryGame {
    constructor(timer, moves) {
        this.timer = timer;
        this.moves = moves;

        this.flippedCard = false;
        this.lockBoard = false;
        this.firstCard = true;
        this.secondCard = true;

        this.countriesArr = ['australia','egypt','france', 'india', 'italy','japan','london','usa'];
        this.countries = this.countriesArr.concat(this.countriesArr);
    
        this.reset();
    }

    reset() {
        this.timer.reset();
        this.moves.reset();

        this.initScreen();
        this.initCards();
    }

    initScreen() {
        // turn off win or lose screens
        document.querySelector('#winner-screen').classList.remove('visible');
        document.querySelector('#gameOver').classList.remove('visible');
        document.querySelector('#star1').classList.remove('invisible');
        document.querySelector('#star2').classList.remove('invisible');
        document.querySelector('#star3').classList.remove('invisible');
    }

    initCards() {
        // gather flipped cards
        let flipped = document.querySelectorAll('.flip');

        // unflip every cards
        flipped.forEach((card) => {
            card.classList.remove('flip');
        });

        if (flipped.length === 0){
            this.initCountries();
        } else {
            setTimeout (() => this.initCountries(), 700);
        }
    }

    initCountries() {
        // prepare 16 shuffled countries for the 16 cards
        // got an idea from here: https://www.w3schools.com/js/js_array_sort.asp
        this.countries = this.countries.sort((a, b) => {return 0.5 - Math.random()});

        // for each .card element
        document.querySelectorAll('.card').forEach((card, i) => {

            // grab the country from countries using the index
            let country = this.countries[i];

            // update the data-country and src attributes
            card.dataset.country = country;
            card.querySelector('.back-face').src = `img/${country}.jpg`;
        });
    }

    flipCard(card) {
        // lock board so when player double click the same card, it won't count as a second click
        if (this.lockBoard) return;
        // current clicked card should equal to first card so player cannot click the same card       
        if (card === this.firstCard) return;
        
        if (!this.timer.started) {
            this.timer.start();
        }

        card.classList.add('flip');
        
        if (!this.flippedCard) {
            //first card click
            this.flippedCard = true;
            this.firstCard = card;
            return;
    
        } else {
            //second card click
            this.flippedCard = false;
            this.secondCard = card;
            
            this.checkForMatch();

            this.moves.increment();
        }
    } 

    checkForMatch() {
        this.checkForLose();
        //if they match lock matched cards
        if (this.firstCard.dataset.country === this.secondCard.dataset.country) {
            this.firstCard.removeEventListener('click', this.flipCard);
            this.secondCard.removeEventListener('click', this.flipCard);
            this.checkForWin();

        } else {
        // if they don't match flip back
        this.lockBoard = true; 
        // Set timeout to prevent they remove 'flip' immediately.
            setTimeout(() => {
                this.firstCard.classList.remove('flip');
                this.secondCard.classList.remove('flip');
                this.endTurn();
        }, 600)};
    }

    // First card and second card variables should be reset after each turn.
    endTurn() {
        [this.flippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    // when all the flipped cards length equal to the array length, player win
    checkForWin() {
        if (document.querySelectorAll('.flip').length === this.countries.length) {
            this.markWin();
        }
    }

    // Show the time and score rating
    markWin() {
        this.timer.stop();
        document.querySelector('#winner-screen').classList.add('visible');
        document.querySelector('#yourTime').innerHTML = `Your time was ${this.timer}`;
        const starContainer = document.querySelector('#starRating');
        const star ='<li><i class="fa fa-star" id="star1"></i></li>';
        
        if (this.moves.count < 10) {
            document.querySelector('#yourScore').innerHTML = `Your score was excellent!!`;
            starContainer.innerHTML = star + star + star;
            
        } else if (this.moves.count < 15) {
            document.querySelector('#yourScore').innerHTML = `Your score was great!`;
            starContainer.innerHTML = star + star;

        } else if (this.moves.count < 30) {
            document.querySelector('#yourScore').innerHTML = `Your score was good.`;
            starContainer.innerHTML = star;
        }
    }

    // Excellent from 0 to 10 moves, Great to 15 moves, Good to 30 moves.
    // After 31 moves, screen turns to game over screen.
    checkForLose() {
        if(this.moves.count == 10) {
            document.querySelector('#star1').classList.add('invisible');
                    
        } else if (this.moves.count == 15) {
            document.querySelector('#star2').classList.add('invisible');
        
        } else if (this.moves.count == 30) {
            document.querySelector('#star3').classList.add('invisible');
            this.markLose();
        }
    }

    markLose() {
        this.timer.stop;
        document.querySelector('#gameOver').classList.add('visible');
    }
};

class Timer {
    constructor(element){
        this.element = element;

        this.seconds = 0;
        this.minutes = 0;
        this.interval = null;
        this.started = false;
    }

    start() {   
        this.started = true;
        this.interval = setInterval( () => {
            ++this.seconds;

            if(this.seconds === 60) {
                this.seconds = 0;
                this.minutes++;
            }
            
            this.element.innerHTML = this.toString();

        },1000);
    }

    stop() {
        this.started = false;
        clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.seconds = 0;
        this.minutes = 0;
        this.element.innerHTML = this.toString();
    }

    toString() {
        let displaySeconds = 0;
        let displayMinutes = 0;

        //minutes and seconds always have two digit
        if(this.seconds < 10) {
            displaySeconds = `0${this.seconds}`;
        } else {
            displaySeconds = this.seconds;
        }

        if (this.minutes < 10) {
            displayMinutes = `0${this.minutes}`;
        } else {
            displayMinutes = this.minutes;
        }

        return `${displayMinutes}:${displaySeconds}`;
    }   
}


class Moves {
    constructor(element) {
        this.element = element;
        this.count = 0;
    }

    increment() {
        this.element.innerHTML = `${++this.count} Moves`;  
    }

    reset() {
        this.count = 0;
        this.element.innerHTML = `${this.count} Moves`;
    }
}
 

(() => {
    let timer = new Timer(document.querySelector('.timer'));
    let moves = new Moves(document.querySelector('#turns'));
    let game = new MemoryGame(timer, moves);


    let cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', (e) => {
        game.flipCard(e.currentTarget);
    }));


    document.querySelectorAll('.retry').forEach(element => element.addEventListener('click', () => {
        game = new MemoryGame(timer, moves);
    }));
})();


