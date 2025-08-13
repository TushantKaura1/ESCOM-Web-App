# 🎭 Demo Accounts & Admin FAQ Management

## 📋 Overview

This system includes demo accounts for testing and admin functionality to manage FAQ content without requiring login/signup.

## 👥 Demo Accounts

### **📊 Account Summary**
- **Total Accounts**: 11
- **Admin Accounts**: 1
- **Citizen Accounts**: 10

### **👑 Admin Account**
```json
{
  "telegramId": 123456789,
  "username": "esco_admin",
  "firstName": "ESCOM",
  "lastName": "Administrator",
  "role": "admin",
  "isAdmin": true
}
```

### **👥 Citizen Scientist Accounts**

#### **Team Alpha (team1)**
1. **Maria Santos** - Vila do Mar - Water Quality
2. **Ana Costa** - Porto Seguro - Salinity
3. **Pedro Oliveira** - Baía dos Ventos - Temperature
4. **Isabela Gomes** - Praia Serena - Water Quality

#### **Team Beta (team2)**
5. **João Pereira** - Praia Azul - Temperature
6. **Lúcia Fernandes** - Ilha do Sol - Water Quality
7. **Miguel Ribeiro** - Costa Dourada - pH

#### **Team Gamma (team3)**
8. **Carlos Silva** - Cabo Verde - pH
9. **Sofia Martins** - Ponta do Mar - Salinity
10. **Tiago Lopes** - Cabo das Ondas - Temperature

## 🚀 Loading Demo Accounts

### **1. Run the Load Script**
```bash
node scripts/load-demo-accounts.js
```

### **2. Expected Output**
```
✅ Connected to MongoDB
📊 Loading demo accounts...
👑 Admin account loaded: ESCOM Administrator
👥 Citizen account loaded: Maria Santos
👥 Citizen account loaded: João Pereira
...
✅ Successfully loaded 11 demo accounts
📈 Admin accounts: 1
👥 Citizen accounts: 10

📊 Database Summary:
Total users: 11
Admin users: 1
Citizen users: 10
```

### **3. Verify in Database**
```bash
# Connect to MongoDB
mongosh escom

# Check users
db.users.find().pretty()

# Check admin users
db.users.find({role: "admin"}).pretty()

# Check citizen users
db.users.find({role: "citizen"}).pretty()
```

## 🔐 Admin Access

### **Direct Admin Access**
- **No Login Required**: Admin can access directly without Telegram authentication
- **Immediate Access**: Click "Enter Admin Panel" to access admin features
- **Full Control**: Access to all administrative functions

### **Admin Features**
1. **📊 Admin Dashboard**: System overview and analytics
2. **👥 User Management**: Manage citizen scientists
3. **📈 Data Analytics**: View monitoring data and trends
4. **⚙️ System Settings**: Configure system parameters
5. **📋 Reports**: Generate and view reports
6. **❓ FAQ Management**: Edit and manage FAQ content

## ✏️ FAQ Management

### **Admin FAQ Editing Features**

#### **1. Edit Mode**
- Click "✏️ Edit" button in FAQ sections
- Edit existing questions and answers
- Save changes with "💾 Save" button
- Delete questions with "🗑️ Delete" button

#### **2. Add New Questions**
- Click "✏️ Edit" to enter edit mode
- Scroll to "Add New Question" section
- Enter question and answer
- Click "➕ Add Question" to save

#### **3. FAQ Categories**
- **ESCOM organization**: Getting involved, Benefits, Structure
- **Monitoring**: Parameters, Protocols, Instruments
- **Training**: Wiki, Manuals, Podcasts, Videos, References
- **Data**: Entry, Download, Visualization, Sharing
- **Partners**: Dalhousie, Members, Funders, Allies

### **FAQ Data Structure**
```json
{
  "faqCategories": {
    "Category Name": {
      "description": "Category description",
      "questions": {
        "Question Title": {
          "question": "What is the question?",
          "answer": "This is the answer."
        }
      }
    }
  }
}
```

## 📱 User Interface

### **Admin Mode Interface**
```
🌊 ESCOM Assistant
Welcome, ESCOM! (👑 Admin)

[📊 Admin Dashboard]
[👥 User Management]
[📈 Data Analytics]
[⚙️ System Settings]
[📋 Reports]
```

### **Citizen Mode Interface**
```
🌊 ESCOM Assistant
Welcome, [Name]! (👥 Citizen)

[❓ FAQs]
[👥 Community]
[📊 Dashboard]
[👤 Profile]
```

## 🔧 Configuration

### **Admin IDs Configuration**
```javascript
// config/admin.js
ADMIN_IDS: [123456789] // Demo admin ID
```

### **Environment Variables**
```bash
# Required
MONGODB_URI=mongodb://localhost:27017/escom
BOT_TOKEN=your_telegram_bot_token
WEBAPP_URL=https://your-domain.com

# Optional
ADMIN_IDS=123456789
```

## 🛠️ Development

### **Adding New Demo Accounts**
1. Edit `data/demo-accounts.json`
2. Add new account to `citizens` array
3. Run `node scripts/load-demo-accounts.js`
4. Verify in database

### **Modifying FAQ Content**
1. Edit `data/faq-data.json`
2. Add new categories or questions
3. Restart the application
4. Test in admin mode

### **Customizing Admin Features**
1. Edit `config/admin.js`
2. Modify permissions and features
3. Update admin menu in `App.jsx`
4. Test admin functionality

## 🧪 Testing

### **Admin Testing**
1. Select "Admin Mode"
2. Click "Enter Admin Panel"
3. Test FAQ editing functionality
4. Verify admin features work

### **Citizen Testing**
1. Select "Citizen Scientist Mode"
2. Login with Telegram or signup
3. Test citizen features
4. Verify community access

### **FAQ Testing**
1. Access FAQ section as admin
2. Edit existing questions
3. Add new questions
4. Delete questions
5. Verify changes persist

## 📊 Demo Account Statistics

### **Admin Account**
- **Readings**: 0 (Admin doesn't collect data)
- **Streak**: 0
- **Accuracy**: 100%
- **Role**: System Administrator

### **Citizen Accounts**
- **Average Readings**: 52.7
- **Average Streak**: 16.8 days
- **Average Accuracy**: 91.3%
- **Experience Levels**: 3 beginners, 4 intermediate, 3 advanced

## 🚨 Troubleshooting

### **Demo Accounts Not Loading**
```bash
# Check MongoDB connection
node test-db.js

# Check file path
ls -la data/demo-accounts.json

# Check script permissions
chmod +x scripts/load-demo-accounts.js
```

### **Admin Access Issues**
```bash
# Check admin configuration
cat config/admin.js

# Verify admin ID
echo $ADMIN_IDS

# Check database
mongosh escom --eval "db.users.find({role: 'admin'})"
```

### **FAQ Editing Not Working**
```bash
# Check FAQ data file
cat data/faq-data.json

# Verify file permissions
ls -la data/faq-data.json

# Check browser console for errors
```

## 📚 Additional Resources

- [MongoDB User Management](https://docs.mongodb.com/manual/reference/method/db.createUser/)
- [JSON Schema Validation](https://json-schema.org/)
- [React State Management](https://reactjs.org/docs/hooks-state.html)
- [Telegram Bot API](https://core.telegram.org/bots/api) 