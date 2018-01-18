import React from 'react'
import HomePage from './containers/HomePage.js';
import LoginPage from './containers/LoginPage.js';
import Auth from './modules/Auth';
import { Redirect } from 'react-router-dom'


const routes = [
    {
        path: '/',
        component: HomePage
    },

    {
        path: '/users/login',
        component: LoginPage
    },

    {
        path: '/users/logout',
        render: () => {
            const authenticated = Auth.isAuthenticated
            if (authenticated) Auth.deauthenticate()

            return (
                <Redirect to='/'/>
            )
        }
    }
]

export default routes;