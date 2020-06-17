canvas = document.querySelector('.canvas')
canvas.width = Math.floor(window.innerWidth/25) * 25 - 25;
canvas.height = Math.floor(window.innerHeight/25) * 25 - 25;
var ctx = canvas.getContext('2d');
var score = 0;
var highScore = 0;
var timeStamp = 0;


window.addEventListener('resize',function(){
    canvas.width = Math.floor(window.innerWidth/25) * 25 - 25;
    canvas.height = Math.floor(window.innerHeight/25) * 25 - 25;
    food = new Food();
});

class Snake {
    constructor(){
        this.isInCanvas = true;
        this.body = [];
        this.body[0] = {
            x: (Math.round(canvas.width/2)/25) * 25,
            y: (Math.round(canvas.height/2)/25) * 25,
        };
        this.body[1] = {
            x: this.body[0].x,
            y: this.body[0].y,
        };
        this.body[2] = {
            x: this.body[0].x,
            y: this.body[0].y,
        };
        this.xdir = 0;
        this.ydir = 0;
    }
    eat(){
        if((this.body[0].x==food.location.x)&&((this.body[0].y==food.location.y))){
            food = new Food();
            score += 1;
            this.body[2+score]={
                x: this.body[1+score].x,
                y: this.body[1+score].y,
            }
        }
        else{
            return;
        }
    }

    move(){
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[(i-1)].x;
            this.body[i].y = this.body[(i-1)].y;
        }
        this.body[0].x += this.xdir*25;
        this.body[0].y += this.ydir*25;
    }

    detectCollision(){
        if(score>0){
            for(let i = 1; i<this.body.length;i++){
                if((this.body[0].x == this.body[i].x)&&(this.body[0].y == this.body[i].y)){
                    // I could use resetGame() here, but it wouldn't exit the while loop if I do that.
                    this.body[0].x = canvas.width+1000;
                }
            }
        }
    }

    draw(){
        ctx.fillStyle="white";
        for(let x = 0;x<this.body.length;x++){
            ctx.fillRect(this.body[x].x,this.body[x].y,23,23);
        }
    }

    checkLocation(){
        this.isInCanvas = !!(this.body[0].x<canvas.width)&&(this.body[0].y<canvas.height)&&(this.body[0].y>=0)&&(this.body[0].x>=0)
    }
}

class Food {
    constructor(){
        this.location = {
            x: (Math.floor(Math.random() * Math.floor(canvas.width/ 25)) * 25),
            y: (Math.floor(Math.random() * Math.floor(canvas.height/ 25)) * 25),
        };
        for(let s=1;s<snake.body.length;s++){
            if(((this.location.x)==snake.body[s].x)&&((this.location.y)==snake.body[s].y)){
                food = new Food();
                break;
            }
        }
    }

    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.location.x,this.location.y,23,23);
    }
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

snake = new Snake();
food = new Food();


function updateDrawing(){
    drawCanvas();
    snake.draw();
    food.draw();
    updateScore();
}

function drawCanvas(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function updateScore(){
    document.querySelector(".score").innerText = `Score: ${score}`
    if(score > highScore){
        highScore = score;
    }
    document.querySelector(".high-score").innerText = `Highscore: ${highScore}`
}


var handleInput = async function (event){
    keyValue = event.key;
    if(event.timeStamp-timeStamp>50){
        switch(keyValue){
            case "w":
            case "ArrowUp":
                if(snake.ydir != 1){
                    snake.xdir = 0;
                    snake.ydir = -1;
                    break;
                }
                else{
                    return;
                }
            case "a":
            case "ArrowLeft":
                if(snake.xdir != 1){
                    snake.xdir = -1;
                    snake.ydir = 0;
                    break;
                }
                else{
                    return;
                }
            case "s":
            case "ArrowDown":
                if(snake.ydir != -1){
                    snake.xdir = 0;
                    snake.ydir = 1;
                    break;
                }
                else{
                    return;
                }
            case "d":
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

function showDeathScreen(){
    let deathscreen = document.querySelector('.death-screen');
    let deathbox = document.querySelector('.box');
    deathscreen.style.display = "flex";
    deathbox.style.display = "flex";
    document.querySelector(".score").innerText = '';
    document.querySelector(".high-score").innerText = '';
}

function hideDeathScreen(){
    let deathscreen = document.querySelector('.death-screen');
    let deathbox = document.querySelector('.box');
    deathscreen.style.display = "none";
    deathbox.style.display = "none";
    document.querySelector(".score").innerText = score;
    document.querySelector(".high-score").innerText = highScore;
}

window.addEventListener('keydown', handleInput, false);


var finishedRunning = true;

async function startGame(){
    while(snake.isInCanvas){   
        finishedRunning = false;   
        await sleep(65);
        snake.move();
        updateDrawing();
        snake.eat();
        updateDrawing();
        snake.detectCollision();
        updateDrawing();
        snake.checkLocation();
        finishedRunning = true;
    }
    showDeathScreen();
    document.querySelector('.respawn-button').addEventListener('click', function(){
        resetGame();
    });
    document.addEventListener('keydown', function(event){
        let spaceKeyCode = 32;
        if(event.keyCode == spaceKeyCode){
            resetGame();
        }
    });
};

function resetGame(){
    hideDeathScreen();
    if(score > highScore){
        highScore = score;
    }
    // alert(`You died. Score: ${score}`);
    score = 0;
    snake = new Snake();
    food = new Food();
    updateDrawing();
    if(finishedRunning == true){
        startGame();
    }
}


startGame();