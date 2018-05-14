import React from 'react'
import { Form, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Auth from '../../modules/Auth'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            email: '', 
            password: '',
            message: '', 
            user: props.user, 
            token: props.token,
            loginSucess: false,
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
        .catch(err => console.log(err))
        .then(res => {
            if (res.success) {
                Auth.storeToken(res.token)
                this.setUser(res.user)
                this.setState({
                    redirect: true
                })
            } else {
                this.setState({
                    message: res.message
                })
            }
        })
    }

    render() {
        const { password, email, redirect, message, loginSucess } = this.state

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
                { message && (
                    <Message
                        error={!loginSucess}
                        content={message}
                    />
                )}
                { redirect && (
                    <Redirect to='/users/me' />
                )}
            </div>
        )
    }
}

export default LoginForm