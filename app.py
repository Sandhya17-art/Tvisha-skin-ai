import base64
import io
import os

from flask import Flask, flash, redirect, render_template, request, session, url_for
from PIL import Image, UnidentifiedImageError

from auth import create_user, init_db, verify_user
from face_validation import validate_and_crop_face
from model_inference import load_model, predict
from recommendation_engine import get_recommendation

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "tvisha-dev-secret")

init_db()

MODEL_PATH = "best_skin_model_8class.pth"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

try:
    model = load_model(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")
except FileNotFoundError as e:
    model = None
    print(f"WARNING: {e}")


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


@app.route("/analyze", methods=["POST"])
def analyze():
    if "user_id" not in session:
        flash("Please log in to analyze your skin.")
        return redirect(url_for("login"))

    if model is None:
        flash("Model not loaded. Place best_skin_model_8class.pth in the project root.")
        return redirect(url_for("index"))

    file = request.files.get("skin_image")
    if not file or file.filename == "":
        flash("Please select an image before submitting.")
        return redirect(url_for("index"))

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        flash("Unsupported file type. Please upload PNG, JPG, JPEG, or WEBP.")
        return redirect(url_for("index"))

    image_bytes = file.read()
    if len(image_bytes) > MAX_UPLOAD_SIZE_BYTES:
        flash("File too large. Maximum size is 10 MB.")
        return redirect(url_for("index"))

    try:
        uploaded_image = Image.open(io.BytesIO(image_bytes))
        uploaded_image.load()
    except UnidentifiedImageError:
        flash("Could not read that image. Please try a different file.")
        return redirect(url_for("index"))

    face_image, face_error = validate_and_crop_face(uploaded_image)
    if face_error:
        flash(face_error)
        return redirect(url_for("index"))

    face_buf = io.BytesIO()
    face_image.save(face_buf, format="PNG")
    face_bytes = face_buf.getvalue()

    result = predict(model, face_bytes)
    recommendation = get_recommendation(result["predicted_class"])

    preview_uri = "data:image/png;base64," + base64.b64encode(face_bytes).decode()

    return render_template(
        "result.html",
        prediction=result,
        recommendation=recommendation,
        preview_uri=preview_uri,
    )


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True, port=5001)
