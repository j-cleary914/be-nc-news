# NC News api

This is the home of the back end for my NC News website created during the Northcoders Bootcamp.  The hosted API is [here](https://ncs-news-be.herokuapp.com/api). The front end react app for this project can be found [here](https://github.com/j-cleary914/fe-nc-news).
  
The entire thing is hosted at https://nc-news-draft.netlify.com


## Getting Started
These instructions will get you a copy of the project up and running on your local machine. 


### Prerequisites
In order to get this running on your local machine you will need the following installed

- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- PostgreSQL 


### Installing

First run the commands

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```
Then to create a database user for PSQL

```
sudo -u postgres createuser --superuser $USER
sudo -u postgres createdb $USER
```
Then enter the terminal application for psql and set you username and password for psql. for USER use your ubuntu username.
```
psql
ALTER USER username WITH PASSWORD 'password';
```
you can exit out of the psql terminal application with /q 


# Cloning to a local machine
- Fork the repository to your own github
- open up a terminal and copy the git link and enter the command 
```
git clone --your forked git URL -- 
```
Then you can install the required packages with
```
npm install
```

# setup databases

To set up and seed the databases, run the commands
```
npm run setup-dbs
npm run seed
```


## Available scripts

to run the tests,the following commands are available to test the endpoints and util functions

```
npm run test
npm run test-utils
```
