# Social Feed API

An API to aggregate all your social media content into one place. Takes care of authentication server side so front-end frameworks can consume the read-only API.

Includes API cache to keep things quick.

### Routes

`GET /feed` - Facebook, Twitter and YouTube content combined in chronological order.
`GET /facebook` - Facebook content.
`GET /twitter` - Twitter content.
`GET /youtube` - YouTube content.