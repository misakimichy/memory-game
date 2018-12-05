//All card items
const cardsArray = ['australia','australia','egypt','egypt','france','france','india','india','italy','italy','japan','japan','london','london','usa','usa'];

// * Add shuffle function
// When should it work? - the very first screen and when the player click the refresh button.




//Flip cards
const cards = document.querySelectorAll('.card');

let flippedCard = false;
let lockBoard = false;
let firstCard, secondCard;



function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');


    if (!flippedCard) {
        //first card click
        flippedCard = true;
        firstCard = this;
        return;

    } else {
        //second card click
        flippedCard = false;
        secondCard = this;
    
        checkForMatch();
    }
}

function checkForMatch() {
     //if they match stay facing up
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        return;

    } else {
    // if they don't match flip back
        lockBoard = true; 
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            resetBoard();
    }, 800)};
}

function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

cards.forEach(card => card.addEventListener('click', flipCard));




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
