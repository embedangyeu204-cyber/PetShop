from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# Khởi tạo Blueprint
user_routes = Blueprint("user_routes", __name__)

# Giả lập dữ liệu người dùng (tạm thời)
users = {
    "admin": {"password": "123456", "role": "admin"},
    "user": {"password": "password", "role": "customer"}
}

# 🔹 Route đăng nhập
@user_routes.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username not in users or users[username]["password"] != password:
        return jsonify({"message": "Sai tên đăng nhập hoặc mật khẩu!"}), 401

    token = create_access_token(identity=username)
    return jsonify({
        "message": "Đăng nhập thành công!",
        "access_token": token,
        "user": {"username": username, "role": users[username]["role"]}
    }), 200

# 🔹 Route lấy thông tin người dùng (chỉ test token)
@user_routes.route("/api/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({"message": "Thông tin người dùng", "username": current_user})
