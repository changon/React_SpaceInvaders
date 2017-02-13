import React from 'react';
import ReactDOM from 'react-dom';

export default class Game extends React.Component
{
	constructor(props)
	{
		var types = {
			MODE: {normal: 0, visual: 1}
		};
		var sets = {
			numenemy: [ [10],[12] ], //5 rows of 11 
			enemyx: [
					[5, 25, 45,65,85,105,125,145,165, 185],
					  [5, 25, 45,65,85,105,125,145,165,185,205, 225,245]
				],
			enemyy: [
					[	[5, 5, 5, 5, 5, 5,5,5,5,5],   
					 	[35, 35, 35, 35, 35, 35,35,35,35,35]	
					],
					[	[5, 5, 5, 5, 5, 5,5,5,5,5,5,5],
						[35, 35, 35, 35, 35, 35,35,35,35,35,35,35] 
					]
				]
		};
		super(props);
		this.state={
			rowstagger: [0,0],
			stagger: [0, -20], //alternate with movement and animation replacement
			start: false,
			canvas: <canvas id="Field" height={600} width={800} ></canvas>,
			height: 600, width: 300,
			ctx: '',
			interval: null,
			score: 0, fps: 100000, 
			numEnemies: sets.numenemy[ types.MODE[this.props.mode] ] ,
			x: 105, y:100, xvelocity: 5,
			bx: 10, by: 10, fired: false, bsize:1,
			enemyx: [sets.enemyx[types.MODE[this.props.mode]], sets.enemyx[types.MODE[this.props.mode]] ], 
			enemyy: [sets.enemyy[types.MODE[this.props.mode]][0], sets.enemyy[types.MODE[this.props.mode]][1] ],
			enemybx: [], enemyby: [], 
			enemyxv: [2,2], enemyyv: [20,20],
			playersize: 5, enemysize: 10,
			//images
			player: new Image(5,5), Preplace: new Image(5,5),
			bullet: new Image(1,1),
			enemy: new Image(10,10)
			//player: <Image source={ {uri: 'player.png'}} style={{width: 40, height: 40}} />
			/*
			player: '', Preplace: '',
			Enemy: '', Enemyreplace: '',
			bullet: '', ebullet: '', Breplace: '',
			//audio
			enemyshot:'', shoot: '', died: '', winner:''*/
		};
		this.move = this.move.bind(this);//React components using ES6 classes no longer autobind this to non React methods. In your constructor, add this binding
		this.update = this.update.bind(this);
	}
	componentDidMount()
	{
		var tmp_ctx = document.getElementById('Field').getContext('2d');
		this.setState( {ctx: tmp_ctx} );
		this.state.player.src=require('../resrc/img/player.png');
		this.state.bullet.src=require('../resrc/img/bullet.png');
		this.state.enemy.src = require('../resrc/img/enemy.png');
		document.addEventListener("keydown", this.move);
		//*/
		//ReactDOM.findDOMNode('body').addEventListener('keypress', this.move);
	        //load audio
	        /*enemyshot = new Audio('../resrc/sounds/invaderkilled.wav');
	        shoot = new Audio('../resrc/sounds/shoot.wav');
	        died = new Audio('../resrc/sounds/explosion.wav');
	        winner = new Audio('../resrc/sounds/winner.mp3');

	        //load images
	        Preplace = new Image();
	        Preplace.src='../resrc/img/playerReplace.png';
	        Enemyreplace = new Image();
	        Enemyreplace.src='../resrc/img/enemyReplace.png';
	        ebullet = new Image();
	        ebullet.src = '../resrc/img/bullet.png';
	        Breplace = new Image();
	        Breplace.src='../resrc/img/bulletReplace.png';
	        Enemy = new Image();
	        Enemy.src='../resrc/img/enemy.png';
		*/
	}
	update()
	{
		this.state.start=true;

		//clear all prior images
		this.state.ctx.fillStyle="000000";
		this.state.ctx.fillRect(0,0,800,600);	

		//bullet
		if(this.state.fired)
		{
			this.state.by-=5;
			this.state.ctx.drawImage(this.state.bullet, this.state.bx, this.state.by, this.state.bsize, this.state.bsize);
			if(this.state.by < 0) 
				this.state.fired=false;
		}
		this.state.ctx.drawImage(this.state.player, this.state.x, this.state.y, this.state.playersize, this.state.playersize);

		//enemies
		var yupdate = [0,0];
		for (var i =0; i< 2; i++)
		{
			if (this.state.enemyx[i][this.state.numEnemies-1] > this.state.width || this.state.enemyx[i][0] < 0)
			{
				this.state.enemyxv[i]*=-1;
				yupdate[i] = this.state.enemyyv;
			}
		}

		for (var h=0;h<2;h++)
		{
			var yoff= h*10;
			for (var i=0; i < this.state.numEnemies; i++)
			{
				///update
				if(this.state.stagger[h] > 40)
				{
					this.state.enemyx[h][i]+= this.state.enemyxv[h];
					this.state.enemyy[h][i]+= yupdate[h];
					this.state.stagger[h]=0;
				}
				this.state.stagger[h]++;
				///redraw
				this.state.ctx.drawImage(this.state.enemy,
					this.state.enemyx[h][i],
					this.state.enemyy[h][i],
					this.state.enemysize,
					this.state.enemysize
				);//redraw new position on board
			}
		}
		//end
	//	setTimeout(
		//	this.update
		requestAnimationFrame(this.update);
	//		, 1000 //1000/this.state.fps
	//	);
		//requestAnimationFrame(this.update);
	}
	move(event)
	{
	if(this.state.start)
	{
		//player
        	var k = event.keyCode;
                if(k==37)//move left
                {   
			this.state.x-=10;
                }   
                else if(k==39)//move right
                {   
			this.state.x+=10;
                }  
                else if(k==16)//shift key
                {   
			if(!this.state.fired)
			{
				this.state.fired=true;
				this.state.bx = this.state.x;
				this.state.by=this.state.y-.001;
			}
                }
                if(this.state.x<0) this.state.x=this.state.width-this.state.playersize; //this.state.ctx.width-this.state.playersize;
                else if(this.state.x>this.state.width-this.state.playersize) this.state.x=0;
		this.state.ctx.drawImage(this.state.player, this.state.x, this.state.y, this.state.playersize, this.state.playersize);
	}
	}
	render()
	{
		return(
			<div>
				<button onClick={this.update}>{'Start'}</button>
				<div> {this.state.canvas} </div>
			</div>
		);
	}
}
