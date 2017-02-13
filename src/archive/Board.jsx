import React from 'react';
import Slot from './Slot';

export default class Board extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={
			board: [0,1,2,3,4,5,6,7,8],
			turn: 'o',
			/*
			0 1 2
			3 4 5
			6 7 8	
			*/
			checks: [
			[0,1,2],
			[0,3,6],
			[6,7,8],
			[2,5,8],
			[0,4,8],
			[6,4,2]
			]
		};
		this.onClick=this.onClick.bind(this);
	}
	onClick()
	{
		this.setState({turn: (this.state.turn == 'o' ? 'x' : 'o') });
		//console.log(this.state.turn);
		//check for win
		var elems = document.getElementsByClassName('slot');
		for (var i =0; i<6; i++)
		{
			var player=elems[this.state.checks[i][0]].innerHTML;
			if(player=='x' || player=='o')
			{
				console.log(player);
				var match = true;
				if( !( player == elems[this.state.checks[i][1]].innerHTML && player == elems[this.state.checks[i][2]].innerHTML) )
					match=false;
				if (match)
				{
					console.log(player+ ' wins!!');
					break;
				}
			}
		}
	}
	handleClick()
	{
		//this.props.onChange(turn);
		//this.setState({turn: (turn == 'o' ? 'x' : 'o')});
		//this.setState({turn: (this.props.turn == 'o' ? 'x' : 'o')});
		if (!this.state.move)
		{
			this.setState({value: this.props.turn});
			this.setState({move: true});
			//console.log('prop turn is ' + this.state.value);
		}
	}
	render()
	{
		var ret = this.state.board.map(	function(value) { 
				return(
					<Slot turn={this.state.turn} onClick={this.handleClick} key={value} />
				);
			}
		, this); 
		return <div onClick={this.onClick} id="board">{ret}</div>;
	}
}
