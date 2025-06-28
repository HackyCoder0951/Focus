# Backend Setup Documentation

This document provides step-by-step instructions for setting up the backend services required for the Focus social media platform.


## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Fill in your details and create an account

#### Step 2: Create a New Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to your users
5. Click "Create"

#### Step 3: Set Up Database Access
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these securely)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

#### Step 4: Set Up Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click "Confirm"

#### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your desired database name

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/focus_db?retryWrites=true&w=majority
```

### Option 2: Local MongoDB Installation

#### Step 1: Install MongoDB Community Edition
1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server for your OS
3. Follow installation instructions for your platform

#### Step 2: Start MongoDB Service
```bash
# On macOS/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB

# Or start manually
mongod
```

#### Step 3: Create Database and User
```bash
# Connect to MongoDB
mongo

# Create database
use focus_db

# Create user (optional for local development)
db.createUser({
  user: "focus_user",
  pwd: "your_password",
  roles: ["readWrite"]
})
```

**Local Connection String:**
```
mongodb://localhost:27017/focus_db
```

---

## ☁️ Cloudinary Setup

### Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Fill in your details and create an account

### Step 2: Get Account Credentials
1. After signing up, you'll be redirected to your dashboard
2. Note down your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Configure Upload Presets

#### For Images (Profile Pictures, Post Images)
1. Go to "Settings" → "Upload"
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set preset name: `social_media`
5. Set signing mode: "Unsigned"
6. Set folder: `focus_images` (optional)
7. Set allowed formats: `jpg, png, gif, webp`
8. Set transformation: `quality: auto` (optional)
9. Click "Save"

#### For Documents (PDFs, Files)
1. Create another upload preset
2. Set preset name: `document_preset`
3. Set signing mode: "Unsigned"
4. Set folder: `focus_documents` (optional)
5. Set allowed formats: `pdf, doc, docx, txt, zip, rar`
6. Set resource type: `raw`
7. Click "Save"

### Step 4: Configure CORS (if needed)
1. Go to "Settings" → "Security"
2. Add your domain to "Allowed HTTP origins"
3. For development: Add `http://localhost:3000`
4. For production: Add your domain

### Step 5: Test Upload
You can test the upload presets using the Cloudinary dashboard or with a simple test:

```javascript
// Test upload to social_media preset
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'social_media');

fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
  method: 'POST',
  body: formData
});
```

---

## 📧 SendGrid Setup

### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/)
2. Click "Start for Free"
3. Fill in your details and create an account

### Step 2: Verify Your Sender Identity
1. Go to "Settings" → "Sender Authentication"
2. Choose "Single Sender Verification"
3. Click "Get Started"
4. Fill in sender details:
   - From Name: Your app name (e.g., "Focus")
   - From Email: Your verified email address
   - Company: Your company name
   - Address: Your business address
5. Click "Create"
6. Check your email and click the verification link

### Step 3: Create API Key
1. Go to "Settings" → "API Keys"
2. Click "Create API Key"
3. Choose "Full Access" or "Restricted Access" with "Mail Send" permissions
4. Give it a name (e.g., "Focus App")
5. Click "Create & View"
6. Copy the API key (you won't see it again)

### Step 4: Test Email Sending
You can test email functionality with a simple script:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'test@example.com',
  from: 'your-verified-email@domain.com',
  subject: 'Test Email',
  text: 'This is a test email from Focus app',
  html: '<p>This is a test email from Focus app</p>',
};

sgMail.send(msg)
  .then(() => console.log('Email sent'))
  .catch((error) => console.error(error));
```

---

## ⚙️ Environment Configuration

### Step 1: Create Environment File
Create a `config.env` file in your project root:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/focus_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your-verified-email@domain.com

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: For password reset emails
FRONTEND_URL=http://localhost:3000
```

### Step 2: Security Best Practices
1. **Never commit `config.env` to version control**
2. Add `config.env` to your `.gitignore` file
3. Use strong, random JWT secrets
4. Regularly rotate API keys
5. Use environment-specific configurations

### Step 3: Production Environment Variables
For production deployment, set these environment variables in your hosting platform:

```env
# Production Database
MONGODB_URI=mongodb+srv://prod_user:prod_password@cluster.mongodb.net/focus_prod

# Production JWT (use a different secret)
JWT_SECRET=production_jwt_secret_here

# Production Cloudinary (same as development)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Production SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com

# Production Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

---

## 🧪 Testing the Setup

### Step 1: Test Database Connection
Create a test script `test-db.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'data' });
    console.log('✅ Database write test successful');
    
    await testCollection.deleteOne({ test: 'data' });
    console.log('✅ Database delete test successful');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
```

Run the test:
```bash
node test-db.js
```

### Step 2: Test Cloudinary Upload
Create a test script `test-cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  try {
    // Test upload
    const result = await cloudinary.uploader.upload(
      'https://via.placeholder.com/150',
      { 
        upload_preset: 'social_media',
        public_id: 'test_image'
      }
    );
    console.log('✅ Cloudinary upload successful:', result.public_id);
    
    // Test deletion
    await cloudinary.uploader.destroy('test_image');
    console.log('✅ Cloudinary deletion successful');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
  }
}

testCloudinary();
```

Run the test:
```bash
node test-cloudinary.js
```

### Step 3: Test SendGrid Email
Create a test script `test-sendgrid.js`:

```javascript
const sgMail = require('@sendgrid/mail');
require('dotenv').config({ path: './config.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGrid() {
  try {
    const msg = {
      to: 'test@example.com', // Replace with your email
      from: process.env.EMAIL_FROM,
      subject: 'Focus App - Test Email',
      text: 'This is a test email from Focus app',
      html: '<p>This is a test email from Focus app</p>',
    };

    await sgMail.send(msg);
    console.log('✅ SendGrid email sent successfully');
    
  } catch (error) {
    console.error('❌ SendGrid test failed:', error);
  }
}

testSendGrid();
```

Run the test:
```bash
node test-sendgrid.js
```

### Step 4: Test Complete Setup
Run all tests:
```bash
node test-db.js && node test-cloudinary.js && node test-sendgrid.js
```

---

## 🔧 Troubleshooting

### Common MongoDB Issues
- **Connection refused**: Check if MongoDB service is running
- **Authentication failed**: Verify username/password in connection string
- **Network access denied**: Add your IP to MongoDB Atlas whitelist

### Common Cloudinary Issues
- **Upload preset not found**: Verify preset name and signing mode
- **Invalid API key**: Check API key and secret in environment variables
- **CORS errors**: Add your domain to Cloudinary CORS settings

### Common SendGrid Issues
- **Sender not verified**: Complete sender verification process
- **API key invalid**: Regenerate API key if needed
- **Email not delivered**: Check spam folder and sender reputation

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [SendGrid Documentation](https://sendgrid.com/docs/)
- [Node.js Environment Variables](https://nodejs.org/en/docs/guides/environment-variables/)

---

## 🆘 Support

If you encounter issues during setup:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all services are properly configured
4. Check service status pages for any outages
5. Review the official documentation for each service

---

**Happy Setup! 🚀** 