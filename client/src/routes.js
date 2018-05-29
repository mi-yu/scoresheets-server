import HomePage from './containers/HomePage.js'
import LoginPage from './containers/LoginPage.js'
import ProfilePage from './containers/ProfilePage.js'
import DashboardPage from './containers/DashboardPage.js'
import TournamentManagementPage from './containers/TournamentManagementPage.js'
import BulkAddTeamsPage from './containers/BulkAddTeamsPage.js'
import ScoreEntryPage from './containers/ScoreEntryPage.js'

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
		path: '/scoresheets/:tournamentId/scores/:division/:eventId',
		component: ScoreEntryPage
	}
]

export default routes
