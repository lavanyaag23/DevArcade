const emojis = ["🍎","🍌","🍇","🍓","🍎","🍌","🍇","🍓"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

function shuffle(array){
    return array.sort(() => Math.random() - 0.5);
}

function startGame(){

    const board = document.getElementById("gameBoard");

    board.innerHTML = "";

    moves = 0;
    document.getElementById("moves").textContent = moves;

    const shuffled = shuffle([...emojis]);

    shuffled.forEach(emoji => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.emoji = emoji;

        card.textContent = "?";

        card.addEventListener("click", flipCard);

        board.appendChild(card);
    });

    firstCard = null;
    secondCard = null;
}

function flipCard(){

    if(lockBoard) return;

    if(this === firstCard) return;

    this.textContent = this.dataset.emoji;
    this.classList.add("flipped");

    if(!firstCard){
        firstCard = this;
        return;
    }

    secondCard = this;

    moves++;
    document.getElementById("moves").textContent = moves;

    checkMatch();
}

function checkMatch(){

    if(firstCard.dataset.emoji === secondCard.dataset.emoji){

        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);

        resetTurn();

        checkWin();
    }
    else{

        lockBoard = true;

        setTimeout(() => {

            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            resetTurn();

        }, 1000);
    }
}

function resetTurn(){

    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function checkWin(){

    const flippedCards = document.querySelectorAll(".flipped");

    if(flippedCards.length === emojis.length){

        setTimeout(() => {
            alert("🎉 You Won!");
        }, 300);
    }
}

startGame();