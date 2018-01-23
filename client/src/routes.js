import HomePage from './containers/HomePage.js'
import LoginPage from './containers/LoginPage.js'
import ProfilePage from './containers/ProfilePage.js'
import DashboardPage from './containers/DashboardPage.js'


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
    },

    {
        path: '/admin/dashboard',
        component: DashboardPage
    }
]

export default routes