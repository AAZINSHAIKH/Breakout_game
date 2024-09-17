let canvas:any = document.getElementById("myCanvas");
let con:any  = canvas.getContext("2d");

 
interface Observer{
    update(): any;
}

interface Subject{
    notify(G: Game): any;
}



class Game implements Observer{ 

    Radius:number;
    x:number ;
    y:number ;
    dx:number;
    dy:number;

    brickRowCount :number= 3;
    brickColumnCount :number= 5;
    brickWidth:number= 75;
    brickHeight:number = 20;
    brickPadding:number = 10;
    brickOffsetTop:number = 30;
    brickOffsetLeft:number = 30;
    paddleL :number =90
    paddleW: number = 10;

    rightPressed:boolean = false;
    leftPressed:boolean = false;

    pspeed:number =30 ;
    paddlex:number ;
    paddley:number ;

    bricks: {x: number, y: number,status:number; }[][] = [];

    constructor(){
        
        this.Radius = 10;
        this.x = canvas.width/2;
        this.y= canvas.height-this.Radius-20;
        this.dx = 2;
        this.dy = -2;
        this.paddlex = canvas.width/2 ;
        this.paddley = canvas.height;

        for( let c =0; c<this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for(let r=0; r<this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0 , status:1};
            }
        }


    }

    update(): void {
        con.clearRect(0, 0, canvas.width, canvas.height);
        clearInterval(interval);
        con.font = "30px Arial";
        con.fillText("GAME OVER !!!",canvas.width/2-100,canvas.height/2);
    }




    drawBricks() :void {
        for(let c=0; c<this.brickColumnCount; c++) {
            for(let r=0; r<this.brickRowCount; r++) {
            if(this.bricks[c][r].status==1){
                let brickX = (c*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
                let brickY = (r*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;
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
    }



    public keyDownHandler(e: any):void {  

        if (e.key === "Right" || e.key === "ArrowRight") {
            this.rightPressed = true;
            
            if( this.paddlex+this.pspeed<canvas.width-(this.paddleL/2))
            {
                    // this.rightPressed = true;
                    // this.movepaddle();
                    this.paddlex+=this.pspeed;
            }
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.leftPressed = true;
            this.movepaddle();
        }
    }

    public keyUpHandler(e: any) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.leftPressed = false;
        }
    }

    public movepaddle()
    {
    
        if(this.rightPressed == true)
        { 
            if( this.paddlex+this.pspeed<canvas.width-this.paddleL)
        this.paddlex+=this.pspeed;}
        else if  (this.leftPressed == true) {
                if(this.paddlex-this.pspeed>0+this.paddleL/2)
            { this.paddlex-=this.pspeed;}}
        else {}

    }

    public collided( c:number,r:number)
    {
        this.bricks[c][r].status=0;
        con.beginPath();
        con.clearRect(this.bricks[c][r].x,this.bricks[c][r].y,this.brickWidth,this.brickHeight);
        con.closePath();

    }
    public collisionDetection() {
        for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
            const b = this.bricks[c][r];
            if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
            this.dy = -this.dy;
            this.collided(c,r);
            }
        }
        }
    }


    
    public dp()
    {
        con.beginPath();
        con.rect(this.paddlex-this.paddleL/2, this.paddley-this.paddleW, this.paddleL, this.paddleW);
        con.fillStyle = "red";
        con.fill();
        con.closePath();
    }


    public createPaddle()
    {   con.beginPath();
        con.moveTo(this.paddlex - this.paddleL/2, this.paddley-10);
        con.lineTo(this.paddlex + this.paddleL, this.paddley-10);
        con.lineWidth=10;
        con.strokeStyle='red';
        con.stroke();
        con.closePath();

    }

    public MakeBall() {
        con.beginPath();
        con.arc(this.x, this.y, this.Radius, 0, Math.PI*2);
        con.fillStyle = "red";
        con.fill();
        con.closePath();
    }
 
}



class Timer implements Subject{
    G: Game;
    T: any;
    constructor(G: Game){
        this.G = G;
    }
    
    notify = (G: Game) => {        
        G.update();
    }

    public startTimer = (duration: any, display: any) => {
        let timer : any= duration, seconds;
        let xtime = setInterval( () => {
                seconds = (timer % 60) | 0;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = seconds;

            
                if (--timer < 0) {
                    this.T.notify(this.G);

                    clearInterval(xtime);
                }
            }, 1000);
    }

}
const G: Game = new Game();

function draw() {
    
    con.clearRect(0, 0, canvas.width, canvas.height);    
    G.drawBricks();
    G.dp();
    G.MakeBall();
    G.collisionDetection();

    if(G.x + G.dx > canvas.width-G.Radius || G.x + G.dx < G.Radius ) {
        G.dx = -G.dx;
    }
 
    if(G.y + G.dy < G.Radius) {
        G.dy = -G.dy;
    }
    else if(G.y +G.dy > canvas.height-G.Radius-10) {
        if(G.x > G.paddlex-G.paddleL/2 && G.x < G.paddlex + G.paddleL/2) {
            G.dy = -G.dy;
        }
        else
        {
            G.update();

        }
    }
    else {}


    G.x += G.dx;
    G.y += G.dy;
}

document.addEventListener("keydown", G.keyDownHandler.bind(G));
document.addEventListener("keyup", G.keyUpHandler.bind(G));

let interval:any;
let T: Timer = new Timer(G);
interval = setInterval(draw, 12);



window.onload = function () {
    let fiveMinutes = 10,
    display = document.querySelector('#time');
    const TX = T.startTimer.bind(T);
    TX(fiveMinutes, display);
};