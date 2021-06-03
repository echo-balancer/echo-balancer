import os
import pickle
from flask import (
    Flask,
    send_from_directory,
    render_template,
    session,
    redirect,
    url_for,
    request,
    jsonify,
)
from authlib.integrations.flask_client import OAuth

from tensorflow import keras

from util import get_diversity

app = Flask(__name__, static_folder="build", template_folder="build")

app.config.from_object("config")

model = keras.models.load_model("./race_prediction/race_predictor_mvp")
encoder = pickle.load(open("./race_prediction/encoder.pkl", "rb"))

oauth = OAuth(app)
oauth.register(
    name="twitter",
    api_base_url="https://api.twitter.com/1.1/",
    request_token_url="https://api.twitter.com/oauth/request_token",
    access_token_url="https://api.twitter.com/oauth/access_token",
    authorize_url="https://api.twitter.com/oauth/authenticate",
    fetch_token=lambda: session.get("token"),  # TODO: Save to DB
)


# @app.errorhandler(OAuthError)
# def handle_error(error):
#     print(error)
#     return redirect("/?auth=error")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return render_template("index.html", login=not not session.get("token", False))


@app.route("/auth/login")
def login():
    redirect_uri = url_for("authorize", _external=True)
    return oauth.twitter.authorize_redirect(redirect_uri)


@app.route("/auth/authorize")
def authorize():
    token = oauth.twitter.authorize_access_token()
    url = "account/verify_credentials.json"
    resp = oauth.twitter.get(url, params={"skip_status": True})
    user = resp.json()
    # TODO: Save to DB
    session["token"] = token
    session["user"] = user
    # print(str(session))
    return redirect("/")


@app.route("/auth/logout")
def logout():
    session.pop("token", None)
    session.pop("user", None)
    return redirect("/")


@app.route("/api/me")
def users():
    if not session.get("user", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401
    return jsonify(session.get("user"))


@app.route("/api/followers")
def list_followers():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

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
    # print(str(followers))
    return jsonify(followers)


@app.route("/api/friends")
def list_friends():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

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
    # print(str(friends))
    return jsonify(friends)


@app.route("/api/diversity")
def diversity():
    # TODO: may need more work around pagination
    url = "friends/list.json"
    params = {"count": 200}
    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id
    resp = oauth.twitter.get(url, params=params)
    friends_data = resp.json()
    aggregated_results = get_diversity(friends_data, model, encoder)
    for k, v in aggregated_results.items():
        # 'numpy.int64' is not is not JSON serializable
        aggregated_results[k] = int(v)
    return jsonify(aggregated_results)


if __name__ == "__main__":
    # model = keras.models.load_model("race_predictionrace_predictor_mvp")
    # encoder = pickle.load(open('race_prediction/encoder.pkl', 'rb'))
    app.run(host="localhost", port=5000, debug=True)
