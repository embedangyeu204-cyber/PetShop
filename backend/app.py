from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Import các routes
from routes.user_routes import user_routes
from routes.product_routes import product_routes

app = Flask(__name__)
CORS(app)  # Cho phép frontend (localhost:3000) gọi API
app.config["JWT_SECRET_KEY"] = "super_secret_key"
jwt = JWTManager(app)

# 🔹 Đăng ký các Blueprint
app.register_blueprint(user_routes)
app.register_blueprint(product_routes)

# 🔹 Trang chủ để kiểm tra server
@app.route("/")
def home():
    return "🐾 PetShop API Server is running!"

# 🔹 Route test kết nối frontend-backend
@app.route("/api/test")
def test_connection():
    return jsonify({"message": "Backend is running!"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
