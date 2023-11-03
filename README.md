# Guide Video Sync Script

---

## Description

GVSS is a small script written in NodeJS that syncs user's guide watch video log to their HubSpot account.

## How to set-up

1. Clone the project into you working directory
2. Run `yarn` to install all necessary packages
3. Update `.env` with your DB credentials and HubSpot Access token
4. Run `yarn global add` or `npm install -g .` to access the command script name from anywhere.
5. Run `sync-guides` to run script

## TODO

- [] Condider large data, pagination and limiting queries
- [] Handle errors efficiently so one contact item doesnt break the process

## Built With

- [NodeJS](https://nodejs.org) - The programming language used
- MySQL
- Javascript

## Authors

- **Samuel Ladapo** - *Initial work* - [Samuel ladapo](https://github.com/ladaposamuel)
