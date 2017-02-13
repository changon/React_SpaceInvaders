import React from 'react';
import Game from './Game';
import Meta from './Meta';
import LowMeta from './LowMeta';

export default class App extends React.Component{
	constructor(props)
	{
		super(props);
		var potential = localStorage.getItem('highscore');
		if (potential == null)
			potential = '0';
		if(potential.length < 4)//padding function for four digit score
		{
			var offset=4-potential.length;
			for(var i=0; i< offset;i++)
				potential='0'+potential;
			
		}
		this.normalMode = this.normalMode.bind(this);
		this.visualMode = this.visualMode.bind(this);
		this.activate = this.activate.bind(this);
		this.setup = this.setup.bind(this);
		this.load1 = this.load1.bind(this);//to load imgs as needed
		this.load2 = this.load2.bind(this);
		this.load3 = this.load3.bind(this);
		this.load4 = this.load4.bind(this);
		this.write = this.write.bind(this);
		this.repeat = this.repeat.bind(this);
		this.state={
			dashcounter: 0, lastspoken: '', lvlclear: false, score: 0,
			highscore: potential, credit: 4, numberlives: 3, mode: '',
			game: <canvas id='intro'> </canvas>, ctx: null,
			header:<h1>{'Space Invaders'}</h1>, 
			norm: <button onClick={this.normalMode}>{'Normal'}</button>,
			visual: <button onClick={this.visualMode}>{'Visual'}</button> ,
			enemies: [new Image(30,30), new Image(30,30), new Image(30,30), new Image(30,30)],
			esize: 50, xstart: 270, ystart: 200,
			offset: 60, timer: null,
			printString: '= ?  MYSTERY= 30  POINTS= 20  POINTS= 10  POINTS-PRESS N for Normal Mode-Press V for Visual Mode-Then any button to begin',
			printIndex: 0, 
			xoffset: 0, yoffset: 0
		};
	}
	componentDidMount()
	{
		//load resources
		this.state.enemies[0].src = require('../resrc/img/enemy1.png');
		this.state.enemies[0].onload=this.load4;//for syncing problems in canvas
		this.state.enemies[1].src = require('../resrc/img/enemy2.png');
		this.state.enemies[1].onload=this.load3;
		this.state.enemies[2].src = require('../resrc/img/enemy3.png');
		this.state.enemies[2].onload=this.load2;
		this.state.enemies[3].src = require('../resrc/img/specialEnemy.png');
		this.state.enemies[3].onload=this.load1;

		//once loaded, begin setup process
		document.addEventListener("DOMContentLoaded", this.setup);
	}
	load1()//draw in enemies onto canvas
	{
		this.state.ctx.drawImage(this.state.enemies[3], this.state.xstart, this.state.ystart, this.state.esize, this.state.esize);
	}
	load2()
	{
		this.state.ctx.drawImage(this.state.enemies[2], this.state.xstart, this.state.ystart+1*this.state.offset, this.state.esize, this.state.esize);
	}
	load3()
	{
		this.state.ctx.drawImage(this.state.enemies[1], this.state.xstart, this.state.ystart+2*this.state.offset, this.state.esize, this.state.esize);
	}
	load4()
	{
		this.state.ctx.drawImage(this.state.enemies[0], this.state.xstart, this.state.ystart+3*this.state.offset, this.state.esize, this.state.esize);
	}
	newGame(score)
	{
		//display game over and high scores.
		var potential = localStorage.getItem('highscore');
		if (potential != null)
		{
			if (potential < score)
			{
				localStorage.setItem('highscore', score);
				potential = score;
			}
		}
		else
		{
			localStorage.setItem('highscore', score);
			potential = score;
		}
		//set the high score in meta.
		this.setState({ highscore: potential, credit: this.state.credit-1});
		setTimeout(function(){ document.location.reload(true); }, 2000);
	}
	setMeta(score, numlives)
	{
		this.setState({score: score, numberlives: numlives});
	}
	write()
	{
		var printIndex = this.state.printIndex
		if(printIndex >= this.state.printString.length)//if nothing left to print, stop timer for this.
		{
			clearTimeout(this.state.timer);
			return;
		}
		var xoffset=this.state.xoffset, yoffset=this.state.yoffset;
		if(this.state.printString[printIndex] == '=' && printIndex != 0)//shift upwards upon '='
		{
			xoffset=this.state.esize+10;
			yoffset+=this.state.esize+this.state.esize/4;
		}
		else if(this.state.printString[printIndex] == '-')//for instructional data
		{
			xoffset = -this.state.esize;
			yoffset+=this.state.esize; //+this.state.esize/4;
			this.setState({ dashcounter: this.state.dashcounter+1 });
			if(this.state.dashcounter == 1)
			{
				var msg='PRESS N for Normal Mode,';
				window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
			}
			else if(this.state.dashcounter ==2)
			{
				var msg='Press v for Visual Mode,';
				window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
			}
			else{
				var msg='Then any button to begin,';
				window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
			}
		}
		else //all else, just print letter by letter with 15 offset
		{
			if(printIndex!=0)
				xoffset+=15;
		}
		this.state.ctx.fillText(this.state.printString[printIndex]+'', this.state.xstart+xoffset, this.state.ystart+yoffset);
		//get next write sequence
		this.setState({printIndex: this.state.printIndex+1, 
			timer: setTimeout(this.write, 100), 
			xoffset: xoffset, yoffset: yoffset
		});
		
	}
	activate(event)
	{
		var k = event.keyCode;
		if (k==78)//n
			this.normalMode();
		else if(k==86)//v
			this.visualMode();
		else if(k==82)//r
			this.repeat();
	}
	repeat()
	{
		var msg = this.state.lastspoken;
		window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
	}
	setup()
	{
		//https://www.html5rocks.com/en/tutorials/canvas/hidpi/
		///see link above for resolution of text in canvas; canvas is set for proper resolution of img and text here
		var PIXEL_RATIO = (function () {
		    var ctx = document.createElement("canvas").getContext("2d"),
		        dpr = window.devicePixelRatio || 1,
		        bsr = ctx.webkitBackingStorePixelRatio ||
		              ctx.mozBackingStorePixelRatio ||
		              ctx.msBackingStorePixelRatio ||
		              ctx.oBackingStorePixelRatio ||
		              ctx.backingStorePixelRatio || 1;
		
		    return dpr / bsr;
		})();
		
		var w = 800, h = 600;
		var ratio = 4;
		var can = document.getElementById('intro');
		can.width = w * ratio;
		can.height = h * ratio;
		can.style.width = w + "px";
		can.style.height = h + "px";
		this.state.ctx = can.getContext("2d");
		this.state.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

		///canvas formatting for arcadey look
		this.state.ctx.font = '30px ArcadeClassic';
		this.state.ctx.fillStyle = '#FF0000';

		///begin replication of space invaders intro
		var start = 250;
		this.state.ctx.fillText('THE', start, 50);
		this.state.ctx.fillText('SPACE', start+70, 50);
		this.state.ctx.fillText('INVADERS', start+70+100, 50);

		var msg = 'Space Invaders';
		window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));

		this.state.ctx.fillStyle = '#FFFFFF';
		var off1=20;
		var onestart = 315;
		this.state.ctx.fillText('PRESENTS', onestart+off1, 80);
		this.state.ctx.fillText('PART', onestart-12+off1, 110);
		this.state.ctx.fillText('FOUR', onestart+80+off1, 110);
		this.state.ctx.fillText('*SCORE ADVANCE TABLE*', start-10, 180);
		//begin timeout process to display words by ticks.
		this.state.timer = setTimeout(this.write, 500); 

		//custom functionality for repeating audio if last instruction spoken not clearly heard 
		msg = 'Press r to repeat the last instruction spoken,';
		window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
		this.setState({lastspoken: 'PRESS N for Normal Mode, '+'Press v for Visual Mode'});

		//for img formatting
		this.setState({xoffset: this.state.esize+10, yoffset: this.state.esize/2});

		document.addEventListener("keydown", this.activate);
	}
	normalMode()
	{
		this.setState({
			header: <h1>Space Invaders: Normal</h1>,
			game: <Game metaChange={this.setMeta.bind(this)} onNewGame={this.newGame.bind(this)} mode='normal' />,
			norm: '',
			mode: 'normal',
			visual: '',
		});
		clearTimeout(this.state.timer);//stop printing text
		var msg = 'You have selected Normal Mode, The game will proceed as the original space invaders, Click any button to begin';
		this.setState({lastspoken: msg});
//		window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
	}
	visualMode()
	{
		this.setState({
			header: <h1>Space Invaders: Visual</h1>,
			game: <Game metaChange={this.setMeta.bind(this)} onNewGame={this.newGame.bind(this)} mode='visual' />,
			norm: '',
			mode: 'visual',
			visual: '',
		});
		clearTimeout(this.state.timer);//stop printing text
		var tmp = 'When invaders shoot and you are in the line of fire, you will hear a siren signalling you to move, , When an invaders is in range, you will be told to shoot. If you cannot shoot an enemy where you are, whether it is a barrier or no enemy, you will be told no enemy.';
		var xtra = ' The last command said applies until a new command is said. So if the last you hear is shoot and nothing else is said for 20 seconds, that means you have been able to shoot an enemy for those 20 seconds';
		var msg = 'You have selected Visual Mode, '+ tmp + ', Click any button to begin';
		this.setState({lastspoken: tmp});
//		window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
	}
	render()
	{
		return(
			<div>
				<div> {this.state.header} </div>
				<Meta score = {this.state.score} highscore={this.state.highscore} />
				<div> {this.state.game} </div>
				<LowMeta credit={this.state.credit} lives={this.state.numberlives} />
			</div>
		);
	}
}
