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
			<div>
				<div id='lowborder'></div>
                        	<div id='lowmeta'>
					<div className= "lowcolumn">
						<h2>{this.props.lives} </h2>
					</div>
					<div className= "column">
						<h2>{'CREDIT'+this.props.credit}</h2>
					</div>
                        	</div>
			</div>
                );
        }
}
