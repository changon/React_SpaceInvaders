import React from 'react';

export default class Slot extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			value: ' ',
			move: false
		};
		this.onClick=this.props.onClick.bind(this);
	}
	render()
	{
		return(
			<button onClick={this.onClick} className="slot">
				{this.state.value}
			</button>
		);
	}
}
