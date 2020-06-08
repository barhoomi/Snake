canvas = document.querySelector('.canvas')
canvas.width = Math.floor(window.innerWidth/25) * 25 - 25;
canvas.height = Math.floor(window.innerHeight/25) * 25 - 25;
var ctx = canvas.getContext('2d');
var score = 0;
var highScore = 0;


window.addEventListener('resize',function(){
    canvas.width = Math.floor(window.innerWidth/25) * 25 - 25;
    canvas.height = Math.floor(window.innerHeight/25) * 25 - 25;
    food = new Food();
});

class Snake {
    constructor(){
        this.body = [];
        this.body[0] = {
            x: (Math.round(canvas.width/2)/25) * 25,
            y: (Math.round(canvas.height/2)/25) * 25,
        };
        this.body[1] = {
            x: (Math.round(canvas.width/2)/25) * 25 + 25,
            y: (Math.round(canvas.height/2)/25) * 25,
        };
        this.body[2] = {
            x: (Math.round(canvas.width/2)/25) * 25 + 50,
            y: (Math.round(canvas.height/2)/25) * 25,
        };
        this.xdir = 0;
        this.ydir = 0;
    }
    eat(){
        food = new Food();
        score += 1;
        this.body[2+score]={
            x: this.body[1+score].x,
            y: this.body[1+score].y,
        }
    }
}

class Food {
    constructor(){
        this.location = {
            x: (Math.floor(Math.random() * Math.floor(canvas.width/ 25)) * 25),
            y: (Math.floor(Math.random() * Math.floor(canvas.height/ 25)) * 25),
        };
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

snake = new Snake();
food = new Food();
var timeStamp = 0;

var handleInput = async function (event){
    keyValue = event.key;
    if(event.timeStamp-timeStamp>50){
        switch(keyValue){
            case "w":
                if(snake.ydir != 1){
                    snake.xdir = 0;
                    snake.ydir = -1;
                    break;
                }
                else{
                    return;
                }
            case "a":
                if(snake.xdir != 1){
                    snake.xdir = -1;
                    snake.ydir = 0;
                    break;
                }
                else{
                    return;
                }
            case "s":
                if(snake.ydir != -1){
                    snake.xdir = 0;
                    snake.ydir = 1;
                    break;
                }
                else{
                    return;
                }
            case "d":
                if(snake.xdir != -1){
                    snake.xdir = 1;
                    snake.ydir = 0;
                    break;
                }
                else{
                    return;
                }
            case "ArrowUp":
                if(snake.ydir != 1){
                    snake.xdir = 0;
                    snake.ydir = -1;
                    break;
                }
                else{
                    return;
                }
            case "ArrowLeft":
                if(snake.xdir != 1){
                    snake.xdir = -1;
                    snake.ydir = 0;
                    break;
                }
                else{
                    return;
                }
            case "ArrowDown":
                if(snake.ydir != -1){
                    snake.xdir = 0;
                    snake.ydir = 1;
                    break;
                }
                else{
                    return;
                }
            case "ArrowRight":
                if(snake.xdir != -1){
                    snake.xdir = 1;
                    snake.ydir = 0;
                    break;
                }
                else{
                    return;
                }
        }
    }
    timeStamp = event.timeStamp;
};  

window.addEventListener('keydown', handleInput, false);
startGame();



async function startGame(){
    while((snake.body[0].x<canvas.width)&&(snake.body[0].y<canvas.height)&&(snake.body[0].y>=0)&&(snake.body[0].x>=0)){      
        await sleep(65);
        moveSnake();
        updateDrawing();
        if((snake.body[0].x==food.location.x)&&((snake.body[0].y==food.location.y))){
            snake.eat();
        }
        detectCollision();
    }
    resetGame();
}

function moveSnake(){
    for (var i = snake.body.length - 1; i > 0; i--) {
        snake.body[i].x = snake.body[(i-1)].x;
        snake.body[i].y = snake.body[(i-1)].y;
    }
    snake.body[0].x += snake.xdir*25;
    snake.body[0].y += snake.ydir*25;
}

function detectCollision(){
    if(score>0){
        for(let i = 1; i<snake.body.length;i++){
            if((snake.body[0].x == snake.body[i].x)&&(snake.body[0].y == snake.body[i].y)){
                // I could use resetGame() here, but it wouldn't exit the while loop if I do that.
                snake.body[0].x = canvas.width+1000;
            }
        }
    }
}

function updateDrawing(){
    drawCanvas();
    drawSnake();
    drawFood();
    updateScore();
}

function drawCanvas(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake(){
    for(x in snake.body){
        ctx.fillStyle = "white";
        ctx.fillRect(snake.body[x].x,snake.body[x].y,23,23);
    }
}

function drawFood(){
    ctx.fillStyle = "red";
    ctx.fillRect(food.location.x,food.location.y,23,23);
}

function updateScore(){
    document.querySelector(".score").innerText = `Score: ${score}`
    if(score > highScore){
        highScore = score;
    }
    document.querySelector(".high-score").innerText = `Highscore: ${highScore}`
}

function resetGame(){
    if(score > highScore){
        highScore = score;
    }
    alert(`You died. Score: ${score}`);
    snake = new Snake();
    food = new Food();
    score = 0;
    updateDrawing();
    startGame();
}



