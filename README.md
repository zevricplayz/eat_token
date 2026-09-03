# 🚀 Free Fire EAT Token Generator

A simple web-based tool to extract **EAT Tokens** and generate **access tokens** from Garena authentication callback URLs.

⚠️ **Educational Purpose Only** - For learning how authentication flows work.

---

## 🌐 Live Website

Visit the live tool: [Free Fire EAT Token Generator](https://zevricplayz.github.io/eat_token/)

---

## 📖 About

This tool helps developers and Free Fire enthusiasts:
- Understand Garena authentication flow
- Extract EAT tokens from callback URLs
- Generate access token responses for testing
- Learn how authentication tokens work in gaming APIs

---

## ✨ Features

✅ Simple and clean interface  
✅ Multiple login providers (Google, Facebook, Apple, Twitter, VK)  
✅ Automatic EAT token extraction  
✅ One-click access token generation  
✅ Copy buttons for easy sharing  
✅ Fully responsive design  
✅ Fast and lightweight  

---

## 📋 How to Use

### Step 1: Select a Login Provider
Choose your preferred authentication method (Google, Facebook, Apple, X/Twitter, or VK)

### Step 2: Complete Authentication
You will be redirected to Garena's official login page. Complete the login process.

### Step 3: Find Your Callback URL
After successful login, look for URLs in your browser history containing:
- `/callback/?eat=`
- `?eat=`
- `api-ticket.ff.gameid.garena.co.id`
- `ticket.kiosgamer.co.id`

### Step 4: Example URLs

**Garena Callback URL:**
```
https://api-ticket.ff.gameid.garena.co.id/oauth/callback/?eat=YOUR_EAT_TOKEN&lang=en&region=ID&account_id=123456&nickname=YourName
```

**Kiosgamer URL:**
```
https://ticket.kiosgamer.co.id/?eat=YOUR_EAT_TOKEN&lang=en&region=ID&account_id=123456&nickname=YourName
```

### Step 5: Generate Access Token
1. Copy the full callback URL
2. Paste it into the input box
3. Click **Generate Access Token**
4. Your EAT token and access token will be displayed

### Step 6: Copy and Use
Use the **Copy** buttons to copy tokens for testing or development.

---

## 📁 Files

- `index.html` - Main HTML file with structure
- `style.css` - Styling and responsive design
- `script.js` - Token extraction and generation logic
- `README.md` - Documentation

---

## 🔒 Security Notice

⚠️ **Important:**
- This tool is for **educational purposes only**
- Do not misuse tokens or APIs
- Do not violate Garena Terms & Conditions
- Avoid automated abuse of the system
- Use at your own risk
- The developer is not responsible for misuse

---

## 🛠 Installation (Local Setup)

1. Clone this repository:
```bash
git clone https://github.com/zevricplayz/eat_token.git
cd eat_token
```

2. Open `index.html` in your web browser

3. Or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

---

## 💻 Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript (Vanilla)** - Functionality
- **Font Awesome** - Icons

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests

---

## 📞 Support

If you have questions or issues, feel free to open an issue on GitHub.

---

**Made with ❤️ for the Free Fire Community**  
*Educational Tool | Not Affiliated with Garena*