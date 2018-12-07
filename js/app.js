class MemoryGame {
    constructor(timer) {
        this.timer = timer;
        this.timer.reset();

        this.flippedCard = false;
        this.lockBoard = false;
        this.firstCard = true;
        this.secondCard = true;
    
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
        let countries = ['australia','australia','egypt','egypt','france','france','india','india','italy','italy','japan','japan','london','london','usa','usa'];
        // got an idea from here: https://www.w3schools.com/js/js_array_sort.asp
        countries = countries.sort((a, b) => {return 0.5 - Math.random()});

        // for each .card element
        document.querySelectorAll('.card').forEach((card, i) => {

            // grab the country from countries using the index
            let country = countries[i];

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
        }
    } 


    checkForMatch() {
        //if they match stay facing up
        if (this.firstCard.dataset.country === this.secondCard.dataset.country) {
            this.firstCard.removeEventListener('click', this.flipCard);
            this.secondCard.removeEventListener('click', this.flipCard);
            return;
    
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

let timer = new Timer(document.querySelector('.timer'));
let game = new MemoryGame(timer);


let cards = document.querySelectorAll('.card');
cards.forEach(card => card.addEventListener('click', function() {
    game.flipCard(this);
}));

/*
 Need to choose first card
.addEventListener('click', function() {
    activateTimer = new Timer();
});
*/


document.querySelector('#reset').addEventListener('click', () => {
    game = new MemoryGame(timer);
});



// Once the player win (the last pair matched), the timer stops.



// * Add star rating
// When the cards don't match, the player loose a star rating goes down.
// Player has three stars and when all the stars are gone, it's game over
// When player hits the refresh button, the star rating back to full


// * Add a move counter next to the star rating
//  When the player click the card twice (one pair of move), the counter counts up.
// When the player refresh the page, the counter back to 0.


// * Once every cards face up, the player wins and congrats screen shows up
// 