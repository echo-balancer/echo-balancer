# Echo Balancer

## #HackForChange

- Project intro video: https://youtu.be/duXtvIGEOio
- About the hackathon: https://www.techforaapi.org/hackforchange

## Development
```sh
curl https://get.volta.sh | bash

python3 -m venv venv
. venv/bin/activate

# Build client app
yarn
yarn build

# Run client app with server
TWITTER_CLIENT_ID=<...> TWITTER_CLIENT_SECRET=<...> SECRET_KEY='!secret' FLASK_ENV=development \
flask run -h localhost
```

In development mode (`yarn start`), login will redirect to server root.
You can manually load http://localhost:3000 to visit development app.
