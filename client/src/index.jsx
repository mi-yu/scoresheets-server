import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import Base from './components/Base'
import './styles/style.css'

ReactDOM.render(<Base />, document.getElementById('root'))

if (module.hot) {
	module.hot.accept()
}
