import React from 'react'
import HomePage from './containers/HomePage.js';
import LoginPage from './containers/LoginPage.js';
import ProfilePage from './containers/ProfilePage.js'
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
        path: '/users/register',
        component: HomePage
    },

    {
        path: '/users/me',
        component: ProfilePage
    }
]

export default routes;