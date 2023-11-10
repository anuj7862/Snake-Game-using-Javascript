
const playBoard = document.querySelector(".playBoard");
const scoreEle = document.querySelector(".score");
const highestScoreEle = document.querySelector(".highestScore");
const pauseBtn = document.querySelector('.pauseBtn');
const gameOver = document.querySelector('.gameOver');
const restartBtn = document.querySelector('.restartBtn');
const options = document.querySelector('.options');
const classicMode = document.querySelector('#classic');
const arcadeMode = document.querySelector('#arcade');
const levelEle = document.querySelector('.level');
const head = document.querySelector('.head');
const tail = document.querySelector('.tail');
const goToMenu = document.querySelector('.goToMenu');
const levelUp = document.querySelector('.fa-caret-up');
const levelDown = document.querySelector('.fa-caret-down');

console.log(head, tail);
const initialSpeed = 300;

let speed = initialSpeed;
let foodR, foodC;
let row = 30,col = 40;
let snakeR= 15, snakeC=20;
let speedR = 0, speedC = 0, pause = true;
let score = 0;
let oldSpeedR, oldSpeedC;
let snake = []; 
let direction = '';
let boundary = "notset";
let gameOverFlag = false;
let level = 1;

let interval;
let changeDirInterval; // used for throttling (to control if used changes direaction too quickly)

let highestScore;
if(localStorage.getItem('highestScore')){ // check for highest score in local storage
    highestScore = localStorage.getItem('highestScore');
}
else {
    highestScore = 0;
    localStorage.setItem('highestScore', 0);
}
highestScoreEle.innerHTML = `Highest Score: ${highestScore}`;  //update highest score in html...


const createFood = () => {
    if(boundary){
        foodR = Math.floor(Math.random()*(row-2)) + 2;
        foodC = Math.floor(Math.random()*(col-2)) + 2;
    }
    else {
        foodR = Math.floor(Math.random()*row) + 1;
        foodC = Math.floor(Math.random()*col) + 1;
    }
};


const changeDir = (e) => {
    if(changeDirInterval) // condition for throttling
        return;
    
    //space is used for pause/unpause
    if(e.code === "Space"){
        if(!pause){
            oldSpeedC = speedC;
            oldSpeedR = speedR;
            speedR = 0;
            speedC = 0;
            pause = true;
            pauseBtn.style.opacity = 1;
            playBoard.style.filter = 'blur(10px)';
        }
        else {
            pause = false;
            speedC = oldSpeedC;
            speedR = oldSpeedR;
            pauseBtn.style.opacity = 0;
            playBoard.style.filter = 'none';
        }

    }
    else if(pause)
        return;
    //W A S D and arrow keys are used for controls.
    else if(direction !== 'up' && direction !== 'down' && (e.code === "ArrowDown" || e.code === "KeyS") )
    {
        speedR = 1;
        speedC = 0;
        direction = 'down';
    }
    else if(direction !== 'down' && direction !== 'up' && (e.code === "ArrowUp" || e.code === "KeyW"))
    {
        speedR = -1;
        speedC = 0;
        direction = 'up';
    }
    else if(direction !== 'right' && direction !== 'left' && (e.code === "ArrowLeft" || e.code === "KeyA"))
    {
        speedR = 0;
        speedC = -1;
        direction = 'left';
    }
    else if(direction !== 'left' && direction !== 'right' && (e.code === "ArrowRight" || e.code === "KeyD"))
    {
        speedR = 0;
        speedC = 1;
        direction = 'right';
    }
    else {
        return; // if no condition statisfy : no throttling
    }
    changeDirInterval = setTimeout(() =>{
        changeDirInterval = null;
    }, speed/2); // user will not able to change direction for next speed/2 ms.
    
    
}

const checkGameOver = () => {
    if(gameOverFlag)
        return;
    if(boundary){  //if arcade mode is used to check collision with walls
        let r = snakeR + speedR;
        let c = snakeC + speedC;
        //console.log(r ,c);
        if(r > row || r< 1 || c > col || c <1){
            pause = true;
            gameOver.style.display = 'flex';
            playBoard.style.filter = 'blur(10px)';
            gameOverFlag = true;
            return;
        }
    }

    for(let i=1;i<snake.length;i++){  //check snake collision with its own body
        if(snake[i][0] === snakeR && snake[i][1] === snakeC){
            pause = true;
            //pauseBtn.style.opacity = 1;
            gameOver.style.display = 'flex';
            playBoard.style.filter = 'blur(10px)';
            gameOverFlag = true;
            return;
        }
    }
}

const pauseClick = () => {
    if(pause){
            pause = false;
            speedC = oldSpeedC;
            speedR = oldSpeedR;
            pauseBtn.style.opacity = 0;
            playBoard.style.filter = 'none';
    }
}

const keepItInside = () => { //if classic mode is used
    if(snakeR === 0)
        snakeR = row;
    else if(snakeR === row+1)
        snakeR = 1;

    if(snakeC === 0)
        snakeC = col;
    else if(snakeC === col+1)
        snakeC = 1;
}

const restartGame = () => {
    resetValues();
    pause = false;
    playBoard.style.filter = 'none';
}

const setModeClassic = () => {
        boundary = false;
        pause = false;
        options.style.display = 'none';
        playBoard.style.filter = 'none';
}

const setModeArcade = () => {
        boundary = true;
        pause = false;
        options.style.display = 'none';
        playBoard.style.filter = 'none';
}

const changeCSS = () => {// to change the border radius of snake head
    let head = document.querySelector('.head');
    let tail = document.querySelector('.tail');
    if(direction === 'up'){
        head.style.borderRadius = '10rem 10rem 0 0';
        //tail.style.borderRadius = '0 0 10rem 10rem';
    }
    else if(direction === 'down'){
        head.style.borderRadius = '0 0 10rem 10rem';
        //tail.style.borderRadius = '10rem 10rem 0 0';
    }
    else if(direction === 'right'){
        head.style.borderRadius = '0 10rem 10rem 0';
        //tail.style.borderRadius = '10rem 0 0 10rem';
    }
    else if(direction === 'left'){
        head.style.borderRadius = '10rem 0 0 10rem';
        //tail.style.borderRadius = '0 10rem 10rem 0';
    }
    
}

const toMainMenu = () => {
    resetValues();
    pause = true;
    options.style.display = 'unset';
    playBoard.style.filter = 'blur(10px)';    
}

const levelUpFunc = () => {
    level += 1;
    levelEle.innerHTML = `Level: ${level}`; 
    changeLevelAndSetNewInterval();
}
const levelDownFunc = () => {
    if(level !== 1){
        level -= 1;
        levelEle.innerHTML = `Level: ${level} `; 
        changeLevelAndSetNewInterval();
    }
}

const changeLevelAndSetNewInterval = () => {
    speed = initialSpeed/(level*0.6);
    clearInterval(interval);   // clear main function Interval
    interval = setInterval(init, speed); // creating new interval with updated speed value for main function
}

const resetValues = () => {
    //reset all variable to initial values.
    snakeR =15; snakeC = 20;
    speedR =0; speedC = 0;
    score = 0;
    direction = '';
    level = 1;
    speed = initialSpeed;
    snake = [];
    gameOverFlag = false;

    gameOver.style.display = 'none';
    levelEle.innerHTML = `Level: ${level}`; 
    scoreEle.innerHTML = `Score: ${score}`;

    createFood();
    snake.push([snakeR, snakeC]);
    changeLevelAndSetNewInterval();
}

createFood();  // call it for first time food
snake.push([snakeR, snakeC]); // push initial position to snake array


//main function with run in every speed(variable) ms....
const init = () => {
    if(foodR === snakeR && foodC === snakeC){  
        // condition to check if snake eat the food
        score++;
        if(score > highestScore){ // to update highest score
            highestScore = score;
            localStorage.setItem('highestScore', highestScore);
        }
        let temp = Math.floor(score/(4*Math.pow(2,level-1)));
        if(temp>0){  // to update the level on score 5 10 20 40....
            level += 1;
            changeLevelAndSetNewInterval();
        }

        // updating html part
        scoreEle.innerHTML = `Score: ${score}`;
        highestScoreEle.innerHTML = `Highest Score: ${highestScore}`;
        levelEle.innerHTML = `Level: ${level}`; 
        snake.push([foodR, foodC]);
        createFood(); //create new food
        //console.log(speed);
    }

    if(!pause){
        for(let i= snake.length-1;i>0;i--)
            snake[i] = snake[i-1]; // move snake body
    }   
    if(!pause){ //update snake head position
        snakeR += speedR;
        snakeC += speedC;
    }  
    checkGameOver(); 
    keepItInside();

    if(!gameOverFlag && !pause) {  // put head position to snake arr at index zero
        snake[0] = [snakeR, snakeC];

        //update html for play grid with food and snake body...
        html= `<div class="food" style="grid-area: ${foodR} /${foodC}"></div>`; 
        
        if(boundary === true){ // creating walls if arcade mode is selected
            for(let i=1;i<=row;i++){
                html += `<div class="boundry" style="grid-area: ${i} /${1}"></div>`;
                html += `<div class="boundry" style="grid-area: ${i} /${col}"></div>`;
            }
            for(let i=2;i<col;i++){
                html += `<div class="boundry" style="grid-area: ${1} /${i}"></div>`;
                html += `<div class="boundry" style="grid-area: ${row} /${i}"></div>`;
            }
        }
         html += `<div class="head" style="grid-area: ${snake[0][0]} /${snake[0][1]}"><div class="snakeEye"></div></div>`;
        for(let i=1;i<snake.length-1; i++) { // updating snake body in html play board
            html += `<div class="middle${i%2+1}" style="grid-area: ${snake[i][0]} /${snake[i][1]}"></div>`;
        };
        if(snake.length != 1)
            html += `<div class="tail" style="grid-area: ${snake[snake.length-1][0]} /${snake[snake.length-1][1]}"></div>`;
        
        playBoard.innerHTML = html; // update playboard innerHtml
        changeCSS();
    }

}

interval = setInterval(init, speed); // init funcion will run in every ${speed} ms..
//init();

//adding event listener
document.addEventListener('keydown', changeDir);
pauseBtn.addEventListener('click', pauseClick);
restartBtn.addEventListener('click',restartGame);
classicMode.addEventListener('click',setModeClassic);
arcadeMode.addEventListener('click',setModeArcade);
goToMenu.addEventListener('click', toMainMenu);
levelUp.addEventListener('click', levelUpFunc);
levelDown.addEventListener('click', levelDownFunc);