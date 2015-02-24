# Social Feed API

An API to aggregate all your social media content into one place. Takes care of authentication server side so front-end frameworks can consume the read-only API.

Includes API cache to keep things quick.

### Installation

`npm install`

Add appropriate credentials to `services/credentials.js`.

Fire up `localhost:5050` to see the API in action.

### Routes

- `GET /feed`: Facebook, Twitter and YouTube content combined in chronological order.
- `GET /facebook`: Facebook content.
- `GET /twitter`: Twitter content.
- `GET /youtube`: YouTube content.