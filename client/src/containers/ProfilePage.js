import React from 'react'

const ProfilePage = ({ user }) => (
	<div>
		<h1>Name: {user.name}</h1>
		<h1>Email: {user.email}</h1>
	</div>
)

export default ProfilePage