# Northcoders News API

# 1. Introduction

I have created this Northcoders news API as my backend project during my time on the [Northcoders] (https://www.northcoders.com/) 13 week Javascript bootcamp. 

This is a PSQL database hosted via Heroku which you can visit following this link: https://ag-nc-news.herokuapp.com/

# 2. Instructions

[Clone] (https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) the repository to your desired location and navigate into the cloned folder. 

Run the following command to retrieve all required dependencies:
```
npm install
```

# 3. Local Seeding


To connect to the two databases locally, at root level you will need to create two .env files, one titled ".env.development" and one ".env.test".

Within the "development" file you will need to add the following line: 
```
PGDATABASE=nc_news. 
```
Within the "test" file add: 
```
PGDATABASE=nc_news_test.
```

Once completed, run `npm seed`.

# 4. Testing

Running the command `npm test` will show all tests for this project via [Jest] (https://jestjs.io/).

# 5. Starting the server

Run the command `npm start` to start the server, and visit http://localhost:9090/api in a web browser to view a list of all endpoints available through this API.

# 6. Required Technologies 

Node.js version:

```
v16.14.2
```

PostgreSQL version:

```
v12.9
```

Thank you!