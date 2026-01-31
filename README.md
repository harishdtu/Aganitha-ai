# Pastebin Lite

A lightweight Pastebin-like application that allows users to create text pastes and share them via a unique URL.
Each paste can optionally expire based on time-to-live (TTL) or a maximum number of views.

This project was built as a take-home assignment and is designed to work reliably in a serverless environment.

---

## 🚀 Deployed URL

https://aganitha-ai.vercel.app

---

## 🧰 Tech Stack

- Node.js
- Express.js
- Neon PostgreSQL (persistent storage)
- Vercel (serverless deployment)

---

## ✨ Features

- Create a paste with arbitrary text
- Generate a shareable URL
- View pastes via API or browser
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic time support for automated testing
- Safe HTML rendering (no script execution)

---

## 📦 API Endpoints

### Health Check
GET /api/healthz


Postman Test Results:
<img width="1920" height="1080" alt="Screenshot (659)" src="https://github.com/user-attachments/assets/2dbb805f-698f-4124-ba21-a59db9751871" />
- Request: `GET /api/healthz`
- Response: `{ "ok": true }`

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/42bc3f48-5c1c-46fc-bdf5-a954b3d91b01" />
- `POST /api/pastes`
- Show request body + response with `id` and `url`

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/af19d981-064a-4375-992e-697ceb002942" />
- `GET /api/pastes/:id`
- Show content, remaining views, expires_at

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/13df1e14-63c6-408a-869a-2aefff1dd913" />
- Show second or third request returning **404**

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2a2b4823-95f8-435c-bd53-86a87fb963df" />
- Show request with `x-test-now-ms`
- Show **404 after expiry**
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/91467821-9dcf-46d8-82c8-f637c77bdc26" />

