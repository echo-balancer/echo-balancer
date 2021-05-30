import os
from flask import (
    Flask,
    send_from_directory,
    session,
    redirect,
    url_for,
    request,
    jsonify,
)
from authlib.integrations.flask_client import OAuth, OAuthError

app = Flask(__name__, static_folder="build")
app.config.from_object("config")

if app.env == "development":
    from flask_cors import CORS
    CORS(app)

oauth = OAuth(app)
oauth.register(
    name="twitter",
    api_base_url="https://api.twitter.com/1.1/",
    request_token_url="https://api.twitter.com/oauth/request_token",
    access_token_url="https://api.twitter.com/oauth/access_token",
    authorize_url="https://api.twitter.com/oauth/authenticate",
    fetch_token=lambda: session.get("token"),  # TODO: Save to DB
)


@app.errorhandler(OAuthError)
def handle_error(error):
    print(error)
    return redirect("/?auth=error")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/auth/login")
def login():
    redirect_uri = url_for("authorize", _external=True)
    return oauth.twitter.authorize_redirect(redirect_uri)


@app.route("/auth/logged_in")
def logged_in():
    print(str(session.get("token", False)))
    print(str(session))
    return jsonify({"logged_in": not not session.get("token", False)})


@app.route("/auth/authorize")
def authorize():
    token = oauth.twitter.authorize_access_token()
    url = "account/verify_credentials.json"
    resp = oauth.twitter.get(url, params={"skip_status": True})
    user = resp.json()
    # TODO: Save to DB
    session["token"] = token
    session["user"] = user
    print(str(session))
    return redirect("/?auth=login")


@app.route("/auth/logout")
def logout():
    session.pop("token", None)
    session.pop("user", None)
    return redirect("/?auth=logout")


@app.route("/api/hello")
def hello():
    return "Hello, World!"


@app.route("/api/tweets")
def list_tweets():
    url = "statuses/user_timeline.json"
    params = {"include_rts": 1, "count": 200}
    prev_id = request.args.get("prev")
    if prev_id:
        params["max_id"] = prev_id

    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id

    resp = oauth.twitter.get(url, params=params)
    tweets = resp.json()
    print(str(tweets))
    return jsonify(tweets)


@app.route("/api/followers")
def list_followers():
    url = "followers/list.json"
    params = {"count": 200}
    offset_id = request.args.get("offset")
    if offset_id:
        params["cursor"] = offset_id

    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id

    resp = oauth.twitter.get(url, params=params)
    followers = resp.json()
    print(str(followers))
    return jsonify(followers)


@app.route("/api/friends")
def list_friends():
    url = "friends/list.json"
    params = {"count": 200}
    offset_id = request.args.get("offset")
    if offset_id:
        params["cursor"] = offset_id

    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id

    resp = oauth.twitter.get(url, params=params)
    friends = resp.json()
    print(str(friends))
    return jsonify(friends)


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
