import React from 'react';

export default class App extends React.Component{
        constructor(props)
        {
                super(props);
                this.state={
                };
        }
        render()
        {
                return(
                        <div id='meta'>
				<div className= "column">
					<h2>{'SCORE'}</h2>
					{'  '+this.props.score} 
				</div>
				<div className= "column">
					<h2>{'HI-SCORE [N]'}</h2>
					{'     '+ this.props.nhighscore}
				</div>
				<div className= "column">
					<h2>{'HI-SCORE [V]'}</h2>
					{'     '+ this.props.vhighscore}
				</div>
                        </div>
                );
        }
}
