module.exports = {
	entry: './src/client.js',
	output: {
		path: './public',
		filename: 'bundle.js'
	},
	module:{
		loaders: [
			{
				test:[/\.js$/,/\.jsx$/],
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(ttf|png|jpg|wav|mp3|gif)$/,
				loader: 'file-loader'//?name=resrc
				//http://stackoverflow.com/questions/37671342/how-to-load-image-files-with-webpack-file-loader
				//http://stackoverflow.com/questions/34582405/react-wont-load-local-images
			}
			/*,
			{
				test: [/\.gif$/,/\.mp3$/, /\.wav$/],
				loader: 'file-loader'
			}*/
		]
	},
	resolve:{
		extensions: ['','.js', '.jsx','.json']
	}
};
