let score = 0;
let missed = 0;

let gameRunning = false;
let speed = 2000;

const gameArea = document.getElementById("game-area");

function startGame(){

    if(gameRunning) return;

    gameRunning = true;

    score = 0;
    missed = 0;

    document.getElementById("score").textContent = score;
    document.getElementById("missed").textContent = missed;

    spawnBug();
}

function spawnBug(){

    if(!gameRunning) return;

    const bug = document.createElement("div");

    bug.classList.add("bug");
    bug.textContent = "🐞";

    const x = Math.random() * 750;
    const y = Math.random() * 450;

    bug.style.left = x + "px";
    bug.style.top = y + "px";

    gameArea.appendChild(bug);

    bug.addEventListener("click", () => {

        score++;

        document.getElementById("score").textContent = score;

        bug.remove();

        if(score % 5 === 0 && speed > 500){
            speed -= 200;
        }

        setTimeout(spawnBug, 200);
    });

    setTimeout(() => {

        if(gameArea.contains(bug)){

            bug.remove();

            missed++;

            document.getElementById("missed").textContent = missed;

            if(missed >= 5){

                gameRunning = false;

                alert("Game Over!\nScore: " + score);

                return;
            }

            spawnBug();
        }

    }, speed);
}