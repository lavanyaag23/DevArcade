const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake = [
    { x: 200, y: 200 }
];

let food = generateFood();

let dx = box;
let dy = 0;

let score = 0;

function generateFood(){
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event){

    if(event.key === "ArrowUp" && dy === 0){
        dx = 0;
        dy = -box;
    }

    else if(event.key === "ArrowDown" && dy === 0){
        dx = 0;
        dy = box;
    }

    else if(event.key === "ArrowLeft" && dx === 0){
        dx = -box;
        dy = 0;
    }

    else if(event.key === "ArrowRight" && dx === 0){
        dx = box;
        dy = 0;
    }
}

function drawGame(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "lime";

    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    let headX = snake[0].x + dx;
    let headY = snake[0].y + dy;

    if(headX === food.x && headY === food.y){
        score++;
        document.getElementById("score").textContent = score;
        food = generateFood();
    }
    else{
        snake.pop();
    }

    const newHead = {
        x: headX,
        y: headY
    };

    if(
        headX < 0 ||
        headY < 0 ||
        headX >= canvasSize ||
        headY >= canvasSize ||
        collision(newHead)
    ){
        clearInterval(game);
        alert("Game Over! Score: " + score);
        return;
    }

    snake.unshift(newHead);
}

function collision(head){

    for(let i = 0; i < snake.length; i++){

        if(
            head.x === snake[i].x &&
            head.y === snake[i].y
        ){
            return true;
        }
    }

    return false;
}

function restartGame(){

    snake = [
        { x: 200, y: 200 }
    ];

    dx = box;
    dy = 0;

    score = 0;

    document.getElementById("score").textContent = score;

    food = generateFood();

    clearInterval(game);
    game = setInterval(drawGame, 120);
}

let game = setInterval(drawGame, 120);