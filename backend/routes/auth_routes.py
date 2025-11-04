from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models import get_db

auth_routes = Blueprint("auth_routes", __name__)
bcrypt = Bcrypt()

@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    sql = "INSERT INTO users (UserName, Password, Email, Role) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (data["username"], hashed_pw, data["email"], data["role"]))
    conn.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE Email=%s", (data["email"],))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user["Password"], data["password"]):
        token = create_access_token(identity={"id": user["UserID"], "role": user["Role"]})
        return jsonify({"token": token, "role": user["Role"]}), 200
    return jsonify({"error": "Invalid credentials"}), 401
