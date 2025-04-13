# 🤖 WhatsApp Bot - Baileys (Termux Deployment)

This bot uses the [@adiwajshing/baileys](https://https://github.com/Shadow2563-sys/Trial) library to create a WhatsApp bot that runs on Node.js.

> 📱 Perfect for Termux on Android!

---

## 🚀 Features

- Multi-auth support (pairing code / QR)
- Media, sticker, audio support
- Admin commands (/addprem, /banuser, etc.)
- GitHub-based JSON user storage
- Crash-safe and restart-ready

---

## 📲 Termux Setup Instructions

### ✅ Step 1: Install Termux from F-Droid
Download Termux from [https://f-droid.org/packages/com.termux/](https://f-droid.org/packages/com.termux/)  
⚠️ **Avoid the Play Store version** (it's outdated).

---

### ✅ Step 2: Setup Termux Environment

```bash
pkg update && pkg upgrade
pkg install nodejs git ffmpeg imagemagick -y
pkg install python -y
pkg install wget curl -y

✅ Step 3: Clone the Bot Project

git clone https://github.com/Shadow2563-sys/Trial
cd https://github.com/Shadow2563-sys/Trial

✅ Step 5: Run the Bot
node index.js
npm install

✅ Step 5: Run the Bot
node index.js

🔄 Auto Restart with PM2 (optional)
npm install -g pm2
pm2 start index.js --name wa-bot
pm2 save
pm2 startup



🔐 Permissions
If needed, run:
chmod +x index.js
📜 License
This bot is built for educational purposes. You can modify and use it freely. Credits are appreciated!

🧑‍💻 Author
Made with ❤️ by [Vørtëx_Shädøw 軎]
https://wa.me/2348093017755

Telegram: [@Shadow_2563]

GitHub: [https://github.com/Shadow2563-sys/Trial]
