# 紐西蘭蜜月行程網頁

輕量級的紐西蘭行程與花費管理系統。

## 功能

- 📅 **行程管理**：新增、編輯、刪除每日行程
- 💰 **花費記錄**：追蹤各項支出與付款人
- 📊 **統計總覽**：查看總支出、各人支出、分類支出

## 技術棧

- 前端：Vanilla HTML/CSS/JS
- 後端：Node.js + Express
- 資料庫：SQLite

## 本地開發

```bash
npm install
npm start
```

打開瀏覽器：http://localhost:3000

## 部署到 Zeabur

1. 將程式碼上傳到 GitHub
2. 在 Zeabur 建立新服務，連接到 GitHub repo
3. Zeabur 會自動偵測 Dockerfile 並部署

## 頁面

- `/` - 行程頁
- `/expenses.html` - 花費頁
