# 🌊 ESCOM Citizen Scientist Assistant - Telegram Mini App

A comprehensive Telegram Mini App designed to support citizen scientists participating in coastal monitoring programs. This application provides an intuitive interface for accessing FAQs, connecting with the community, managing profiles, and tracking monitoring activities.

## 🚀 Features

### 🔐 Authentication & Profile Management
- **Telegram Integration**: Seamless login using Telegram's authentication system
- **Profile Setup**: Comprehensive user profile creation including:
  - Personal information (name, village/location)
  - Team assignment (Alpha, Beta, Gamma)
  - Monitoring parameters (Water Quality, Temperature, Salinity, pH)
  - Experience level (Beginner, Intermediate, Advanced)
  - Membership duration tracking

### ❓ FAQ System
Organized into 5 main categories with detailed subcategories:

1. **ESCOM Organization**
   - Getting Involved
   - Benefits of Participation
   - Organizational Structure

2. **Monitoring**
   - Parameters
   - Field Protocols
   - Instruments

3. **Training**
   - Wiki & Manuals
   - Podcasts & Videos
   - External References

4. **Data**
   - Entry
   - Download
   - Visualize
   - Property & Sharing

5. **Partners**
   - Dalhousie University
   - ESCOM Members
   - Funders & Allies

### 👥 Community Features
- **Member Directory**: Browse and connect with fellow citizen scientists
- **Profile Cards**: View detailed member information including:
  - Location and team
  - Experience level
  - Monitoring parameters
  - Online status
- **Chat Integration**: Direct messaging capabilities (coming soon)

### 📊 Dashboard
Comprehensive overview of user activities and achievements:

- **Statistics Cards**:
  - Total readings completed
  - Current streak
  - Accuracy percentage
  - Community ranking

- **Recent Activity**: Timeline of recent monitoring sessions and training completions

- **Quick Actions**: Easy access to common tasks

## 🛠️ Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern CSS with Inter font family
- **Telegram Integration**: Telegram Web App API
- **State Management**: React Hooks
- **Responsive Design**: Mobile-first approach

## 📱 Design Features

- **Modern UI**: Clean, intuitive interface with gradient backgrounds
- **Responsive**: Optimized for mobile devices and Telegram Mini App environment
- **Accessibility**: High contrast colors and readable typography
- **Animations**: Smooth transitions and hover effects
- **Dark Mode Ready**: Prepared for future dark mode implementation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CitizenScientistMiniApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Telegram Mini App Setup

1. **Create a Telegram Bot** using [@BotFather](https://t.me/botfather)
2. **Set up Mini App** through BotFather's commands
3. **Configure Web App URL** to point to your deployed application
4. **Test the integration** in Telegram

## 📁 Project Structure

```
src/
├── App.jsx              # Main application component
├── App.css              # Comprehensive styling
├── main.jsx             # Application entry point
├── components/          # Reusable components
│   ├── Login.jsx        # Authentication components
│   └── Signup.jsx       # Registration components
└── assets/              # Static assets
```

## 🎨 Component Architecture

### Core Components

1. **AuthScreen**: Handles user authentication flow
2. **ProfileSetup**: Comprehensive profile creation form
3. **FAQSection**: Hierarchical FAQ navigation system
4. **CommunitySection**: Member directory and networking
5. **DashboardSection**: User statistics and activity tracking

### State Management

- **Authentication State**: User login status and profile data
- **Navigation State**: Current view and navigation history
- **FAQ State**: Category and question selection
- **Community State**: Member data and chat functionality

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_APP_URL=your_app_url_here
```

### Telegram Web App Configuration
The app automatically initializes with Telegram's Web App API:

```javascript
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}
```

## 📊 Data Flow

1. **User Authentication**: Telegram provides user data
2. **Profile Creation**: User completes profile setup
3. **Data Storage**: Profile data sent to Telegram bot
4. **Navigation**: Seamless transitions between app sections
5. **Community Interaction**: Member discovery and communication

## 🎯 User Experience

### Onboarding Flow
1. User opens Mini App in Telegram
2. Chooses login or signup
3. Completes profile setup (if new user)
4. Accesses main menu with all features

### Navigation
- **Intuitive Back Buttons**: Easy navigation between sections
- **Breadcrumb Navigation**: Clear location awareness
- **Smooth Transitions**: Professional user experience

### Accessibility
- **High Contrast**: Readable text and buttons
- **Touch-Friendly**: Optimized for mobile interaction
- **Keyboard Navigation**: Full keyboard accessibility

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Direct messaging between members
- **Data Visualization**: Charts and graphs for monitoring data
- **Push Notifications**: Reminders for monitoring sessions
- **Offline Support**: Basic functionality without internet
- **Multi-language Support**: Internationalization

### Technical Improvements
- **PWA Support**: Progressive Web App capabilities
- **Performance Optimization**: Code splitting and lazy loading
- **Advanced Analytics**: User behavior tracking
- **A/B Testing**: Feature experimentation framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **ESCOM Team**: For the vision and requirements
- **Dalhousie University**: Scientific oversight and collaboration
- **Telegram**: Mini App platform and API
- **React Community**: Open-source tools and libraries

## 📞 Support

For support and questions:
- **Technical Issues**: Create an issue in the repository
- **ESCOM Questions**: Contact your team leader
- **General Inquiries**: Reach out through the community section

---

**Built with ❤️ for the Citizen Science Community**
# ESCOM-Web-App
