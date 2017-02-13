import React from 'react';
import ReactDOM from 'react-dom';

//css green '#4abd12'
/*TODO: 
	visual mode decide on degrees of freedom. 
		Instructions on first time access to website (on refresh no instructions), new tab, etc.
		sit through instructions without starting game
		high score visual mode, normal mode, replace score <2> banner
		stereo into right and left ear if you are about to run into a bullet. if bullet is on your left then signal noise on that side. detect? via check if right position or left position + velocity has it, if collision, then play noise and do not move

		bugs:
		enemies randomly dissapear??!!!


	normal mode
		Adjust regular parameters
*/

export default class Game extends React.Component
{
	constructor(props)
	{
		var types = {
			MODE: {normal: 0, visual: 1}
		};
		var sets = {
			numenemy: [ [11],[6] ],
			enemyx: [
					//[75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30],
					[75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30],
					[75+2*30, 145+2*30, 215+2*30,285+2*30,355+2*30, 425+2*30]
				],
			enemyy: [
                                        [ [5+1*30, 5+1*30, 5+1*30, 5+1*30, 5+1*30, 5+1*30,5+1*30,5+1*30,5+1*30,5+1*30,5+1*30],
                                                [55+1*30, 55+1*30, 55+1*30, 55+1*30, 55+1*30, 55+1*30,55+1*30,55+1*30,55+1*30,55+1*30,55+1*30],
                                                [105+1*30, 105+1*30, 105+1*30, 105+1*30, 105+1*30, 105+1*30,105+1*30,105+1*30,105+1*30,105+1*30,105+1*30],
                                                [155+1*30, 155+1*30, 155+1*30, 155+1*30, 155+1*30, 155+1*30,155+1*30,155+1*30,155+1*30,155+1*30,155+1*30],
                                                [205+1*30, 205+1*30, 205+1*30, 205+1*30, 205+1*30, 205+1*30,205+1*30,205+1*30,205+1*30,205+1*30,205+1*30]
                                        ],
                                        [ [5+1*30, 5+1*30, 5+1*30,5+1*30,5+1*30,5+1*30],
                                                [55+1*30,55+1*30,55+1*30,55+1*30,55+1*30,55+1*30],
                                                [105+1*30,105+1*30,105+1*30,105+1*30,105+1*30,105+1*30],
                                                [155+1*30,155+1*30,155+1*30,155+1*30,155+1*30,155+1*30],
                                                [205+1*30,205+1*30,205+1*30,205+1*30,205+1*30,205+1*30]
                                        ]
				]
		};
		var speeds = [6, 1], bveloc = [10, 30], playerspeeds=[5, 1.5];//.25
		super(props);
		this.state={
			vIndexOne: -1, vIndexTwo: -1,
			lastvisualspeech: -1, visual: types.MODE[this.props.mode],
			x_tanh:-3.5, ogx_tanh: -3.5, xinterval_tanh: .1, //12/100/2/2
			requestid: null, lowlimit: 15, maxexv: 1/2, 
			maxlowlimit: 3, //more properly min
			maxfireRate: .5,//10?//change
			notimes: 0, numdead: 0, pastnumdead: 0, 
			lvlclear: false, lifelost: false, gameover: false, set: false,
			numberlives: 3, credit: 4, rmEnemy: true, bullettimer: null, start: false, stagger: 0,
			/*
				meta: height: 200px, width: 800px;
				Field: height: 600px, width: 800px; see ../public/styles.css
			*/
			canvas: <canvas id="Field" height={600} width={600} ></canvas>,
			height: 600, width: 600,
			ctx: '', interval: null, score: 0, highscore: 0, 
			numEnemies: sets.numenemy[ types.MODE[this.props.mode] ] ,
			ogx: 105, ogy: 500,
			x: 105, y:500, xvelocity: 0, ogxvelocity: playerspeeds[types.MODE[this.props.mode]],
			bx: 10, by: 10, fired: false, bsize: 5, bvelocity: bveloc[types.MODE[this.props.mode]],
			ogvenemyx: [[75+2*30, 145+2*30, 215+2*30,285+2*30,355+2*30, 425+2*30], 
				[75+2*30, 145+2*30, 215+2*30,285+2*30,355+2*30, 425+2*30], 
				[75+2*30, 145+2*30, 215+2*30,285+2*30,355+2*30, 425+2*30],
				[75+2*30, 145+2*30, 215+2*30,285+2*30,355+2*30, 425+2*30],
				[75+2*30, 145+2*30, 215+2*30,285+2*30,355+2*30, 425+2*30]],
			ogvenemyy: 
                                        [ [5+1*30, 5+1*30, 5+1*30,5+1*30,5+1*30,5+1*30],
                                                [55+1*30,55+1*30,55+1*30,55+1*30,55+1*30,55+1*30],
                                                [105+1*30,105+1*30,105+1*30,105+1*30,105+1*30,105+1*30],
                                                [155+1*30,155+1*30,155+1*30,155+1*30,155+1*30,155+1*30],
                                                [205+1*30,205+1*30,205+1*30,205+1*30,205+1*30,205+1*30]
                                        ],
			ogenemyx: [ [75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30],
				[75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30],
				[75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30],
				[75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30],
				[75+2*30, 110+2*30, 145+2*30, 180+2*30, 215+2*30,250+2*30,285+2*30,320+2*30,355+2*30, 390+2*30, 425+2*30]
				], 
			ogenemyy: [ 
						[5+1*30, 5+1*30, 5+1*30, 5+1*30, 5+1*30, 5+1*30,5+1*30,5+1*30,5+1*30,5+1*30,5+1*30],
                                                [55+1*30, 55+1*30, 55+1*30, 55+1*30, 55+1*30, 55+1*30,55+1*30,55+1*30,55+1*30,55+1*30,55+1*30],
                                                [105+1*30, 105+1*30, 105+1*30, 105+1*30, 105+1*30, 105+1*30,105+1*30,105+1*30,105+1*30,105+1*30,105+1*30],
                                                [155+1*30, 155+1*30, 155+1*30, 155+1*30, 155+1*30, 155+1*30,155+1*30,155+1*30,155+1*30,155+1*30,155+1*30],
                                         	[205+1*30, 205+1*30, 205+1*30, 205+1*30, 205+1*30, 205+1*30,205+1*30,205+1*30,205+1*30,205+1*30,205+1*30]
				],
			enemyx: [  sets.enemyx[types.MODE[this.props.mode]], 
					sets.enemyx[types.MODE[this.props.mode]],
					sets.enemyx[types.MODE[this.props.mode]],
					sets.enemyx[types.MODE[this.props.mode]],
					sets.enemyx[types.MODE[this.props.mode]]
				], 
			enemyy: [ sets.enemyy[types.MODE[this.props.mode]][0],
					sets.enemyy[types.MODE[this.props.mode]][1],
					sets.enemyy[types.MODE[this.props.mode]][2],
					sets.enemyy[types.MODE[this.props.mode]][3],
					sets.enemyy[types.MODE[this.props.mode]][4]
				],
			lowerx: 0, upperx: 0, //keep track of moving left and right
			enemyState: [new Array(11), new Array(11), new Array(11), new Array(11), new Array(11)],
			enemyFired: [new Array(11), new Array(11), new Array(11), new Array(11), new Array(11)],
			enemybx: [new Array(11), new Array(11), new Array(11), new Array(11), new Array(11)],
			enemyby: [new Array(11), new Array(11), new Array(11), new Array(11), new Array(11)],
			ebStagger: [new Array(11), new Array(11), new Array(11), new Array(11), new Array(11)],
			ebv: speeds[types.MODE[this.props.mode]], //speeds[this.props.mode],//enemy bullet velocity
			ebsize: 10,//enemy bullet size
			ebulletsfired: 0, //at max there can be three
			specialEnemyx: 0, specialEnemyy: 0, activeSpecial: false,
			specialRate: .01, specialPointRate: 0, sVx: 10, sebound: 0, ogsVx: 2,
			specialDrawing: 0, specialDrawing: 0,
			enemyxv: 0.03 /*[.06,.06,.06,.06,.06]*/
			, enemyyv: 30, pastx: -100, ogenemyxv: 0.06, 
			resetEnemies: false,
			fireRate: 10,// .01, //multiplied by 1,000,000 1 mill
			ogfireRate: .01,
			barrierx: [], barriery: [], barriersize: 60,
			playersize: 30, enemysize: 30, offset: 10, rmEnemy: [],
			//images
			player: new Image(30,30),
			bullet: new Image(5,5),
			scores: [new Image(30,30), new Image(30, 30), new Image(30,30), new Image(30,30)],
			enemy: [new Image(30,30), new Image(30, 30), new Image(30,30), new Image(30,30)],
			enemy2: [new Image(30,30), new Image(30, 30), new Image(30,30)],
			enemydead: [new Image(30,30), new Image(30, 30), new Image(30,30)],
			ebullet: [new Image(10,10), new Image(10,10), new Image(10,10)],
			ebullet2: [new Image(10,10), new Image(10,10), new Image(10,10)],
			ebullet3: [new Image(10,10), new Image(10,10), new Image(10,10)],
			ebullet4: [new Image(10,10), new Image(10,10), new Image(10,10)],
			barrierImage: new Image(1,1), barrierdeath: new Image(1,1), barrierExplosion: new Image(5,5),
			replacementimage: new Image(30,30),
			enemyDeath: new Image(30,30),
			playerDeath: new Image(30, 30),
			specialEnemyDeath: new Image(30,30), 
			//audio
			shoot: new Audio(require('../resrc/sounds/shoot.wav')),
			enemyshot: new Audio(require('../resrc/sounds/invaderkilled.wav')),
			died: new Audio(require('../resrc/sounds/explosion.wav')),
			winner: new Audio(require('../resrc/sounds/winner.mp3')),
			specialEnemyHere: new Audio(require('../resrc/sounds/ufo_highpitch.wav')),
			warning: new Audio(require('../resrc/sounds/Alien_Siren.mp3'))
		};
		this.move = this.move.bind(this);//React components using ES6 classes no longer autobind this to non React methods. Thus in constructor add this binding
		this.stopmove=this.stopmove.bind(this);//upon key lift stop mvment
		this.update = this.update.bind(this);//update game loop!
		this.enemyUpdate = this.enemyUpdate.bind(this);//update enemy positions
		this.bulletReset = this.bulletReset.bind(this);//reset bullet position, set fire to off
		this.checkBulletBarrier = this.checkBulletBarrier.bind(this);//check collision with the bullet and barriers
		this.getminmaxy = this.getminmaxy.bind(this);//for barrier collisions, get the minimum position of a block in the barrier
		this.setUpperLowerx = this.setUpperLowerx.bind(this);//
		this.regulate = this.regulate.bind(this);
		this.specialEnemyUpdate = this.specialEnemyUpdate.bind(this);
		this.deathAcross = this.deathAcross.bind(this);
		this.setup = this.setup.bind(this);//setup
		this.load = this.load.bind(this);//load in the resources
		this.reparameterize = this.reparameterize.bind(this);
		this.nearbyVisualCheck = this.nearbyVisualCheck.bind(this);
	}
	componentDidMount()
	{
		this.load();
		this.setup();//true it is a new game set a new barrier
	}
	load()
	{
		var tmp_ctx = document.getElementById('Field').getContext('2d');
		tmp_ctx.fillStyle="000000";
		tmp_ctx.font='30px ArcadeClassic';
		this.setState( {ctx: tmp_ctx});

		//ebullet1, ebullet1_frame2, ebullet1_frame3, ebullet1_frame4
		this.state.scores[0].src = require('../resrc/img/50.png');
		this.state.scores[1].src = require('../resrc/img/100.png');
		this.state.scores[2].src = require('../resrc/img/150.png');
		this.state.scores[3].src = require('../resrc/img/300.png');

		this.state.ebullet[0].src = require('../resrc/img/ebullet1.png');
		this.state.ebullet2[0].src = require('../resrc/img/ebullet1_frame2.png');
		this.state.ebullet3[0].src = require('../resrc/img/ebullet1_frame3.png');
		this.state.ebullet4[0].src = require('../resrc/img/ebullet1_frame4.png');

		this.state.ebullet[1].src = require('../resrc/img/ebullet2.png');
		this.state.ebullet2[1].src = require('../resrc/img/ebullet2_frame2.png');
		this.state.ebullet3[1].src = require('../resrc/img/ebullet2_frame3.png');
		this.state.ebullet4[1].src = require('../resrc/img/ebullet2_frame4.png');

		this.state.ebullet[2].src = require('../resrc/img/ebullet3.png');
		this.state.ebullet2[2].src = require('../resrc/img/ebullet3_frame2.png');
		this.state.ebullet3[2].src = require('../resrc/img/ebullet3_frame3.png');
		this.state.ebullet4[2].src = require('../resrc/img/ebullet3_frame4.png');

		this.state.barrierExplosion.src=require('../resrc/img/barrierexplosion.png');
		this.state.enemyDeath.src=require('../resrc/img/enemyexplosion.png');
		this.state.playerDeath.src=require('../resrc/img/playerdeath.png');
		this.state.barrierImage.src = require('../resrc/img/barrier.png');
		this.state.player.src = require('../resrc/img/player.png');
		this.state.bullet.src = require('../resrc/img/bullet.png');
		this.state.enemy[0].src = require('../resrc/img/enemy1.png');
		this.state.enemy2[0].src = require('../resrc/img/enemy1_frame2.png');
		this.state.enemy[1].src = require('../resrc/img/enemy2.png');
		this.state.enemy2[1].src = require('../resrc/img/enemy2_frame2.png');
		this.state.enemy[2].src = require('../resrc/img/enemy3.png');
		this.state.enemy2[2].src = require('../resrc/img/enemy3_frame2.png');
		this.state.enemy[3].src = require('../resrc/img/specialEnemy.png');
		this.state.replacementimage.src=require('../resrc/img/Replacement.png');

		this.state.enemydead[0].src = require('../resrc/img/enemy1_death.png');
		this.state.enemydead[1].src = require('../resrc/img/enemy2_death.png');
		this.state.enemydead[2].src = require('../resrc/img/enemy3_death.png');
		this.state.barrierdeath.src=require('../resrc/img/barrier_death.png');
		this.state.specialEnemyDeath.src=require('../resrc/img/specialEnemy_explode.png');
	}
	setup()
	{
		this.setState({
			difficulty: 1.2, decreasefactor: 1.1, 
			ogdifficulty: 1.2, ogdecreasefactor: 1.1, oglowlimit: 15,
			x: this.state.width-2*this.state.playersize,
			ogx: this.state.width-2*this.state.playersize,
			y: this.state.height-2*this.state.playersize,
			ogy: this.state.height-2*this.state.playersize,
			interval: this.state.width/10
		});

		var interval = this.state.width/10;
		var pixelx = interval+interval/2, ystart = this.state.width-5*this.state.playersize;
		var count = 0;

		var tmpbarrierx= [], tmpbarriery=[];
		//barrier placement
		for (var i =0; i< 4; i++)//all barriers
		{
			var jlimit = interval*i+interval;
			for (var j=interval*i; j<jlimit; j++)
			{
				var klimit = ystart+this.state.barriersize;
				for (var k= ystart; k < klimit; k++)
				{
					//take out inner section
					var add = 0, ratio = .20;
					//take out top section
					for (var c =0; c <5; c++)
						add += this.addDetect(i, j, k, jlimit, klimit, ystart+4*c, ystart+4*(c+1), interval, ratio-c*.05, true);
					var begin = ystart+4*4, end = ystart+4*5;//pick up from where we left off above
					//take out inner section
					ratio = .4;//for inner section, smaller ratio the more space you allow and less barrier you have
					for (var c =6; c< 7; c++)
					{
						add += this.addDetect(i, j, k, jlimit, klimit, ystart+4*c, ystart+4*(c+1), interval, ratio, false);
					}
					ratio = .5;
					var offing = .025;//increase this for more spacing (since its subracted from barrier making ratio smaller)
					for (var c =7; c < 10; c++)
						add += this.addDetect(i, j, k, jlimit, klimit, ystart+4*c, ystart+4*(c+1), interval, ratio-c*offing, false);
					for (var c =10; c < 15; c++)
						add += this.addDetect(i, j, k, jlimit, klimit, ystart+4*c, ystart+4*(c+1), interval, ratio-10*offing, false);
					//otherwise if the position does not intersect with what we want to rm in the inner enclave, we add it!
					if (add==0)
					{
						tmpbarrierx[count] = pixelx;
						tmpbarriery[count++] = k;
					}
				}
				pixelx++;
			}
			pixelx+=interval;
		}
		this.setState({score: 0});
		var tmpState = [[],[],[],[],[]], tmpFired = [[],[],[],[],[]], tmpebStag = [[],[],[],[],[]];
		for (var i =0;i<5;i++)
			for (var j = 0; j < this.state.numEnemies; j ++)
			{
				tmpFired[i][j] = false;
				tmpState[i][j] = (this.state.enemyx[i][j]>=0) ? 'ALIVE' : 'DEAD';
				var temp = {stagger: 0, index: 0};
				tmpebStag[i][j] = temp;
			}
		this.setState({enemyState: tmpState,//use setState per request from React docs.
				barrierx: tmpbarrierx,
				barriery: tmpbarriery,
				enemyFired: tmpFired,
				lowerx: this.state.enemyx[0][0],
				upperx: this.state.enemyx[0][this.state.numEnemies-1],
				ebStagger: tmpebStag
		});
		//for smooth movements, separate key down and key up events
		document.addEventListener("keydown", this.move);
		document.addEventListener("keyup", this.stopmove);
	}
	addDetect(i, j, k, jlimit, klimit, lowerrange, upperrange, interval, ratio, isTop)//if coordinates are in the intersection area, then we return 1
	{
		if (isTop)
		{
			var locallimit=interval*1;
			if(k >= lowerrange && k <= upperrange)
				if ((j >= interval*i && j<= interval*i+locallimit*ratio) || (j >=jlimit-locallimit*(ratio) && j <= jlimit))
					return 1;
			return 0;
		}
		else 
		{
			var locallimit=interval*1;
			if(k >= lowerrange && k <= upperrange)
				if( j >= interval*i + locallimit*ratio && j <= jlimit-locallimit*ratio)
					return 1;
			return 0;
		}
	}
	collide(x1, y1, x2, y2, size) { return ( x1>=x2 && x1<=x2+size && y1 >= y2 && y1<=y2+size) ? true : false; }
	getminmaxy(compx)//to get the minimum value 
	{
		var miny=10000, maxy=-10;
		for (var i =0; i < this.state.barrierx.length; i++)
			if(this.state.barrierx[i] == compx)
			{
				if(this.state.barriery[i] < miny)
					miny = this.state.barriery[i];
				if(this.state.barriery[i] > maxy)
					maxy = this.state.barriery[i];
			}
		return[miny, maxy];
	}
	checkBulletBarrier(isEnemy)
	{
		//check the barrierx == bx over range (bx-5, bx+5) or something
		var ret=[[],[]], sum = 0;
		for (var i =0; i<5; i++)
			sum += this.state.enemyFired[i].reduce((a,b)=> a+b, 0);
		i=0;
		if(this.state.fired || sum > 0)
		{
			var miny=10000, maxy = -10;
			var minindex, maxindex;
			var bx = this.state.bx, by = this.state.by;
			var update = false, basex, basey, width, height;//width and height must be whole numbers! compared directly with barrierx, barriery
			var receival = this.getminmaxy(bx);//receive the contents of miny, maxy respectively.
			miny = receival[0]; maxy = receival[1];
			if (!isEnemy)
			{
				if(this.state.fired)
				{
					if(this.state.by > maxy)//if bullet is past barrier, destroy the barrier as follows
					{
						if (maxy != -10)//if y found
						{
							update = true;
							basex = bx; basey = maxy;
							width = this.state.bsize; 
							height = this.state.bsize*2;
							this.bulletReset();
						}
					}
				}
			}
			else if (isEnemy)
			{
				for (var i = 0; i < 5; i++)
					for (var j =0; j < this.state.numEnemies; j++)
					{
						if(this.state.enemyFired[i][j])
						{
							var modbx = Math.floor(this.state.enemybx[i][j]);
							var receival = this.getminmaxy(modbx);
							miny = receival[0]; maxy = receival[1];
							if(this.state.enemyby[i][j] > miny)
							{
								if(maxy!=-10)//if y found, in line of barrier (!)
								{
									update= true;
									basex=modbx;
									basey = miny;//this.state.enemyby[i][j];
									width = this.state.ebsize;
									height = this.state.ebsize*2;
									this.state.enemyFired[i][j] = false;
									this.setState({ ebulletsfired: this.state.ebulletsfired-1 });
								}
							}
						}
					}
			}
			if (update)
			{
				var x = [], y = [];
				var ambience = 10;
				var fx = 2.1;//greater it is, the more you are guranteed to destroy with each bullet hit
				var ambiencefx = 2; //greater it is, the less destroyed, smaller it is, the more destroyed on bullet impact with barrier
				//console.log('update is true '+ basex + ' ' + basey + ' heigh is ' + height + 'width is ' + width);
				for (var i = -width; i< width; i++)//square removal
				{
                                	for (var j = -height; j < height; j++)
                                        {
						if(i >= -width+width/fx && i <= width-width/fx &&  j>= -height+height/fx && j<=height-height/fx )
						{
                                                              	x.push(basex+i);
                                                                y.push(basey+j);
						}
						//limit this more because this accounts for what is not in first if statement
						else if(i >=-width && i <= -width+width/fx && j>=-height && j <= height +height/fx)//on very peripheral
						{
                                                	if(Math.floor(Math.random()*ambience) < ambience/ambiencefx*1.4){
                                                        	x.push(basex+i);
                                                        	y.push(basey+j);
                                                       	}

						}
						else{
                                                        if(Math.floor(Math.random()*ambience) < ambience/ambiencefx){
                                                        	x.push(basex+i);
                                                              	y.push(basey+j);
                                                	}
						}
                                        }
                                }
				//get bullet projections
				for (var i =0; i < this.state.barrierx.length; i++)
				{
					var rm = false, barx = this.state.barrierx[i], bary = this.state.barriery[i];
					for (var j = 0; j < x.length; j++)
					{
						if(x[j] == barx && bary == y[j])
						{
							rm = true;
							//this.state.ctx.drawImage(this.state.barrierExplosion, this.state.barrierx[i], this.state.barriery[i], this.state.bsize, this.state.bsize);
						}
					}
						if (!rm)
						{
							ret[0].push(this.state.barrierx[i]);
							ret[1].push(this.state.barriery[i]);
						}
				}
			}//update range
		}//test if bullet is being fired
		return ret;
	}
	abs(x) { return (x < 0) ? -x : x;}
	pad(x, len) //so the score is 'len' long. 4 in this case.
	{	
		var s = x.toString(), offs='';
		if (s.length < len)
		{
			var off = 4-s.length;
			for (var i =0; i < off; i++)
				offs += '0';
		}
		return offs+s;
	}
	barrierRepair()//seperate out barrier rep
	{
		//barriers
		var replace = this.checkBulletBarrier(false);
		if(replace[0].length != 0)
			this.setState({ 
				barrierx: replace[0], barriery: replace[1] 
			});
		replace = this.checkBulletBarrier(true);
		if(replace[0].length != 0)
			this.setState({ 
				barrierx: replace[0], barriery: replace[1] 
			});
		//make this better by having this.checkbulletbarrier replace state in fx
	}
	setUpperLowerx()
	{
		var ux = this.state.enemyx[4][this.state.numEnemies-1], lx = this.state.enemyx[0][0];
		var lxset = false, uxset = false;
		for (var j =0; j < this.state.numEnemies; j++)
		{
			var alive = false;
			for (var i =0; i < 5; i++)
			{
				if(this.state.enemyState[i][j] == 'ALIVE')
					alive = true;
			}
			if(alive)//&& (!lxset)) //if alive and lx not set yet
			{
				lx = this.state.enemyx[0][j];
				lxset = true;
				break;
			}
			/*if(alive && (!uxset))
			{
				ux = this.state.enemyx[0][j];
				uxset = true;
			}*/
		}
		for (var j=this.state.numEnemies-1; j > -1; j--)
		{
			var alive = false;
			for (var i =0; i < 5; i++)
			{
				if(this.state.enemyState[i][j] == 'ALIVE')
					alive = true;
			}
			if(alive)//&& (!lxset)) //if alive and lx not set yet
			{
				ux = this.state.enemyx[0][j];
				uxset = true;
				break;
			}
		}
		this.setState({upperx: ux, lowerx: lx});
	}
	specialEnemyUpdate()
	{
		if(this.state.specialDrawing > 0)// if drawing it
		{
			var lo = 10, hi=lo*3;
			this.setState({specialDrawing: this.state.specialDrawing+1 });
			if(this.state.specialDrawing > hi)
			{
				this.setState({specialDrawing: 0 });//if +1 is later, then it will always be stuck here, other wise, extra return statement here , and +1 moved down 
			}
			else if(this.state.specialDrawing <= lo)//draw explosion
				this.state.ctx.drawImage(this.state.specialEnemyDeath, this.state.specialEnemyx, this.state.specialEnemyy, this.state.enemysize, this.state.enemysize);
			else if(this.state.specialDrawing > lo && this.state.specialDrawing <= hi)//draw pointage
			{
				var sc = this.state.specialPointRate, index = 0;
				var scorearray = [50, 100, 150, 300];
				for (var i = 1; i < 4; i++)
					if(sc == scorearray[i])
						index=i;
				this.state.ctx.drawImage(this.state.scores[index], this.state.specialEnemyx, this.state.specialEnemyy);
//				this.state.ctx.fillStyle='#000000';
			}
			return;//ensure other stuff doesn't happen; so its not drawn while new enemy shows up for ex
		}
		if(this.state.activeSpecial)//update position of special enemy
		{
			//console.log('img drawn ' + this.state.specialEnemyx + ' ' + this.state.specialEnemyy + ' sebound is ' + this.state.sebound);
			this.state.specialEnemyHere.play();
			this.state.ctx.drawImage(this.state.enemy[3], this.state.specialEnemyx, this.state.specialEnemyy, this.state.enemysize, this.state.enemysize);
			this.setState({specialEnemyx: this.state.specialEnemyx+this.state.sVx});
			if (this.state.sebound == 0)
				if(this.state.specialEnemyx < 0)
					this.setState({activeSpecial: false});
			if (this.state.sebound == this.state.width)
				if(this.state.specialEnemyx > this.state.width)
					this.setState({activeSpecial: false});
			//check bullet activespecial collision
			if(this.collide(this.state.bx, this.state.by, this.state.specialEnemyx, this.state.specialEnemyy, this.state.enemysize))
			{
				var values = [50, 100, 150, 300];
				var index = Math.floor(Math.random()*4);
				var rate = values[index];
				this.setState({ specialPointRate: rate, specialDrawing: this.state.specialDrawing+1, activeSpecial: false, score: this.pad(parseInt(this.state.score)+rate, 4) });
				this.state.ctx.drawImage(this.state.specialEnemyDeath, this.state.specialEnemyx, this.state.specialEnemyy, this.state.enemysize, this.state.enemysize);
				this.props.metaChange(this.state.score, this.state.numberlives);
			}
		}
		else if(!this.state.activeSpecial && !this.state.visual)//take a chance to start the special enemy, never draw when in visual mode (limit the degrees of freedom)
		{
			if (Math.random()*100 < this.state.specialRate)
			{
				var sEx = this.state.width, sVx= -this.state.ogsVx, sebound= 0;
				if(Math.random()*10 <5)
				{
					sEx = 0;
					sVx = this.state.ogsVx;
					sebound = this.state.width;
				}
				this.setState({activeSpecial: true, specialEnemyx: sEx, specialEnemyy: 0, sVx: sVx, sebound: sebound});
			}
		}	
	}
	reparameterize()
	{
		var numclear = this.state.notimes;//number itmes cleared.
		var factor = 1;//based on no of times cleared, make harder
		for (var  i =0; i< numclear/2; i++)
			factor *= 1.04;
		
		this.setState({ x: this.state.ogx, y: this.state.ogy 
			, enemyxv: this.state.ogenemyxv*factor, numdead: 0, lvlclear: false, 
			difficulty: this.state.ogdifficulty*factor, decreasefactor: factor*this.state.ogdecreasefactor,
			lowlimit: this.state.oglowlimit, fireRate: this.state.ogfireRate
			, x_tanh: this.state.ogx_tanh
		});
	//	var arr = [this.state.x, this.state.y, this.state.enemyxv, 
//this.state.difficulty, this.state.decreasefactor, this.state.lowlimit, this.state.fireRate, this.state.x_tanh];
	//	console.log('reset ' + arr);
		var tmpX = [[],[],[],[],[]], tmpY = [[],[],[],[],[]];
		var offing = this.state.enemysize*numclear;

                var tmpState = [[],[],[],[],[]], tmpFired = [[],[],[],[],[]], tmpebStag = [[],[],[],[],[]];

		if(this.state.ogenemyy[4][0] + numclear*this.state.enemysize >= 415)//this is limit of barrier
			offing = 180;

                for (var i =0;i<5;i++)
                        for (var j = 0; j < this.state.numEnemies; j ++) 
                        {   
                                tmpFired[i][j] = false;
                                tmpState[i][j] = 'ALIVE';
                                var temp = { stagger: 0, index: 0 }; 
                                tmpebStag[i][j] = temp;
				if(this.state.visual)
				{
					this.state.enemyx[i][j] = this.state.ogvenemyx[i][j];
					this.state.enemyy[i][j] = (this.state.ogvenemyy[i][j]) + offing; //+((1+numclear)*this.state.enemysize));
				}
				else
				{
					this.state.enemyx[i][j] = this.state.ogenemyx[i][j];
					this.state.enemyy[i][j] = (this.state.ogenemyy[i][j]) + offing; //+((1+numclear)*this.state.enemysize));
				}
                	}   
                this.setState({ 
				enemyState: tmpState,
                                enemyFired: tmpFired,
				ebStagger: tmpebStag
                });
	}
	tanh(x)//really 2*tanh(x)
	{
		return 2/(1+Math.exp(-x));
	}
	nearbyVisualCheck()
	{
		//get nearest enemy and save and cmp, going through all enemies everytime resets the enemy used
		//for visual mode, if invader is in line of fire, indicate
		if(this.state.visual)
		{
			var maxIndexone = -1, maxIndextwo=-1, max=-1000;
			var xpos = Math.floor(this.state.x+this.state.playersize/2-this.state.playersize/8+2);
			for (var i =0; i < 5; i++)
			{
				for(var j=0; j < this.state.numEnemies;j++)
				{
					if(this.state.enemyState[i][j] == 'ALIVE')	
					{
						var barrierblock = false;
						for (var h = 0; h < this.state.barrierx.length; h++)
							if(this.state.barrierx[h] == xpos)
								barrierblock=true;//barrier is in the way
						///get x range check here as well
						//if (this.state.x >= this.state.enemyx[i][j] && this.state.x <= this.state.enemyx[i][j]+this.state.enemysize)
						if (xpos >= this.state.enemyx[i][j] && xpos <= this.state.enemyx[i][j]+this.state.enemysize)
							if (!barrierblock)//if in range, and barrier is not in the way, compare to find the closest enemy and mark it
							{
			//console.log('enemy!' + i ' is i. j is '+j);
								var x = this.abs(this.state.enemyx[i][j]-this.state.x);
								var y = this.abs(this.state.enemyy[i][j]-this.state.y);
								if(x*x+y*y > max)
								{
									max=x*x+y*y;
									maxIndexone=i;
									maxIndextwo=j;
								}
							}
					}
			
				}
			}
			var different = true;
			if(maxIndexone == this.state.vIndexOne && maxIndextwo==this.state.vIndexTwo)
				different=false;
			//different represents is it diff from the prior one, meaning it could either be a new enemy or empty space (-1), this occurs in order of -1->some new enemy index as there are spaces between the enemies
			if(different && maxIndexone==-1 && maxIndextwo==-1)//do not shoot if no enemy in front of you, do not say multiple times if you are not in a line of fire, so different boolean is used
			{
				window.speechSynthesis.cancel();
				window.speechSynthesis.speak(new SpeechSynthesisUtterance('N'));//no enemy
			}
			else if(different && maxIndexone != -1 && maxIndextwo != -1)//shoot if different enemy, and it exists
			{
				window.speechSynthesis.cancel();
				window.speechSynthesis.speak(new SpeechSynthesisUtterance('S'));//shoot
			}
			this.setState({ vIndexOne: maxIndexone, vIndexTwo: maxIndextwo });
		}
	}
	update()
	{
		//if you die
		if(this.state.lifelost)
		{
			this.state.ctx.drawImage(this.state.playerDeath, this.state.x, this.state.y, this.state.playersize, this.state.playersize);
			this.deathAcross();
			return;
		}

		//check if no enemies remain. Set params back to og, and go again
		if(this.state.numdead == 5*this.state.numEnemies)
		{
			this.state.winner.play();
			this.setState({ /*resetEnemies: true,*/ set: false, start: false, numdead: 0
				, lvlclear: true, notimes: this.state.notimes+1, activeSpecial: false
			});
			return;
		}

		//clear all prior images
		this.state.ctx.clearRect(0,0,this.state.height, this.state.width); //fillRect with #FFFFFF

		//check in visual mode if enemy bullets are approaching
		this.nearbyVisualCheck()

		var fx = 1;
		////ENEMY PARAMETER ADJUSTMENTS via row increase (less than enemy increase)////
		if(this.state.pastnumdead != this.state.numdead)//make game harder if enemies killed
		{
			var tmpx_tanh = this.state.x_tanh+this.state.xinterval_tanh;
			var fx = Math.exp(tmpx_tanh)/2+1;  //*Math.exp(this.state.x_tanh);
			var tmpxv = fx*this.state.ogenemyxv;
			if(this.state.enemyxv < 0)
				tmpxv*=-1;
			
			//visual part
			if(!this.state.visual)
			{
				this.setState({
					difficulty: fx*this.state.ogdifficulty, decreasefactor: fx*this.state.ogdecreasefactor, enemyxv: tmpxv
					, lowlimit: this.state.oglowlimit/this.state.decreasefactor ///1.03 //decrease factor makes it too fastgood number for this decreasing via enemy death on frames
					, fireRate: this.state.fireRate*fx, x_tanh: tmpx_tanh
				});
				if (this.state.numdead > 44)
					this.setState({ enemyxv: tmpxv*fx});//increase more rapidly twoards the end
				if(this.state.fireRate > this.state.maxfireRate)
					this.setState({ fireRate: this.state.maxfireRate });
				if(this.abs(this.state.enemyxv) > this.state.maxexv)
					this.setState({ enemyxv: ((this.state.enemyxv < 0) ? -this.state.maxexv : this.state.maxexv) });
				if(this.state.lowlimit < this.state.maxlowlimit) 
					this.setState({ lowlimit: this.state.maxlowlimit });
			}
			var hhhscore = this.pad(this.state.score, 4);
			this.setState({score: hhhscore});
			this.props.metaChange(this.state.score, this.state.numberlives);
		}
		this.setState({ pastnumdead: this.state.numdead, numdead: 0});
		this.setUpperLowerx();
		
		this.specialEnemyUpdate();

		for (var i=0; i < this.state.barrierx.length; i++)
			this.state.ctx.drawImage(this.state.barrierImage,this.state.barrierx[i], this.state.barriery[i], 1,1);
		this.barrierRepair();

		//enemy
		if(this.state.fireRate >= this.state.maxfireRate)
		{
			this.setState({ fireRate: this.state.maxfireRate });
		}
		var yupdate=0;
		////ENEMY PARAMETER ADJUSTMENTS via enemy increase (more than row increase)////
		if (this.state.upperx > this.state.width-this.state.enemysize || this.state.lowerx < 0)
		{
			var up = false;
			if(this.state.upperx > this.state.width-this.state.enemysize)
				up = true;
			//set to boundary conditions so propagation of error does not affect these calculations
			var offing = (up ? -1*this.abs(2*this.state.enemyxv): this.abs(this.state.lowerx));//if up
			for (var i =0; i < 5; i++)
			{
				for (var j =0; j< this.state.numEnemies;j++)
				{
					this.state.enemyx[i][j]= Math.floor(offing+this.state.enemyx[i][j]);
					this.state.enemyy[i][j]+=this.state.enemyyv;
				}
			}
			var tmpxv = this.state.enemyxv*-1*1.01; //this.state.difficulty;
			if(this.abs(tmpxv) >=this.state.maxexv)
				tmpxv = (up ? -this.state.maxexv: this.state.maxexv);
			this.setState({ lowlimit: this.state.lowlimit/1.1 ///this.state.decreasefactor
				, enemyxv: tmpxv });
			if(this.state.lowlimit <= this.state.maxlowlimit)
				this.setState({ lowlimit: this.state.maxlowlimit });
		}
		var stagger = 0;
		var lowlimit = this.state.lowlimit; 
		var highlimit = 2*lowlimit;
		if(this.state.stagger > lowlimit && this.state.stagger < highlimit)//stagger
			stagger=1;
		else if (this.state.stagger>=highlimit)
			this.setState({ stagger: -1 });
		this.setState({stagger: this.state.stagger+1});

		var rmE = false;
		var tmpsx = [[],[],[],[],[]], tmpsy = [[],[],[],[],[]], tmpFired = [[],[],[],[],[]], 
			tmpbx= [[],[],[],[],[]], tmpby=[[],[],[],[],[]], tmpStag=[[],[],[],[],[]];
		for (var i=4; i > -1; i--)
		{
			var tmpt = this.enemyUpdate(i, stagger);
			tmpsx[i] = tmpt[0];
			tmpsy[i] = tmpt[1];
			tmpFired[i] = tmpt[2];
			tmpbx[i] = tmpt[3];
			tmpby[i] = tmpt[4];
			tmpStag[i] = tmpt[5];
		}
		this.setState({
			enemyFired: tmpFired,
			enemybx: tmpbx, enemyby: tmpby, 
			ebStagger: tmpStag
		});

		//bullet
		if(this.state.fired)
		{
			var rm = false;
			for (var i=0;i<this.state.enemyx.length;i++)
			{
				for (var j =0; j < this.state.numEnemies; j++)
				{
					if(this.collide(this.state.bx, this.state.by, this.state.enemyx[i][j], this.state.enemyy[i][j], this.state.enemysize)
						&& rm == false && this.state.enemyState[i][j]=='ALIVE')
					{	
						rm = true;
						this.state.enemyshot.play();
						this.state.ctx.drawImage(this.state.enemyDeath, this.state.enemyx[i][j], this.state.enemyy[i][j], this.state.enemysize, this.state.enemysize);
						var tmp = this.state.enemyState;
						tmp[i][j] = 'DEAD';
						this.setState({ enemyState: tmp });
						var increase = 10;
						if (i == 1 || i==2)
							increase = 20;
						else if(i==0)
							increase = 30;
						this.setState({score: parseInt(this.state.score)+increase });
	//call meta update here	
						this.props.metaChange(this.pad(this.state.score, 4), this.state.numberlives);
						this.bulletReset();
						i = this.state.enemyx.length;
						j = this.state.numEnemies;
						break;
					}
				}
			}
			this.setState({by: this.state.by-this.state.bvelocity});
			this.state.ctx.drawImage(this.state.bullet, this.state.bx, this.state.by, this.state.bsize, this.state.bsize);
			if(this.state.by < 0) 
				this.bulletReset();
		}
		this.setState({ x: this.state.x+this.state.xvelocity });
	        if(this.state.x<0) 
		{
			this.setState({x: 0});//this.state.width-this.state.playersize }); //this.state.ctx.width-this.state.playersize;
			/*if(this.state.visual)
			{
				window.speechSynthesis.cancel();
				window.speechSynthesis.speak(new SpeechSynthesisUtterance('L Edge'));
			}*/
		}
	        else if(this.state.x > this.state.width-this.state.playersize)  
		{
			this.setState({x: this.state.width-this.state.playersize}); //0});
			/*if(this.state.visual)
			{
				window.speechSynthesis.cancel();
				window.speechSynthesis.speak(new SpeechSynthesisUtterance('R Edge'));
				//can make clea nwith more state variables on if an edge is hit, check if something spoken...
			}*/
		}
		this.state.ctx.drawImage(this.state.player, this.state.x, this.state.y, this.state.playersize, this.state.playersize);

		//end
		var reqid= requestAnimationFrame(this.update);
		this.setState({requestId: reqid});
	}
	bulletReset() { this.setState({bx: -100, by: -100, fired: false }); }
	deathAcross()
	{
		//set with red players
		for (var i =0; i < 5; i++)
		{
			for (var j =0; j < this.state.numEnemies; j++)
			{
				if(this.state.enemyState[i][j] == 'ALIVE')
				{
					var img = this.state.enemydead[2];
					if (i==3 || i ==4)
						img=this.state.enemydead[0];
					else if(i==1 || i==2)
						img=this.state.enemydead[1];
					else if(i==0)
						img=this.state.enemydead[2];
					if(true)
						this.state.ctx.drawImage(img, this.state.enemyx[i][j], this.state.enemyy[i][j], this.state.enemysize, this.state.enemysize);
				}
			}
		}
		//through barrierdeath
		for (var i =0; i < this.state.barrierx.length; i++)
		{
			this.state.ctx.drawImage(this.state.barrierdeath, this.state.barrierx[i], this.state.barriery[i], 1,1);
		}
		this.state.ctx.drawImage(this.state.playerDeath, this.state.x, this.state.y, this.state.playersize, this.state.playersize);
	}
	regulate()//erase at top
	{
		var numlives = this.state.numberlives;
		if (this.state.lvlclear)
		{
			this.reparameterize();
			this.update();
		}
		//else if(numlives>=3)
		//	this.update();
		else if(numlives>0 && numlives <= 3)//!this.state.lifelost is set in move after activating it
			this.update();
	}
	enemyUpdate(row, stagger)
	{
		var tmpx = this.state.enemyx[row], tmpy = this.state.enemyy[row];
		var tmpFired = this.state.enemyFired[row];
		var tmpEnemybx=this.state.enemybx[row], tmpEnemyby=this.state.enemyby[row];
		var tmpStagger = this.state.ebStagger[row];
		var offset = this.state.offset, rmIndex= -1;
		for (var i=0; i < this.state.numEnemies; i++)
		{
			if(this.state.enemyState[row][i] == 'ALIVE')
			{
				//to shoot or not to shoot
				if(!this.state.enemyFired[row][i])
				{
					//roll a die to fire
					var test = Math.random()*100;
					if (test < this.state.fireRate && this.state.ebulletsfired<=3)//max three bullets allowed to be fired at once
					{
						tmpFired[i] = true;
						this.setState({ ebulletsfired: this.state.ebulletsfired+1 });
					}
					tmpEnemybx[i] = tmpx[i] + this.state.enemysize/2-this.state.ebsize/2; //place ebullet in mid of enemy sprite
					tmpEnemyby[i] = tmpy[i];
					var struct = {index: Math.floor(Math.random()*3), stagger: 0};
					tmpStagger[i] = struct;
				}
			}//if alive
			///only under here to still continue moving bullet even if dead
			if(this.state.enemyFired[row][i])
			{
				var tmpStruct = tmpStagger[i];
				var bimage = this.state.ebullet[tmpStruct.index];
				var frange = 5;
				//'animations' for bullet
				if(tmpStruct.stagger<=frange)
					bimage= this.state.ebullet[tmpStruct.index];
				else if (tmpStruct.stagger > frange && tmpStruct.stagger <= frange*2)
					bimage=this.state.ebullet2[tmpStruct.index];
				else if (tmpStruct.stagger > frange*2 && tmpStruct.stagger <= frange*3)
					bimage=this.state.ebullet3[tmpStruct.index];
				else if (tmpStruct.stagger > frange*3 && tmpStruct.stagger <= frange*4)
					bimage=this.state.ebullet4[tmpStruct.index];
				tmpStruct.stagger = tmpStruct.stagger + 1;
				if(tmpStruct.stagger == frange*4)
					tmpStruct.stagger = 0;
				tmpStagger[i] = tmpStruct;

				///update pos.
				///check collision with bx, or player. 
				tmpEnemyby[i] += this.state.ebv;
				//get random number 1-3
				var randIndex = Math.floor(Math.random()*3);
				this.state.ctx.drawImage(bimage, tmpEnemybx[i], tmpEnemyby[i], this.state.ebsize, this.state.ebsize);
				if(tmpEnemyby[i] >= this.state.height)
				{
					tmpFired[i] = false;
					this.setState({ ebulletsfired: this.state.ebulletsfired-1 });
				}
				//if visual, play noise when in line of fire
				if(this.state.visual)
				{
					var cont = true;
					//check if the player is behind a barrier, only play noise if it is not
					for (var h=0;h<this.state.barrierx.length;h++)
					{
						if(this.state.x == this.state.barrierx[h])
							cont = false;
					}
					if (cont && this.collide(this.state.enemybx[row][i], this.state.y, this.state.x, this.state.y, this.state.playersize*1))//check potential collision with player
					{
						var barrierblock = false;
						for (var w =0; w < this.state.barrierx.length; w++)
							if(Math.floor(this.state.enemybx[row][i]) == this.state.barrierx[w])
							{
								barrierblock=true;
								break;
							}
						if(!barrierblock)
							this.state.warning.play();
					}
				}
				if (this.collide(this.state.enemybx[row][i], this.state.enemyby[row][i], this.state.x, this.state.y, this.state.playersize))//check collision with player
				{
					this.state.died.play();
					this.state.ctx.drawImage(this.state.playerDeath, this.state.x, this.state.y, this.state.playersize, this.state.playersize);
					this.setState({numberlives: this.state.numberlives-1, activeSpecial: false, ebulletsfired: this.state.ebulletsfired-1, fired: false});
					this.props.metaChange(this.state.score, this.state.numberlives);
					if(this.state.numberlives == 0)
					{
						this.setState({gameover: true});
						this.props.onNewGame(this.state.score);
					}
					tmpFired[i]=false;//collision happened, so turn off fire on bullet
					this.setState({lifelost: true, set: false, start: false});
					//this.regulate();
				}
				if (this.collide(this.state.enemybx[row][i], this.state.enemyby[row][i], this.state.bx/*-this.state.bsize/2*/, this.state.by/*-this.state.bsize/2*/, this.state.bsize))//check collision with player bullets
				{
					this.state.ctx.drawImage(this.state.enemyDeath, this.state.bx, this.state.by, this.state.bsize, this.state.bsize);
					this.bulletReset();
					tmpFired[i]=false;
					this.setState({ ebulletsfired: this.state.ebulletsfired-1 });
				}
			}//if enemy fired
			//movement 
			var image = this.state.enemy[0];//assume 3, 4 row
			var imgtransition = this.state.enemy2[0];
			var dead = false;
			//odd issue of using this replacement image if row ==1...etc check not in the loop? This only worked, to set it case by case everytime..
			if(this.state.enemyState[row][i] == 'DEAD')
			{
				dead = true;
				image=this.state.replacementimage;
				imgtransition=this.state.replacementimage;
				this.setState({numdead: this.state.numdead+1});
			}
			else if(row == 1 || row == 2)
			{
				image = this.state.enemy[1];
				imgtransition = this.state.enemy2[1];
			}
			else if(row == 0)
			{
				image = this.state.enemy[2];
				imgtransition = this.state.enemy2[2];
			}
			///update
			if(stagger)
			{
				tmpx[i] += this.state.enemyxv;
				if(!dead)
					this.state.ctx.drawImage(image,
						this.state.enemyx[row][i], this.state.enemyy[row][i],
						this.state.enemysize,
						this.state.enemysize
					);//redraw new position on board
			}
			///redraw
			else
			{
				tmpx[i] += this.state.enemyxv;
				if(!dead)
					this.state.ctx.drawImage(imgtransition,
						this.state.enemyx[row][i], this.state.enemyy[row][i],
						this.state.enemysize,
						this.state.enemysize
					);//redraw new position on board
			}
		}
		return [tmpx, tmpy, tmpFired, tmpEnemybx, tmpEnemyby, tmpStagger];
	}
	move(event)
	{
		if(!this.state.set && !this.state.gameover)//if going from death to another try (which means that numlives>0)
		{	
			this.setState({lifelost: false, set: true, start: true, x: this.state.ogx, y: this.state.ogy, numdead: 0});//play again after death
			this.regulate();
		}
		if(!this.state.lifelost)
		{
			this.state.ctx.fillRect(this.state.x,this.state.y,this.state.playersize, this.state.playersize);
			//player
	        	var k = event.keyCode;
	                if(k==37)//move left
			{
				//stereo into right and left ear if you are about to run into a bullet. if bullet is on your left then signal noise on that side. detect? via check if right position or left position + velocity has it, if collision, then play noise and do not move
				this.setState({xvelocity: -this.state.ogxvelocity});
				var potentialx = this.state.x+this.state.xvelocity;
				if(this.collide())//if collision with bullet
				if(potentialx <= 0)
				{
					window.speechSynthesis.cancel();
					window.speechSynthesis.speak(new SpeechSynthesisUtterance('L Edge'));
				}
			}
	                else if(k==39)//move right
			{
				this.setState({xvelocity: this.state.ogxvelocity});
				var potentialx = this.state.x+this.state.xvelocity;
				if(potentialx >= this.state.width-this.state.playersize)
				{
					window.speechSynthesis.cancel();
					window.speechSynthesis.speak(new SpeechSynthesisUtterance('R Edge'));
				}
			}
	                else if(k==16)//shift key
	                {
				if(this.state.numberlives>0 && !this.state.fired)
				{
					this.state.shoot.play();
					this.setState({fired: true, 
						bx: Math.floor(this.state.x+this.state.playersize/2-this.state.playersize/8+2),
						by: this.state.y-.001
					});
				}
	                }
		}
	}
	stopmove(event)//stop movement when lifting a key for smooth mvment
	{
		var k = event.keyCode;
		if(k==37 || k==39)
			this.setState({xvelocity: 0});
	}
	render()
	{
		return(
				<div> {this.state.canvas} </div>
		);
	}
}
