# 🤖 ResolveAI - Your 24/7 AI Support Agent

<div align="center">

![ResolveAI Logo](public/resolveai-logo.png)

**An Intelligent Customer Support Platform Powered by AI**

[![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Key Capabilities](#-key-capabilities)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [📊 Screenshots](#-screenshots)
- [🔧 Configuration](#-configuration)
- [📝 Usage Guide](#-usage-guide)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## ✨ Features

### 💬 **Intelligent Chat System**
- 🧠 **Smart Intent Detection** - Automatically identifies user intent from 9+ categories
- ⚡ **Real-time Responses** - Lightning-fast AI responses (400-800ms)
- 📎 **File Upload Support** - Upload and discuss documents, images, and files
- 🔄 **Conversation History** - Save and restore previous conversations
- 🎭 **Multiple Response Templates** - Dynamic, context-aware responses

### 📊 **Analytics Dashboard**
- 📈 **Real-time Metrics** - Track tickets resolved, satisfaction scores, cost savings
- 📉 **Interactive Charts** - Visualize data with beautiful charts (Recharts)
- 📅 **Date Range Filtering** - Filter analytics by Today, Week, or Month
- 📤 **Report Export** - Export reports in PDF, CSV, JSON, or TXT formats
- 🎯 **Performance Insights** - Monitor resolution times and team efficiency

### 👥 **Team Management**
- 👤 **Agent Status Tracking** - Monitor online/offline status
- 📝 **Activity Feed** - Real-time login/logout activity tracking
- ⏱️ **Work Hours Monitoring** - Track agent working hours
- 🔔 **Live Updates** - Instant notifications for team activities

### 🔐 **Authentication System**
- 🔑 **Secure Login** - Email/password authentication
- 👤 **User Profiles** - Personalized user experience
- 🚪 **Session Management** - Secure logout functionality
- 🎨 **Beautiful UI** - Modern, gradient-based login page

### 🎨 **Modern UI/UX**
- 🌈 **Purple Gradient Theme** - Stunning visual design
- 📱 **Fully Responsive** - Works on all devices
- ⌨️ **Keyboard Shortcuts** - Quick navigation with hotkeys
- 🔔 **Toast Notifications** - Elegant notification system
- 🎭 **Smooth Animations** - Polished transitions and effects

### 📚 **Documentation**
- 📖 **Built-in Docs** - Comprehensive in-app documentation
- ❓ **Help Modal** - Quick access to keyboard shortcuts
- 💡 **User Guide** - Step-by-step usage instructions

---

## 🎯 Key Capabilities

### **AI-Powered Intent Recognition**
ResolveAI automatically detects and responds to:
- 📦 **Order Tracking** - Package status, shipping updates
- 💰 **Refund Requests** - Return processing, money-back guarantees
- 🔐 **Password Reset** - Account recovery, security issues
- 💳 **Billing Issues** - Payment problems, subscription queries
- ❌ **Cancellations** - Subscription management, account closure
- 🛠️ **Technical Support** - Bug fixes, troubleshooting
- 📋 **Product Information** - Pricing, features, comparisons
- 😡 **Angry Customers** - Empathetic escalation handling
- 💬 **General Queries** - Friendly greetings and assistance

### **Enterprise-Grade Features**
- ✅ **Multi-format Export** - PDF, CSV, JSON, TXT reports
- ✅ **Real-time Analytics** - Live dashboard updates
- ✅ **Team Collaboration** - Multi-agent support
- ✅ **Conversation History** - Persistent chat logs
- ✅ **File Attachments** - Document sharing in chat
- ✅ **Custom API Integration** - Claude AI API support

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Prathammehta07/ResolveAI-Your-24-7-AI-Support-Agent-.git
cd ResolveAI-Your-24-7-AI-Support-Agent-
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
ResolveAI/
├── public/                 # Static assets
│   ├── resolveai-logo.png
│   ├── user-avatar.png
│   └── ai-avatar.png
├── src/
│   ├── components/         # React components
│   │   ├── ChatWindow.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MessageInput.tsx
│   │   ├── ReportExportModal.tsx
│   │   ├── TeamManagement.tsx
│   │   ├── Documentation.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useClaudeAPI.ts
│   │   └── useNotifications.ts
│   ├── utils/             # Utility functions
│   │   ├── intentDetector.ts
│   │   ├── reportExport.ts
│   │   └── demoData.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── pages/             # Page components
│   │   └── Home.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### **State Management**
- **React Hooks** - useState, useEffect, useCallback
- **Context API** - Global state management

### **Libraries**
- **jspdf** & **jspdf-autotable** - PDF generation
- **clsx** & **tailwind-merge** - Class name utilities
- **@radix-ui/react-** - Accessible UI components

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

---

## 📊 Screenshots

### 💬 Chat Interface
Modern chat interface with intelligent AI responses and file upload support.

### 📊 Analytics Dashboard
Comprehensive dashboard with real-time metrics, interactive charts, and export functionality.

### 🔐 Login Page
Beautiful authentication page with gradient design and smooth animations.

### 👥 Team Management
Track agent status, monitor activities, and manage team performance.

---

## 🔧 Configuration

### **Claude API Setup**

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Click the **Settings** icon in the app
3. Enter your API key
4. Configure model settings:
   - **Model**: claude-sonnet-4-20250514 (default)
   - **Max Tokens**: 500
   - **Temperature**: 0.7

### **Demo Mode**

The app works without an API key using intelligent mock responses that simulate realistic customer support scenarios.

---

## 📝 Usage Guide

### **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Alt + 1` | Switch to Chat |
| `Alt + 2` | Switch to Dashboard |
| `Alt + 3` | Switch to Team |
| `Ctrl + R` | Reset Chat |
| `Ctrl + E` | Export Chat Log |
| `Ctrl + H` | View History |
| `?` | Show Help |

### **Chat Commands**

Simply type naturally! Examples:
- "Where is my order?" → Order tracking
- "I want a refund" → Refund processing
- "Forgot my password" → Password reset help
- "How much does it cost?" → Product information

### **Exporting Reports**

1. Navigate to **Dashboard**
2. Click **Export Report** button
3. Choose format:
   - **PDF** - Professional report with tables
   - **CSV** - Spreadsheet-compatible data
   - **JSON** - Structured data for developers
   - **TXT** - Simple text format

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code style
- Add comments for complex logic
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pratham Mehta**

- GitHub: [@Prathammehta07](https://github.com/Prathammehta07)
- Project Link: [ResolveAI Repository](https://github.com/Prathammehta07/ResolveAI-Your-24-7-AI-Support-Agent-)

---

## 🙏 Acknowledgments

- [Anthropic Claude API](https://www.anthropic.com/) - AI language model
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Recharts](https://recharts.org/) - Chart library
- [Lucide Icons](https://lucide.dev/) - Icon set

---

<div align="center">

**Made with ❤️ by Pratham Mehta**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
