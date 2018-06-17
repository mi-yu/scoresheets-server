import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const OpenModalButton = ({ onClick, text, icon }) => (
	<Button color="green" icon onClick={onClick} className="padded-button">
		<Icon name={icon} />
		{text}
	</Button>
)

OpenModalButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
}

export default OpenModalButton
