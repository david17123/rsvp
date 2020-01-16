# RSVP app for wedding

A simple RSVP web app to manage guest bookings.

## Setup
This project is comprised of Firebase functions and Firebase hosting that make
up the back-end and front-end portions respectively. Each of these sections need
to be provisioned to run locally.

The front-end portion requires a working `.env` file containing the keys as
listed in `.env.example`.

### Firebase functions
```
cd functions
yarn install
```

### Firebase hosting
```
cd hosting
yarn install
```

### Spinning up local development
```
yarn start
```
