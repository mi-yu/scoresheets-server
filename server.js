const app = require('./app')

app.listen(app.get('port'), () => {
	console.log('App running at localhost:%d in %s mode', app.get('port'), app.get('env'))
})
