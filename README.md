# Focus - Social Media Platform

A comprehensive social media platform built with Next.js and Node.js, featuring real-time messaging, file sharing, Q&A sections, and resource management.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access
- **Real-time Messaging** - Socket.io powered instant messaging
- **Social Features** - Posts, likes, comments, follow/unfollow
- **Q&A Section** - Dedicated question and answer platform
- **Resource Management** - File upload and sharing with Cloudinary integration
- **Notifications** - Real-time notifications for likes, comments, and messages
- **Responsive Design** - Mobile-friendly UI with Semantic UI React
- **File Management** - Document upload, download, and deletion

## 🛠️ Technologies Used

### Frontend
- **Next.js 10.0.3** - React framework for server-side rendering
- **React 16.13.1** - UI library
- **Semantic UI React 2.0.0** - UI component library
- **Socket.io Client 2.4.0** - Real-time communication
- **Axios 0.21.0** - HTTP client
- **React Toastify 6.0.5** - Toast notifications
- **React Infinite Scroll 5.1.0** - Infinite scrolling
- **NProgress 0.2.0** - Progress bars

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.17.1** - Web framework
- **Socket.io 2.4.1** - Real-time bidirectional communication
- **MongoDB 5.9.14** - NoSQL database
- **Mongoose 5.9.14** - MongoDB object modeling
- **JWT 8.5.1** - JSON Web Tokens for authentication
- **Bcryptjs 2.4.3** - Password hashing
- **Cloudinary 2.7.0** - Cloud storage for files and images
- **Nodemailer 6.7.2** - Email functionality
- **Validator 13.0.0** - Data validation

### Development Tools
- **Nodemon 2.0.15** - Auto-restart server during development
- **Cross-env 7.0.3** - Cross-platform environment variables
- **Dotenv 8.2.0** - Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Cloudinary Account** (for file storage)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Focus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `config.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email (Optional - for password reset)
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=your_email@domain.com
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Cloudinary Setup**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Create upload presets:
     - `social_media` for images
     - `document_preset` for documents
   - Note down your cloud name, API key, and API secret

5. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database for the project
   - Update the `MONGODB_URI` in your config.env

## 🚀 Running the Project

### Development Mode
```bash
npm run dev
```
This will start the development server with hot reloading.

### Production Build
```bash
npm run build
npm start
```

### Legacy Mode (if needed)
```bash
npm run dev:legacy
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Focus/
├── api/                    # API routes
│   ├── auth.js            # Authentication endpoints
│   ├── chats.js           # Chat functionality
│   ├── notifications.js   # Notification system
│   ├── posts.js           # Post management
│   ├── qa/                # Q&A section APIs
│   └── resource/          # File management APIs
├── components/            # React components
│   ├── Chats/            # Chat components
│   ├── Common/           # Shared components
│   ├── Home/             # Home page components
│   ├── Layout/           # Layout components
│   ├── Messages/         # Message components
│   ├── Notifications/    # Notification components
│   ├── Post/             # Post components
│   └── Profile/          # Profile components
├── middleware/           # Express middleware
├── models/              # Mongoose models
├── pages/               # Next.js pages
├── public/              # Static assets
├── utils/               # Frontend utilities
├── utilsServer/         # Backend utilities
├── server.js            # Express server
└── next.config.js       # Next.js configuration
```

## 🔐 Authentication

The application uses JWT-based authentication with the following features:
- User registration and login
- Password reset via email
- Role-based access control (user, root)
- Protected routes and API endpoints

## 💬 Real-time Features

- **Instant Messaging**: Real-time chat using Socket.io
- **Live Notifications**: Instant notifications for likes, comments, and messages
- **Online Status**: Real-time user online/offline status
- **Live Updates**: Real-time post updates and interactions

## 📁 File Management

- **Image Upload**: Profile pictures and post images
- **Document Upload**: PDFs, documents, and other files
- **Cloud Storage**: All files stored on Cloudinary
- **File Deletion**: Automatic cleanup from both database and cloud storage

## 🎨 UI/UX

- **Responsive Design**: Mobile-first approach
- **Semantic UI**: Modern, accessible components
- **Dark/Light Mode**: Theme support
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `SENDGRID_API_KEY`: SendGrid API key for emails
- `EMAIL_FROM`: Sender email address
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Cloudinary Configuration
- Upload presets must be configured in Cloudinary dashboard
- Resource types: `image`, `video`, `raw` (for documents)
- Automatic file deletion on user deletion

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy using Heroku CLI or GitHub integration

### Other Platforms
- Ensure environment variables are set
- Build the project: `npm run build`
- Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates

Keep your dependencies updated:
```bash
npm update
npm audit fix
```

---

**Happy Coding! 🎉**
