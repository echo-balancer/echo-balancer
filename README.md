# Echo Chamber Meter

```sh
python3 -m venv venv
. venv/bin/activate

# Build client app
yarn
yarn build

# Run client app with server
TWITTER_CLIENT_ID=<...> TWITTER_CLIENT_SECRET=<...> SECRET_KEY='!secret' FLASK_ENV=development flask run -h localhost
```
