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
					<h2>{'SCORE< 1 >'}</h2>
					{'  '+this.props.score} 
				</div>
				<div className= "column">
					<h2>{'HI-SCORE'}</h2>
					{'     '+ this.props.highscore}
				</div>
				<div className= "column">
					<h2>{'SCORE< 2 >'}</h2>
				</div>
                        </div>
                );
        }
}
