class MemoryGame {
    constructor(timer, counter) {
        this.timer = timer;
        this.timer.reset();

        this.counter = counter;
        this.counter.reset();

        this.flippedCard = false;
        this.lockBoard = false;
        this.firstCard = true;
        this.secondCard = true;

        this.countries = ['australia','australia','egypt','egypt','france','france','india','india','italy','italy','japan','japan','london','london','usa','usa'];
    
        this.initCards();
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

            this.counter.increment();
        }
    } 


    checkForMatch() {
        //if they match stay facing up
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
        }, 800)};
    }

    checkForWin() {
        if (document.querySelectorAll('.flip').length === this.countries.length) {
            this.markWin();
        }
    }

    markWin() {
        document.querySelector('#winner-screen').classList.add('visible');
        this.timer.stop();
        //console.log(document.querySelector('#yourTime').
    }

    // First card and second card variables should be reset after each turn.
    endTurn() {
        [this.flippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
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


class Counter {
    constructor(element) {
        this.element = element;
        this.count = 0;
    }

    increment() {
        this.element.innerHTML = ++this.count;
    }

    reset() {
        this.count = 0;
        this.element.innerHTML = this.count;
    }
}

// Stars




// ToDo: wrap these global variables with anonymous function();
let timer = new Timer(document.querySelector('.timer'));
let counter = new Counter(document.querySelector('#turns'));
let game = new MemoryGame(timer, counter);


let cards = document.querySelectorAll('.card');
cards.forEach(card => card.addEventListener('click', (e) => {
    game.flipCard(e.currentTarget);
}));


document.querySelector('#reset').addEventListener('click', () => {
    game = new MemoryGame(timer, counter);
});




// ToDO: Add star rating
// When the cards don't match, the player loose a star rating goes down.
// Player has three stars and when all the stars are gone, it's game over
// add game over popup
// When player hits the refresh button, the star rating back to full
// 

