var canvas = document.getElementById("myCanvas");
var con = canvas.getContext("2d");
var Game = /** @class */ (function () {
    function Game() {
        this.brickRowCount = 3;
        this.brickColumnCount = 5;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        this.paddleL = 90;
        this.paddleW = 10;
        this.rightPressed = false;
        this.leftPressed = false;
        this.pspeed = 30;
        this.bricks = [];
        this.Radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height - this.Radius - 20;
        this.dx = 2;
        this.dy = -2;
        this.paddlex = canvas.width / 2;
        this.paddley = canvas.height;
        for (var c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (var r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }
    Game.prototype.update = function () {
        con.clearRect(0, 0, canvas.width, canvas.height);
        clearInterval(interval);
        con.font = "30px Arial";
        con.fillText("GAME OVER !!!", canvas.width / 2 - 100, canvas.height / 2);
    };
    Game.prototype.drawBricks = function () {
        for (var c = 0; c < this.brickColumnCount; c++) {
            for (var r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status == 1) {
                    var brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    var brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    con.beginPath();
                    con.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    con.fillStyle = "#0095DD";
                    con.fill();
                    con.closePath();
                }
            }
        }
    };
    Game.prototype.keyDownHandler = function (e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.rightPressed = true;
            if (this.paddlex + this.pspeed < canvas.width - (this.paddleL / 2)) {
                // this.rightPressed = true;
                // this.movepaddle();
                this.paddlex += this.pspeed;
            }
        }
        else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.leftPressed = true;
            this.movepaddle();
        }
    };
    Game.prototype.keyUpHandler = function (e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.rightPressed = false;
        }
        else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.leftPressed = false;
        }
    };
    Game.prototype.movepaddle = function () {
        if (this.rightPressed == true) {
            if (this.paddlex + this.pspeed < canvas.width - this.paddleL)
                this.paddlex += this.pspeed;
        }
        else if (this.leftPressed == true) {
            if (this.paddlex - this.pspeed > 0 + this.paddleL / 2) {
                this.paddlex -= this.pspeed;
            }
        }
        else { }
    };
    Game.prototype.collided = function (c, r) {
        this.bricks[c][r].status = 0;
        con.beginPath();
        con.clearRect(this.bricks[c][r].x, this.bricks[c][r].y, this.brickWidth, this.brickHeight);
        con.closePath();
    };
    Game.prototype.collisionDetection = function () {
        for (var c = 0; c < this.brickColumnCount; c++) {
            for (var r = 0; r < this.brickRowCount; r++) {
                var b = this.bricks[c][r];
                if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
                    this.dy = -this.dy;
                    this.collided(c, r);
                }
            }
        }
    };
    Game.prototype.dp = function () {
        con.beginPath();
        con.rect(this.paddlex - this.paddleL / 2, this.paddley - this.paddleW, this.paddleL, this.paddleW);
        con.fillStyle = "red";
        con.fill();
        con.closePath();
    };
    Game.prototype.createPaddle = function () {
        con.beginPath();
        con.moveTo(this.paddlex - this.paddleL / 2, this.paddley - 10);
        con.lineTo(this.paddlex + this.paddleL, this.paddley - 10);
        con.lineWidth = 10;
        con.strokeStyle = 'red';
        con.stroke();
        con.closePath();
    };
    Game.prototype.MakeBall = function () {
        con.beginPath();
        con.arc(this.x, this.y, this.Radius, 0, Math.PI * 2);
        con.fillStyle = "red";
        con.fill();
        con.closePath();
    };
    return Game;
}());
var Timer = /** @class */ (function () {
    function Timer(G) {
        var _this = this;
        this.notify = function (G) {
            G.update();
        };
        this.startTimer = function (duration, display) {
            var timer = duration, seconds;
            var xtime = setInterval(function () {
                seconds = (timer % 60) | 0;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                display.textContent = seconds;
                if (--timer < 0) {
                    _this.T.notify(_this.G);
                    clearInterval(xtime);
                }
            }, 1000);
        };
        this.G = G;
    }
    return Timer;
}());
var G = new Game();
function draw() {
    con.clearRect(0, 0, canvas.width, canvas.height);
    G.drawBricks();
    G.dp();
    G.MakeBall();
    G.collisionDetection();
    if (G.x + G.dx > canvas.width - G.Radius || G.x + G.dx < G.Radius) {
        G.dx = -G.dx;
    }
    if (G.y + G.dy < G.Radius) {
        G.dy = -G.dy;
    }
    else if (G.y + G.dy > canvas.height - G.Radius - 10) {
        if (G.x > G.paddlex - G.paddleL / 2 && G.x < G.paddlex + G.paddleL / 2) {
            G.dy = -G.dy;
        }
        else {
            G.update();
        }
    }
    else { }
    G.x += G.dx;
    G.y += G.dy;
}
document.addEventListener("keydown", G.keyDownHandler.bind(G));
document.addEventListener("keyup", G.keyUpHandler.bind(G));
var interval;
var T = new Timer(G);
interval = setInterval(draw, 12);
window.onload = function () {
    var fiveMinutes = 10, display = document.querySelector('#time');
    var TX = T.startTimer.bind(T);
    TX(fiveMinutes, display);
};
