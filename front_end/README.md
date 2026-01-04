# 1. Navigate to frontend directory
cd social-media-frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# Frontend will start on http://localhost:5173
```

# Testing the Application

1. **Register a new user**: Navigate to http://localhost:5173/register
2. **Login**: Use your credentials at /login
3. **Create posts**: Go to /feed and create posts
4. **Like posts**: Click the like button (real-time updates via WebSocket)
5. **Add comments**: Write comments and replies
6. **View profile**: Click on your username to see your profile

---

# **WEBSOCKET FLOW EXPLANATION**

## **How Real-Time Updates Work**
```
1. CLIENT CONNECTION
   - Client connects to ws://localhost:8080/ws
   - STOMP client is initialized with SockJS fallback
   - Connection established via WebSocket handshake

2. SUBSCRIPTION
   - Client subscribes to: /topic/post/{postId}/likes
   - Client subscribes to: /topic/post/{postId}/comments
   
3. USER ACTION (Example: Like)
   - User clicks "Like" button
   - Frontend calls: POST /api/likes/post/{postId}
   - Backend processes like and saves to database
   
4. BROADCAST EVENT
   - Backend creates LikeEvent object
   - SimpMessagingTemplate sends message to /topic/post/{postId}/likes
   - All subscribed clients receive the event
   
5. CLIENT RECEIVES UPDATE
   - useWebSocket hook receives message
   - Callback function parses JSON
   - Component state updates (likesCount)
   - UI re-renders with new like count

6. REAL-TIME SYNC
   - All users viewing the same post see updates instantly
   - No page refresh needed
   - Seamless user experience
```

BASE_URL: http://localhost:8080/api

AUTHENTICATION ENDPOINTS
========================
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user

USER ENDPOINTS
==============
GET    /api/users/me         - Get current user
GET    /api/users/{userId}   - Get user by ID
GET    /api/users/username/{username} - Get user by username

POST ENDPOINTS
==============
POST   /api/posts            - Create post
GET    /api/posts            - Get all posts (paginated)
GET    /api/posts/{postId}   - Get post by ID
GET    /api/posts/user/{userId} - Get user posts
PUT    /api/posts/{postId}   - Update post
DELETE /api/posts/{postId}   - Delete post

COMMENT ENDPOINTS
=================
POST   /api/comments/post/{postId} - Add comment
GET    /api/comments/post/{postId} - Get post comments
POST   /api/comments/{commentId}/replies - Add reply
GET    /api/comments/{commentId}/replies - Get replies
DELETE /api/comments/{commentId} - Delete comment
DELETE /api/comments/replies/{replyId} - Delete reply

LIKE ENDPOINTS
==============
POST   /api/likes/post/{postId} - Toggle like
GET    /api/likes/post/{postId}/status - Get like status
GET    /api/likes/post/{postId}/count - Get like count

WEBSOCKET ENDPOINTS
===================
WS     /ws - WebSocket connection endpoint
TOPIC  /topic/post/{postId}/likes - Subscribe to like events
TOPIC  /topic/post/{postId}/comments - Subscribe to comment events

---

# **BEST PRACTICES IMPLEMENTED**

## **Backend Best Practices**

1. **Layered Architecture**: Controller → Service → Repository
2. **DTO Pattern**: Separate request/response objects from entities
3. **Exception Handling**: Global exception handler for consistent error responses
4. **Security**: JWT authentication, password encryption, CSRF protection
5. **Validation**: Input validation using Jakarta Validation
6. **Transactions**: @Transactional for data consistency
7. **Relationships**: Proper JPA relationships with cascade operations
8. **Pagination**: Efficient data loading with Page/Pageable
9. **Indexes**: Database indexes for better query performance

## **Frontend Best Practices**

1. **Component Separation**: Each component has single responsibility
2. **Custom Hooks**: Reusable logic in useWebSocket
3. **Context API**: Global state management for authentication
4. **Protected Routes**: PrivateRoute for authenticated pages
5. **Service Layer**: Separate API calls from components
6. **Error Handling**: Try-catch blocks with user-friendly messages
7. **Loading States**: Visual feedback during async operations
8. **Real-time Updates**: WebSocket for live data synchronization
9. **Responsive Design**: Tailwind CSS for mobile-friendly UI

---

## **Project Structure Summary**

**Backend Structure:**
```
src/main/java/com/socialmedia/
├── controller/       # REST endpoints
├── service/          # Business logic
├── repository/       # Database operations
├── entity/           # JPA entities
├── dto/              # Data transfer objects
├── security/         # JWT & Security config
├── websocket/        # WebSocket config & events
├── exception/        # Exception handling
└── SocialMediaApplication.java
```

**Frontend Structure:**
```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── services/         # API service functions
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── routes/           # Route protection
├── utils/            # Utility functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
