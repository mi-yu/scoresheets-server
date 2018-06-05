import HomePage from './containers/HomePage.js'
import LoginPage from './containers/LoginPage.js'
import ProfilePage from './containers/ProfilePage.js'
import DashboardPage from './containers/DashboardPage.js'
import TournamentManagementPage from './containers/TournamentManagementPage.js'
import BulkAddTeamsPage from './containers/BulkAddTeamsPage.js'
import ScoreEntryPage from './containers/ScoreEntryPage.js'
import ResultsPage from './containers/ResultsPage.js'
import Slideshow from './containers/Slideshow.js'
import RegisterPage from './containers/RegisterPage.js'

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
		component: RegisterPage
	},

	{
		path: '/users/me',
		component: ProfilePage
	},

	{
		path: '/admin/dashboard',
		component: DashboardPage
	},

	{
		path: '/tournaments/:id/manage',
		component: TournamentManagementPage
	},

	{
		path: '/tournaments/:id/edit/bulkAddTeams',
		component: BulkAddTeamsPage
	},

	{
		path: '/tournaments/:id/:division/results',
		component: ResultsPage
	},

	{
		path: '/tournaments/:id/slideshow',
		component: Slideshow
	},

	{
		path: '/scoresheets/:tournamentId/scores/:division/:eventId',
		component: ScoreEntryPage
	}
]

export default routes
