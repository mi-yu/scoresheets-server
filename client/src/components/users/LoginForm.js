import React from 'react'
import { Form } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Auth from '../../modules/Auth'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            email: '', 
            password: '',
            errors: {}, 
            user: props.user, 
            token: props.token,
            redirect: false
        }

        this.setUser = props.setUser.bind(this)
    }


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
            Auth.storeToken(res.token)
            this.setState({
                redirect: true
            })

            this.setUser(res.user)
        })
    }

    render() {
        const { password, email, redirect } = this.state

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
                    <Form.Button content='Submit' color='blue'/>
                </Form>
                { redirect && (
                    <Redirect to='/users/me' />
                )}
            </div>
        )
    }
}

export default LoginForm