import os

from flask import Flask, flash, redirect, render_template, request, session, url_for

from auth import create_user, init_db, verify_user

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "tvisha-dev-secret")

init_db()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if len(username) < 3:
            flash("Username must be at least 3 characters long.")
            return redirect(url_for("signup"))
        if len(password) < 6:
            flash("Password must be at least 6 characters long.")
            return redirect(url_for("signup"))
        if password != confirm_password:
            flash("Passwords do not match.")
            return redirect(url_for("signup"))
        if not create_user(username, password):
            flash("That username is already taken. Please choose another.")
            return redirect(url_for("signup"))

        user = verify_user(username, password)
        session["user_id"] = user["id"]
        session["username"] = user["username"]
        flash("Account created! You're now logged in.")
        return redirect(url_for("index"))

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        user = verify_user(username, password)
        if user is None:
            flash("Invalid username or password.")
            return redirect(url_for("login"))

        session["user_id"] = user["id"]
        session["username"] = user["username"]
        flash("Logged in successfully.")
        return redirect(url_for("index"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    session.pop("username", None)
    flash("You have been logged out.")
    return redirect(url_for("index"))


@app.route("/result")
def result():
    return render_template("result.html")


if __name__ == "__main__":
    app.run(debug=True, port=5001)

