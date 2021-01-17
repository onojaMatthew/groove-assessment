Contact/Address Book (Rest Backend) Concept - Assessment
===

---

* Pull the assessment solution repo
    - > `git clone https://github.com/onojaMatthew/groove-assessment`
* Pull up your favorite console and change to this directory
* Install the projects dependencies 
    - > `npm install`

Set up Environment Variables
---
* To declare environment variables for the project
* Create a `.env` file in the root directory of the project and add the following environment variables
* To add Database URI connection string (local URI string or cloud database URI string)
    - > `DEV_DB=mongodb://localhost:27017/contact` and `TEST_DB=mongodb://localhost:27017/test`
* To add secret key for jsonwebtoken token to `.env` file
    - > `SECRET_KEY=yoursecretkey`
* To add sendgrid api key and sender email for FORGOT PASSWORD emailing to `.env` file
    - > `SENDGRID_API_KEY=add_sendgrid_api_key_here` or `SENDGRID_API_KEY=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`
    - > `SENDGRID_SENDER_EMAIL=add_your_sendgrid_sender_email_here` or `SENDGRID_SENDER_EMAIL=matthew.onoja@ojirehprime.com`

* To set development or test environment mode in the `.env` file
    - > `NODE_ENV=development` for development mode or `NODE_ENV=test` for test mode


Start Development 
---
* To build the project
    - > `npm run build`
* To continuously watch for changes 
    - > `npm run watch`
* To run your app server 
    - > `npm run start`
* To test your app
    - > `npm run test`

Start Test 
---
* Change `NODE_ENV` from development to test mode in the `.env` file to connect to the TEST mongodb database
    - > `NODE_ENV=test`
* To build the project
    - > `npm run build`
* To continuously watch for changes 
    - > `npm run watch`
* To run test
    - > `npm run test`




