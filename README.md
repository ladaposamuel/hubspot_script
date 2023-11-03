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

- [] Consider large data, pagination and limiting queries
- [] Handle errors efficiently so one contact item doesnt break the process

## Built With

- [NodeJS](https://nodejs.org) - The programming language used
- MySQL
- Javascript

## Authors

- **Samuel Ladapo** - *Initial work* - [Samuel ladapo](https://github.com/ladaposamuel)

## Hubspot Screenshots

- user has not completed watching guide videos
https://gitlab.com/falconxxx/sprocket-guides/-/blob/d6772320b7cdab4e8ae4f2d8e007b53732eeaee3/Screenshot_2023-11-03_at_12.17.20_PM.png

- list of synced contacts
https://gitlab.com/falconxxx/sprocket-guides/-/blob/7f47ca54abaaf2e114405261e38090e505141d7f/Screenshot_2023-11-03_at_12.18.18_PM.png

- user has completed watching the videos
https://gitlab.com/falconxxx/sprocket-guides/-/blob/b34e6e9c572ae1437cf62b6731e26618fadd40c5/Screenshot_2023-11-03_at_12.22.18_PM.png