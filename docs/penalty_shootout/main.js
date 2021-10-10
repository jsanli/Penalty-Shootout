title = `
  Pentalty Shootout
`;

description = `

Click To Shoot
`;

characters = [
];

options = {};

const G = {
	WIDTH: 300,
	HEIGHT: 200,
};

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true,
    isReplayEnabled: true,
	isDrawingParticleFront: true,
    theme: "shape"
};

let x = 5;
let y = 5;
let stage = 1;
let ballx = 150;
let bally = 180;
let ballSize = 10;
let magnitudeX;
let magnitudeY;
let fin = false;
let over = false;
let wait = 1;

function update() {
	if (!ticks) {
		
	}
	//create ball net and field
	color("light_black")
	for(let i = 72; i < 235; i+=5){
		box(i, 49, 1, 69);
	}
	for(let j = 24; j < 87; j+= 5){
		box(150, j, 175, 1);
	}
	color("black");
	box(65, 50, 5, 70);
	box(235, 50, 5, 70);
	box(150, 17, 175, 5);
	color("black");
	bar(150, 85, 300, 1, 0);
	bar(55, 110, 60, 1, 5.0);
	bar(244, 110, 60, 1, 4.4);
	bar(150, 139, 207, 1, 0);

	//target code
	//loop for deciding shot x
	if(stage == 1){
		color("blue");
		arc(ballx, bally, ballSize, 2, 0, 7);
		color("red");
		arc(x, 50, 5, 2, 0, 7);
		//increments target x by 10 and resets when off screen
		if(x < 296){
			x+=7.5;
		}
		else{
			x = 0;
		}
		//moves to y when clicked
		if(input.isJustPressed){
			stage++;
		}
	}
	//loop for deciding shot x
	else if(stage == 2){
		color("blue");
		arc(ballx, bally, ballSize, 2, 0, 7);
		color("red");
		arc(x, y, 5, 2, 0, 7);
		//increments target y by 10 and resets when off goal 
		if(y < 70){
			y+=5;
		}
		else{
			y = 0;
		}
		//moves to shooting stage after clicked
		if(input.isJustPressed){
			stage++;
			magnitudeX = ballx - x;
			magnitudeY = bally - y;

		}
	//shooting 
	}else{
		//move ball until it is at the point of the shot
		color("blue");
		if(!(ballx >= x-1 && ballx <= x+1 && bally >= y-1 && bally <= y+1)){
			//draw ball
			color("blue");
			arc(ballx, bally, ballSize, 2, 0, 7);
			//draw target if ball hasn't passed
			if(bally > y){
				color("red");
				arc(x, y, 5, 2, 0, 7);
			}
			//move ball along x and y axises on the right triangle with the hypotenuse being the scalar connecting the ball coordinates and the shooting coordinates
			ballx -= magnitudeX/20;
			bally -= magnitudeY/20;
			//console.log(x, y, ballx, bally);

			//adjust the ball size as it gets closer to the goal
			if(y< 150 && ballSize == 10){
				ballSize--;
			}
			else if(y< 120 && ballSize == 9){
				ballSize--;
			}
			else if(y< 90 && ballSize == 8){
				ballSize--;
			}
			else if(y< 60 && ballSize == 7){
				ballSize--;
			}
			else if(y< 30 && ballSize == 6){
				ballSize--;
			}

			//end if ball is off screen
			if(ballx < -30 || ballx > 330 || bally < -30){
				play("hit")
				stage = 1;
				ballx = 150;
				bally = 180;
				x = 5;
				y = 5;
				ballSize = 10;
				end();
			}
		}
		//reset to stage 1
		else if(fin){
				stage = 1;
				ballx = 150;
				bally = 180;
				x = 5;
				y = 5;
				ballSize = 10;
				fin = false;
		}
		//exit but wait for post animation
		else if(over){
			if(wait == 20){
				stage = 1;
				ballx = 150;
				bally = 180;
				x = 5;
				y = 5;
				ballSize = 10;
				over = false;
				wait = 1;
				end();
			}
			else{
				wait++;
			}
		}
		//if shot has hit post
		else if(arc(ballx, bally, ballSize, 2, 0, 7).isColliding.rect.black){
			play("hit");
			color("red");
			particle(x,y);
			over = true;
			console.log("black");
		}
		//check if shot has hit goal or not
		else if(arc(ballx, bally, ballSize, 2, 0, 7).isColliding.rect.light_black){
			play("powerUp");
			color("green");
			particle(x,y);
			fin = true;
			console.log("light black");
			addScore(1);
		}
		//if not hit goal continue to show shot going off screen
		else{ 
			color("blue");
			arc(ballx, bally, ballSize, 2, 0, 7);
			ballx -= magnitudeX/20;
			bally -= magnitudeY/20;
		}
	}
}



