//All card items

// * Add shuffle function
// When should it work? - the very first screen and when the player click the refresh button.



class MemoryGame {
    constructor() {
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
        flipped.forEach(function(card) {
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
        countries = countries.sort(function(a, b){return 0.5 - Math.random()});

        // for each .card element
        document.querySelectorAll('.card').forEach(function(card, i) {

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
            setTimeout(() => {
                this.firstCard.classList.remove('flip');
                this.secondCard.classList.remove('flip');
                this.resetBoard();
        }, 800)};
    }

    resetBoard() {
        [this.flippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    
};


let game = new MemoryGame();

let cards = document.querySelectorAll('.card');
cards.forEach(card => card.addEventListener('click',function() {
    game.flipCard(this);
}));

document.querySelector('#reset').addEventListener('click', function () {
    game = new MemoryGame();
});



// * Add a counting timer
// the timer starts from 00.00
// When the player click the first card, the timer starts
// Once the player win (the last pair matched), the timer stops.
// when the player hit refresh button, the timer back to 0.


// * Add star rating
// When the cards don't match, the player loose a star rating goes down.
// Player has three stars and when all the stars are gone, it's game over
// When player hits the refresh button, the star rating back to full


// * Add a move counter next to the star rating
//  When the player click the card twice (one pair of move), the counter count up.



// * Once every cards face up, the player wins and congrats screen shows up
