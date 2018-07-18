# ✒️ scoresheets.io (server)

A scorekeeping and judging system for Science Olympiad tournaments.

[![CircleCI](https://circleci.com/gh/mi-yu/scoresheets-server/tree/master.svg?style=svg&circle-token=bd8b567fefd15274b718dd1210c78328e9ae1309)](https://circleci.com/gh/mi-yu/scoresheets-server/tree/master)

### Features:

-   [x] Allows event supervisors to submit scores
-   [x] Automatic generation of scoresheets and awards presentation
-   [ ] ESUS-like time slot registration
-   [ ] Team, schedule, and room management system

### Run Locally:

1.  Install [MongoDB](https://www.mongodb.com/download-center#community)
2.  Install [Node](https://nodejs.org/en/) (comes with npm)
3.  Install Yarn (our package manager) with `npm i -g yarn`
4.  Clone repo

Then in project root:

4.  Create `.env` file with the following contents:

        DB_LOCAL_URL=mongodb://localhost/scoresheets-dev
        NODE_ENV=development
        JWT_SECRET=whatever-string-you-want

5.  Run `yarn install` to install dependencies
6.  In separate console, run `mongod` (local development database)
7.  Run `yarn start:dev`, API server should start up at `localhost:5000`

### Interacting with the API

1.  Install [Postman](https://www.getpostman.com/)
2.  `yarn start:dev`
3.  Hit endpoints with Postman, something like `localhost:5000/status`

### Automated Tests:

1.  Install Jest (testing framework) with `yarn global add jest`
2.  Run `yarn test`
