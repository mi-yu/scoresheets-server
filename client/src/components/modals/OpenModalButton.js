import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const OpenModalButton = ({ onClick, text, icon }) => (
	<Button color="green" icon onClick={onClick} className="padded-button">
		<Icon name={icon} />
		{text}
  </Button>
)

export default OpenModalButton
