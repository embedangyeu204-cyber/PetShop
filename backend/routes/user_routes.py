from flask import Blueprint, jsonify

# Tạo Blueprint cho user routes
user_routes = Blueprint("user_routes", __name__)

@user_routes.route("/users", methods=["GET"])
def get_users():
    # Tạm thời trả về dữ liệu mẫu để test
    return jsonify([
        {"UserID": 1, "UserName": "Admin"},
        {"UserID": 2, "UserName": "Customer"},
        {"UserID": 3, "UserName": "Veterinary"}
    ])
