# ✒️ Scribe
A scorekeeping and judging system for Science Olympiad tournaments.

### Features:
- [ ] Allows event supervisors to submit scores
- [ ] Automatic generation of scoresheets and awards presentation
- [ ] ESUS-like time slot registration
- [ ] Team, schedule, and room management system


### Run Locally:
1. Install [MongoDB](https://www.mongodb.com/download-center#community)
2. Install [Node](https://nodejs.org/en/) (comes with npm)
3. Clone repo

Then in project root:

4. Create `.env` file with the following contents:

		DB_LOCAL_URL=mongodb://localhost/scribe
		NODE_ENV=development
		
5. Run `npm install -g gulp`
6. Run `npm install`
7. In separate console, run `mongod` (local development server)
8. Run `npm start-dev`
