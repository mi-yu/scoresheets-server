import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import Auth from '../../modules/Auth'

class LoginForm extends React.Component {
    state = { email: '', password: '', errors: {}, user: {}, token: '' }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = (e) => {
        e.preventDefault()

        const { email, password } = this.state

        const payload = {
            email,
            password
        }

        fetch('/users/login', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        }).then(data => data.json())
        .catch(err => console.err(err))
        .then(res => {
            this.setState({user: res.user, token: res.token})
            Auth.authenticate(res.token)
        })

        this.setState({ email: email, password: password })
    }

    render() {
        const { password, email, user, token } = this.state

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field required>
                        <label>Email</label>
                        <Form.Input placeholder='Email' name='email' value={email} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Password</label>
                        <Form.Input type='password' name='password' value={password} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Button content='Submit' color='primary'/>
                </Form>
                <pre>{JSON.stringify(user)}</pre>
                <pre>{token}</pre>
            </div>
        )
    }
}

export default LoginForm