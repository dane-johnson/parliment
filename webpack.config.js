module.exports = {
	entry: './src/index.js',
	output: {
		filename: "bundle.js",
		path: '.'
	},
	module: {
		loaders: [{
			exclude: /node_modules/,
			loader: 'babel'
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}