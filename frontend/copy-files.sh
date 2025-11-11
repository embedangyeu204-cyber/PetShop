#!/bin/bash
# Script để copy tất cả files cần thiết vào project

# ===== CẤU HÌNH =====
# Thay đổi đường dẫn này thành đường dẫn project của bạn
PROJECT_PATH="/Users/nguyenphuong/Documents/petshop/frontend"
DEST_DIR="$PROJECT_PATH/src/components/loginpage"

# ===== SCRIPT =====
echo "🚀 Đang copy files vào project..."
echo ""

# Tạo thư mục nếu chưa có
mkdir -p "$DEST_DIR"

# Copy từng file
echo "📦 Copying AuthPage.js..."
cp AuthPage.js "$DEST_DIR/"

echo "📦 Copying adminlogin.js..."
cp adminlogin.js "$DEST_DIR/"

echo "📦 Copying customerlogin.js..."
cp customerlogin.js "$DEST_DIR/"

echo "📦 Copying login.js..."
cp login.js "$DEST_DIR/"

echo "📦 Copying login.css..."
cp login.css "$DEST_DIR/"

echo "📦 Copying createaccount.js..."
cp createaccount.js "$DEST_DIR/"

echo "📦 Copying createaccount.css..."
cp createaccount.css "$DEST_DIR/"

echo ""
echo "✅ Copy hoàn tất!"
echo ""
echo "📁 Files đã được copy vào:"
echo "   $DEST_DIR"
echo ""
echo "🔍 Kiểm tra files:"
ls -la "$DEST_DIR"
echo ""
echo "🧹 Tiếp theo, chạy lệnh này để clear cache:"
echo "   cd $PROJECT_PATH"
echo "   rm -rf node_modules/.cache"
echo "   npm start"