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
MAX_PAGES = 3

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
    return jsonify(followers)


@app.route("/api/friend_ids")
def list_friend_ids():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    url = "friends/ids.json"
    params = {"count": 5000}

    count = request.args.get("count")
    if count:
        params["count"] = count

    offset_id = request.args.get("offset")
    if offset_id:
        params["cursor"] = offset_id

    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id

    resp = oauth.twitter.get(url, params=params)
    friends = resp.json()
    return jsonify(friends)


@app.route("/api/users/lookup", methods=["POST"])
def list_users():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    url = "users/lookup.json"
    data = {}

    request_body = request.json
    offset_id = request_body.get("offset")
    if offset_id:
        data["cursor"] = offset_id

    user_id = request_body.get("user_id")
    if user_id:
        data["user_id"] = user_id

    resp = oauth.twitter.post(url, data=data)
    return jsonify(resp.json())


@app.route("/api/v2/diversity")
def v2_diversity():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    friends = __fetch_friends()
    aggregated_results = get_diversity(friends, model, encoder)

    for k, v in aggregated_results.items():
        # 'numpy.int64' is not is not JSON serializable
        aggregated_results[k] = int(v)
    return jsonify(aggregated_results)


@app.route("/api/friends")
def list_friends():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    friends = __fetch_friends()
    return jsonify(friends)


@app.route("/api/get_follows/<offset_id>")
def get_follows(offset_id=None):
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    url = "friends/list.json"
    params = {"count": 200}
    offset_id = offset_id or request.args.get("offset")
    if offset_id:
        params["cursor"] = offset_id

    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id

    resp = oauth.twitter.get(url, params=params)
    friends = resp.json()
    return friends


@app.route("/api/influencer_recommendations")
def get_influencer_recommendations():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    url = "lists/members.json"
    params = {"count": 89, "list_id": 1230956746601975808}

    resp = oauth.twitter.get(url, params=params)
    return jsonify(resp.json())


@app.route("/api/diversity")
def diversity():
    if not session.get("token", False):
        return jsonify({"message": "ERROR: Unauthorized"}), 401

    data = []
    offset = None
    for i in range(MAX_PAGES):
        if i == 0 or offset:
            response = get_follows(offset)
            if "errors" in response:
                return jsonify({"message": "Twitter Error: " + response["errors"][0]["message"] + ". Please try again later."}), 500
            data.extend(response['users'])
            offset = response.get('next_cursor')

    aggregated_results = get_diversity(data, model, encoder)

    for k, v in aggregated_results.items():
        # 'numpy.int64' is not is not JSON serializable
        aggregated_results[k] = int(v)
    return jsonify(aggregated_results)


def __fetch_friends():
    # Get friend ids
    url = "friends/ids.json"
    params = {"count": 5000}

    user_id = request.args.get("user_id")
    if user_id:
        params["user_id"] = user_id

    count = request.args.get("count")
    if count:
        params["count"] = count

    response = oauth.twitter.get(url, params=params)
    friend_ids = response.json()
    if "errors" in friend_ids:
        return jsonify({"message": "Twitter Error: " + friend_ids["errors"][0]["message"] + ". Please try again later."}), 500

    # Fetch users
    user_ids = [str(id) for id in friend_ids["ids"]]
    user_url = "users/lookup.json"

    friends = []
    for i in range(0, len(user_ids), 100):
        resp = oauth.twitter.post(user_url, data={"user_id": ",".join(user_ids[i:i+100])})
        resp_body = resp.json()
        if "errors" in resp_body:
            return jsonify({"message": "Twitter Error: " + resp_body["errors"][0]["message"] + ". Please try again later."}), 500
        friends.extend(resp_body)
    return friends

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
