var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var i;
var j;
var bricks = [];
var ballX = c.width / 2;
var ballY = c.height * (3/4);
var vx = 3;
var vy = 3;
var r = 10;
var num_bricks = 24;
var num_rows = 3;
var bricks_per_row = num_bricks / num_rows;
var w = c.width / bricks_per_row;
var h = 20;
var playerWidth = 120;
var playerHeight = 15;
var playerX = c.width / 2;
var playerY = c.height - playerHeight;
var playerVX = 15;
var score = 0;
var game_over = false;

function initBricks(num_rows, bricks_per_row, w, h){
    for(i = 0; i < num_rows; i++){
        for(j = 0; j < bricks_per_row; j++){
            bricks.push((bricks_per_row * i) + j);
        }
    }
    drawBricks(num_rows, bricks_per_row, w, h);
}

function drawBall(x, y, r=10){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
}

function wall_collision(x, y){
    if(x+vx+r >= c.width || x+vx-r <= 0){ // horizontal side screen collision
        vx = -1 * vx;
    }
    if(y+vy-r <= 0 || y+vy+r >= c.height){ // top collision
        vy = -1 * vy;
    }
}

function playerBounce(px, py, pw, ph, bx, by, r){
    var collide = false;
    if(bx+r >= px && bx+r <= px+pw){ // vertical
        if(by+r >= py && by-r <= py+ph){
            vy = -1 * vy;
        }
    }
}

function get_brick_id(x, y, brick_width, brick_height, bpr){
    var col = Math.floor(x / brick_width);
    var row = Math.floor(y / brick_height);
    var brick_num = (bpr * row) + col;
    return brick_num;
}

function check_brick_collision(brickX, brickY, brick_width, brick_height, bpr, ballX, ballY, r){
    var collision = false;
    if(ballY+r >= brickY && ballY+r <= brickY+brick_height){
        if(ballX+r >= brickX && ballX-r <= brickX+brick_width){ // horizontal collision
            vx = -1 * vx;
            collision = true;
        }
    }
    if(ballX+r >= brickX && ballX+r <= brickX+brick_width){ 
        if(ballY+r >= brickY && ballY-r <= brickY+brick_height){ // vertical collision
            vy = -1 * vy;
            collision = true;
        }
    }
    if(collision == true){
        brick_index = get_brick_id(brickX, brickY, brick_width, brick_height, bpr);
        bricks[brick_index] = -1;
        score++;
    }
}

function drawBricks(num_rows, bricks_per_row, w, h){
    var x = 0;
    var y = 0;
    for(i = 0; i < num_rows; i++){
        for(j = 0; j < bricks_per_row; j++){
            if(bricks[(bricks_per_row * i) + j] != -1){
                check_brick_collision(x, y, w, h, bricks_per_row, ballX, ballY, r);
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.stroke();
            }
            x = x + w;
        }
        x = 0;
        y = y + h;
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
}

function movePlayerold(e){
    e = e || window.event;
    if(e.keyCode == 37 && playerX >= 0){ //left arrow
        playerX -= 5;
    } else if(e.keyCode == 39 && playerX <= c.width){ //right arrow
        playerX += 5;
    }
}

// moves ball, draws everything, and checks for collisions
function drawGame(){
    if(game_over == false){
        ctx.clearRect(0, 0, c.width, c.height);
        playerBounce(playerX, playerY, playerWidth, playerHeight, ballX, ballY, r);
        wall_collision(ballX, ballY);
        ballX = ballX + vx;
        ballY = ballY + vy;
        drawBricks(num_rows, bricks_per_row, w, h);
        drawPaddle();
        drawBall(ballX, ballY);
    }
}

// reference to https://stackoverflow.com/questions/5504510/smooth-keypress-event-handeling-in-javascript
var tickRate = 30,
    keyDown = {},
    keyMap = {
        37: 'left',
        39: 'right',
    };

$('body').keydown(function(e){ keyDown[keyMap[e.which]] = true;  });
$('body').keyup(function(e){   keyDown[keyMap[e.which]] = false; });

var movePlayer = function() {
  if (keyDown['left']) {
    playerX -= 7.5;
  } else if (keyDown['right']) {
    playerX += 7.5;
  }

  setTimeout(movePlayer, tickRate);
};

initBricks(num_bricks, num_rows, w, h);
setInterval(drawGame, 10);
movePlayer();

//TODO:
//add function for speeding up ball
//add game over
//add special bricks