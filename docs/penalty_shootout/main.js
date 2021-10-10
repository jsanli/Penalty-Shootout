title = `
  Pentalty Shootout
`;

description = `

Click To Shoot
`;

characters = [
	`
   `


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
    theme: "dark"
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
let body;
let position = 2;

function update() {
	if (!ticks) {
		
	}
	//create ball net and field
	color("green");
	rect(0, 60, 300, 200);
	color("light_black");
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
	bar(150, 85, 300, 2, 0);
	bar(55, 110, 60, 2, 5.0);
	bar(244, 110, 60, 2, 4.4);
	bar(150, 139, 207, 2, 0);

	body = vec(150, 45);




	//target code
	//loop for deciding shot x
	if(stage == 1){
		//drawgk
		drawHomie(body.x, body.y, position, 0);
		//draw ball
		color("blue");
		arc(ballx, bally, ballSize, 2, 0, 7);
		//draw target
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
		//draw gk
		drawHomie(body.x, body.y, position, 0);
		//draw ball
		color("blue");
		arc(ballx, bally, ballSize, 2, 0, 7);
		//draw target
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
			//generates random gk dive
			position = Math.floor(Math.random() * 5) + 1;
		}
	//shooting 
	}else{
		//draw gk
		drawHomie(body.x, body.y, position, 10-ballSize);
		//move ball until it is at the point of the shot
		color("blue");
		if(!(ballx >= x-1 && ballx <= x+1 && bally >= y-1 && bally <= y+1)){
			//move ball along x and y axises on the right triangle with the hypotenuse being the scalar connecting the ball coordinates and the shooting coordinates
			ballx -= magnitudeX/20;
			bally -= magnitudeY/20;

			//adjust the ball size as it gets closer to the goal
			if(y < 150 && ballSize == 10){
				ballSize--;
			}
			else if(y < 120 && ballSize == 9){
				ballSize--;
			}
			else if(y < 90 && ballSize == 8){
				ballSize--;
			}
			else if(y < 60 && ballSize == 7){
				ballSize--;
			}
			else if(y < 30 && ballSize == 6){
				ballSize--;
			}
			else{
			}

			//draw ball
			color("blue");
			arc(ballx, bally, ballSize, 2, 0, 7);
			//draw target if ball hasn't passed
			if(bally > y){
				color("red");
				arc(x, y, 5, 2, 0, 7);
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
			if(wait == 30){
				stage = 1;
				ballx = 150;
				bally = 180;
				x = 5;
				y = 5;
				ballSize = 10;
				fin = false;
				wait = 1;
			}else{
				wait++;
			}

		}
		//exit but wait for post animation
		else if(over){
			if(wait == 30){
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
		//if shot has hit post or gk
		else if(arc(ballx, bally, ballSize, 2, 0, 7).isColliding.rect.black || arc(ballx, bally, ballSize, 2, 0, 7).isColliding.rect.purple || arc(ballx, bally, ballSize, 2, 0, 7).isColliding.rect.yellow){
			play("hit");
			color("red");
			particle(x, y, 100);
			over = true;
			console.log("black");
		}
		//check if shot has hit goal or not
		else if(arc(ballx, bally, ballSize, 2, 0, 7).isColliding.rect.light_black){	
			play("powerUp");
			color("green");
			particle(x, y, 100);
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

function drawHomie(x, y, pos, frame){
	if(pos == 1 || pos == 2){
		color("purple");
		bar(x - frame * 5 * 2, y + 15, 30, 3, 1.5708 - .261799 * frame);
		if(frame == 0){
			bar(x + cos(1.0472)*10/2, y + 35, 10, 3, 1.0472);
			bar(x - cos(1.0472)*10/2, y + 35, 10, 3, .523599 + 1.5708);
			bar(x - cos(.26199)*15/2, y + 15, 10, 3, .261799);
			bar(x + cos(.26199)*15/2, y + 15, 10, 3, 2.87979);
			color("yellow");
			arc(body.x - frame * 5 * 2, body.y, 5, 9, 0, 7);
		}
		else if(frame == 1){
			bar(x - frame * 5 * 2 + cos(1.0472)*10/2 + 5, y + 35 - 2, 10, 3, 1.0472 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(1.0472)*10/2 + 4, y + 35 - 2, 10, 3, .523599 + 1.5708 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(.26199)*15/2, y + 15 + 3, 10, 3, .261799 - .261799 * frame);
			bar(x - frame * 5 * 2 + cos(.26199)*15/2, y + 15 - 1, 10, 3, 2.87979 - .261799 * frame);
			color("yellow");
			arc(body.x - frame * 5 * 2 - 3, body.y, 5, 9, 0, 7);
		}
		else if(frame == 2){
			bar(x - frame * 5 * 2 + cos(1.0472)*10/2 + 10, y + 35 - 2, 10, 3, 1.0472 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(1.0472)*10/2 + 9, y + 35 - 2, 10, 3, .523599 + 1.5708 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(.26199)*15/2, y + 15 + 5, 10, 3, .261799 - .261799 * frame);
			bar(x - frame * 5 * 2 + cos(.26199)*15/2, y + 15 - 3, 10, 3, 2.87979 - .261799 * frame);
			color("yellow");
			arc(body.x - frame * 5 * 2 - 6, body.y +3, 5, 9, 0, 7);
		}
		else if(frame == 3){
			bar(x - frame * 5 * 2 + cos(1.0472)*10/2 + 16, y + 35 - 7, 10, 3, 1.0472 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(1.0472)*10/2 + 16, y + 35 - 2, 10, 3, .523599 + 1.5708 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(.26199)*15/2, y + 15 + 5, 10, 3, .261799 - .261799 * frame);
			bar(x - frame * 5 * 2 + cos(.26199)*15/2, y + 15 - 3, 10, 3, 2.87979 - .261799 * frame);
			color("yellow");
			arc(body.x - frame * 5 * 2 - 9, body.y +3, 5, 9, 0, 7);
		}
		else if(frame == 4){
			bar(x - frame * 5 * 2 + cos(1.0472)*10/2 + 19, y + 35 - 12, 10, 3, 1.0472 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(1.0472)*10/2 + 17, y + 35 - 9, 10, 3, .523599 + 1.5708 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(.26199)*15/2, y + 15 + 5, 10, 3, .261799 - .261799 * frame);
			bar(x - frame * 5 * 2 + cos(.26199)*15/2 - 5, y + 15 - 7, 10, 3, 2.87979 - .261799 * frame);
			color("yellow");
			arc(body.x - frame * 5 * 2 - 18 + 3, body.y +4, 5, 9, 0, 7);
		}
		else if(frame == 5){
			bar(x - frame * 5 * 2 + cos(1.0472)*10/2 + 17, y + 35 - 17, 10, 3, 1.0472 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(1.0472)*10/2 + 21, y + 35 - 10, 10, 3, .523599 + 1.5708 - .261799 * frame);
			bar(x - frame * 5 * 2 - cos(.26199)*15/2 + 5, y + 15 + 5, 10, 3, .261799 - .261799 * frame);
			bar(x - frame * 5 * 2 + cos(.26199)*15/2 - 5, y + 15 - 7, 10, 3, 2.87979 - .261799 * frame);
			color("yellow");
			arc(body.x - frame * 5 * 2 - 19 + 3, body.y + 9, 5, 9, 0, 7);
		}
	}
	else if(pos == 3){
		color("purple");
		bar(x, y + 15 - (frame * 2.5), 30, 3, 1.5708);
		bar(x + cos(1.0472)*10/2, y + 35 - (frame * 2.5) - frame, 10, 3, 1.0472 - frame *.0872665);
		bar(x - cos(1.0472)*10/2, y + 35 - (frame * 2.5) - frame, 10, 3, .523599 + 1.5708 + frame *.0872665);
		bar(x - cos(.26199)*15/2, y + 15 - (frame * 2.5) - frame, 10, 3, .261799 + frame *.0872665);
		bar(x + cos(.26199)*15/2, y + 15 - (frame * 2.5) - frame , 10, 3, 2.87979 - frame *.0872665);
		color("yellow");
		arc(body.x, body.y - (frame * 2.5), 5, 9, 0, 7);
	}
	else if(pos == 4 || pos == 5){
		color("purple");
		bar(x + frame * 5 * 2, y + 15, 30, 3, 1.5708 + .261799 * frame);
		if(frame == 0){
			bar(x + cos(1.0472)*10/2, y + 35, 10, 3, 1.0472);
			bar(x - cos(1.0472)*10/2, y + 35, 10, 3, .523599 + 1.5708);
			bar(x - cos(.26199)*15/2, y + 15, 10, 3, .261799);
			bar(x + cos(.26199)*15/2, y + 15, 10, 3, 2.87979);
			color("yellow");
			arc(body.x + frame * 5 * 2, body.y, 5, 9, 0, 7);
		}
		else if(frame == 1){
			bar(x + frame * 5 * 2 + cos(1.0472)*10/2 - 4, y + 35 - 2, 10, 3, 1.0472 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(1.0472)*10/2 - 5, y + 35 - 2, 10, 3, .523599 + 1.5708 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(.26199)*15/2, y + 15 - 1, 10, 3, .261799 + .261799 * frame);
			bar(x + frame * 5 * 2 + cos(.26199)*15/2, y + 15 + 3, 10, 3, 2.87979 + .261799 * frame);
			color("yellow");
			arc(body.x + frame * 5 * 2 + 3, body.y, 5, 9, 0, 7);
		}
		else if(frame == 2){
			bar(x + frame * 5 * 2 + cos(1.0472)*10/2 - 9, y + 35 - 2, 10, 3, 1.0472 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(1.0472)*10/2 - 10, y + 35 - 2, 10, 3, .523599 + 1.5708 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(.26199)*15/2, y + 15 - 3, 10, 3, .261799 + .261799 * frame);
			bar(x + frame * 5 * 2 + cos(.26199)*15/2 - 2, y + 15 + 5, 10, 3, 2.87979 + .261799 * frame);
			color("yellow");
			arc(body.x + frame * 5 * 2 + 6, body.y + 3, 5, 9, 0, 7);
		}
		else if(frame == 3){
			bar(x + frame * 5 * 2 + cos(1.0472)*10/2 - 16, y + 35 - 2, 10, 3, 1.0472 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(1.0472)*10/2 - 16, y + 35 - 7, 10, 3, .523599 + 1.5708 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(.26199)*15/2, y + 15 - 3, 10, 3, .261799 + .261799 * frame);
			bar(x + frame * 5 * 2 + cos(.26199)*15/2 -3, y + 15 + 6, 10, 3, 2.87979 + .261799 * frame);
			color("yellow");
			arc(body.x + frame * 5 * 2 + 9, body.y +3, 5, 9, 0, 7);
		}
		else if(frame == 4){
			bar(x + frame * 5 * 2 + cos(1.0472)*10/2 - 17, y + 35 - 9, 10, 3, 1.0472 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(1.0472)*10/2 - 19, y + 35 - 12, 10, 3, .523599 + 1.5708 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(.26199)*15/2, y + 15 - 5, 10, 3, .261799 + .261799 * frame);
			bar(x + frame * 5 * 2 + cos(.26199)*15/2 - 5, y + 15 + 7, 10, 3, 2.87979 + .261799 * frame);
			color("yellow");
			arc(body.x + frame * 5 * 2 + 16, body.y + 7, 5, 9, 0, 7);
		}
		else if(frame == 5){
			bar(x + frame * 5 * 2 + cos(1.0472)*10/2 - 21, y + 35 - 10, 10, 3, 1.0472 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(1.0472)*10/2 - 17, y + 35 - 17, 10, 3, .523599 + 1.5708 + .261799 * frame);
			bar(x + frame * 5 * 2 - cos(.26199)*15/2 + 5, y + 15 -5, 10, 3, .261799 + .261799 * frame);
			bar(x + frame * 5 * 2 + cos(.26199)*15/2 - 5, y + 15 + 7, 10, 3, 2.87979 + .261799 * frame);
			color("yellow");
			arc(body.x + frame * 5 * 2 + 17, body.y + 9, 5, 9, 0, 7);
		}
	}
}




