from flask import Blueprint, jsonify, request
from models import get_db

# Tạo Blueprint cho sản phẩm
product_routes = Blueprint("product_routes", __name__)

@product_routes.route("/products", methods=["GET"])
def get_products():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    conn.close()
    return jsonify(products)

@product_routes.route("/products", methods=["POST"])
def add_product():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    sql = "INSERT INTO products (ProductName, Price, StockQuantity, CategoryID) VALUES (%s,%s,%s,%s)"
    cursor.execute(sql, (data["ProductName"], data["Price"], data["StockQuantity"], data["CategoryID"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product added successfully!"})
