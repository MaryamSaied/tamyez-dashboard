# TAMYEZ Admin Dashboard 

> Graduation Project Dashboard 

---
## ==================== Overview ====================

TAMYEZ Admin Dashboard is a complete React-based dashboard system built as a graduation project.  
The project was originally developed using pure HTML, CSS, Bootstrap, and JavaScript, then professionally converted into a scalable React architecture while preserving the original UI/UX design completely.

The project includes:

- Authentication system
- Protected admin routes
- Dashboard management pages
- Careers & Roadmaps system
- Quiz management
- Notifications & Feedback
- Reusable layouts & components
- Centralized API structure
- Fully responsive UI

---

# ==================== Tech Stack ====================

| Technology | Description |
|---|---|
| React 18 | UI Library |
| React Router DOM 6 | Routing & Navigation |
| Vite 5 | Build Tool & Dev Server |
| Bootstrap 5.3 | UI Framework |
| Bootstrap Icons | Icons Library |

---

# ==================== Installation & Setup ====================

## Clone the Repository

```bash
git clone <your-repository-url>
cd tamyez-react
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# ==================== 📁 Project Structure ====================

```bash
tamyez-react/
├── index.html                  # Vite entry point
├── package.json                # React 18 + React Router 6 + Vite 5
├── vite.config.js
├── public/
│   └── images/                 # Project images (22 images)

└── src/
    ├── main.jsx                # React entry + BrowserRouter
    ├── App.jsx                 # All application routes

    ├── styles/
    │   └── style.css           # Original full CSS file (5874 lines)

    ├── components/
    │   ├── AdminLayout.jsx     # Admin pages wrapper
    │   ├── AuthLayout.jsx      # Authentication pages wrapper
    │   ├── CareerLayout.jsx    # Career pages wrapper
    │   ├── ProfileLayout.jsx   # Profile pages wrapper
    │   ├── TopNavbar.jsx       # Top navigation bar
    │   └── Sidebar.jsx         # Sidebar navigation

    ├── data/
    │   ├── usersData.js        # Mock users data
    │   └── stepDetailsData.js  # Steps content data

    ├── services/
    │   └── api.js              # Centralized API calls

    └── pages/                  # All project pages (34 pages)
```

---

# ==================== 🛡️ Professional Features: ====================


## ==== 🔐 Authentication & Protected Routes ====

All admin pages are protected using `ProtectedRoute`.

If a user attempts to access protected routes such as:

```bash
/dashboard
```

without authentication, they will automatically be redirected to the login page.

### ============== Authentication Utilities ====================

Located inside:

```bash
src/services/auth.js
```

Available methods:

- `auth.login()`
- `auth.logout()`
- `auth.isAuthenticated()`
- `auth.getToken()`

###  ============= Backend Integration Example ===============

The backend returns this structure on successful login:

```json
{
  "success": true,
  "message": "Logged In Successfully ✅",
  "body": {
    "accessToken": "eyJ...",
    "user": {
      "id": "69d00c589dd552db472e558f",
      "fullName": "Mohammed Khalil",
      "email": "klilmohammed9@gmail.com",
      "role": "Admin"
    }
  }
}
```

The login call in `Login.jsx` already handles this correctly:

```javascript
const res = await authAPI.adminLogin(email, password)
auth.login(res.body.accessToken, res.body.user)
```

---

## ============= Reusable Loader Component ================

Location:

```bash
src/components/Loader.jsx
```

Supports 3 variants:

### ==================== Full Page Loader ==================

```jsx
<Loader fullPage text="Loading..." />
```

### ==================== Inline Loader ====================

```jsx
<Loader inline text="Loading users..." />
```

### ==================== Button Loader ====================

```jsx
<button disabled={saving}>
  {saving ? <Loader button /> : 'Save'}
</button>
```

---

## ================= ❌ 404 Not Found Page =================

Any undefined route automatically redirects to the `NotFound` page.

The page includes:

- Go Back button
- Login / Dashboard button (based on auth state)

---

## ====================⬆️ Scroll To Top ====================

Automatically scrolls to the top when navigating between pages.

---

# ==================== Backend Integration ====================

All API calls are centralized inside:

```bash
src/services/api.js
```

---

## ✅ Setup Steps :- 


### ================ 1. Define Your Backend URL ==================

The base URL is already configured in `.env`:

```
VITE_API_BASE_URL=https://tamyez.mooo.com/api/v1
```

And read automatically in `api.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tamyez.mooo.com/api/v1'
```

---

### ==================== 2. Import Required APIs ====================

```javascript
import { usersAPI } from '../services/api'
```

---

### ==================== 3. Replace Mock Data with API Calls ====================

###  ==== Before ====

```javascript
import { usersData } from '../data/usersData'

const [users, setUsers] = useState([...usersData])
```

### ==== After =====

```javascript
import { usersAPI } from '../services/api'
import { useEffect } from 'react'

const [users, setUsers] = useState([])

useEffect(() => {
    usersAPI.getAll()
        .then(setUsers)
        .catch(console.error)
}, [])
```

---

# ========= Real API Endpoints (Connected to https://tamyez.mooo.com/api/v1) ===============

## ============== Authentication =================

> ⚠️ Admin login uses a different endpoint than regular user login.

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/auth/sign-up` | `{ fullName, email, password, confirmPassword, gender, phoneNumber }` | Register new user |
| `GET` | `/auth/verify-email?token=...` | — | Verify email after signup |
| `GET` | `/auth/restore-email?token=...` | — | Restore email |
| `POST` | `/auth/resend-email-verification` | `{ email }` | Resend verification link |
| `POST` | `/auth/log-in` | `{ email, password }` | Login regular user |
| `POST` | `/auth/log-in-gmail` | `{ idToken }` | Login with Google |
| `POST` | `/auth/sign-up-gmail` | `{ idToken, deviceId, fcmToken }` | Sign up with Google |
| `POST` | `/auth/forget-password` | `{ email }` | Send OTP to email |
| `POST` | `/auth/verify-forget-password` | `{ email, otp }` | Verify OTP |
| `POST` | `/auth/reset-forget-password` | `{ email, password, confirmPassword }` | Reset password |
| `POST` | `/admin/auth/log-in` | `{ email, password }` | **Admin dashboard login** ✅ |
| `POST` | `/admin/auth/log-in-gmail` | `{ idToken }` | Admin login with Google |

---

## ==================== Users ====================

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/user/` | Get all users (admin) — supports `?size=10&page=1&searchKey=` |
| `GET` | `/admin/user/archives` | Get archived/frozen users |
| `GET` | `/user/` | Get current user profile |
| `DELETE` | `/user/:id/delete` | Permanently delete user |
| `PATCH` | `/admin/user/:id/change-role` | Change user role — body: `{ role }` |
| `PATCH` | `/user/:id/archive` | Freeze (ban) user account |

---

## ==================== Careers ====================

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/careers` | Get all careers |
| `GET` | `/careers/:id` | Get career by ID |
| `POST` | `/careers` | Create career |
| `PUT` | `/careers/:id` | Update career |
| `DELETE` | `/careers/:id` | Delete career |

---

##  ==================== Roadmaps ====================

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/roadmaps` | Get all roadmaps |
| `GET` | `/roadmaps/:id` | Get roadmap by ID |
| `POST` | `/roadmaps` | Create roadmap |
| `PUT` | `/roadmaps/:id` | Update roadmap |
| `DELETE` | `/roadmaps/:id` | Delete roadmap |
| `GET` | `/roadmaps/:id/steps` | Get roadmap steps |
| `POST` | `/roadmaps/:id/steps` | Add step to roadmap |

---

## ==================== Resources ====================

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/resources/courses` | Add course |
| `POST` | `/resources/books` | Add book |
| `POST` | `/resources/videos` | Add video |
| `DELETE` | `/resources/:id` | Delete resource |

---

## ==================== Quizzes ====================

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/quizzes` | Get all quizzes |
| `GET` | `/quizzes/:id` | Get quiz by ID |
| `POST` | `/quizzes` | Create quiz |
| `PUT` | `/quizzes/:id` | Update quiz |
| `DELETE` | `/quizzes/:id` | Delete quiz |
| `POST` | `/quizzes/:id/submit` | Submit quiz answers |

---

## ================ Notifications & Feedback ===============

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/notifications/broadcast` | Send notification to all |
| `GET` | `/admin/user/feedback` | Get all feedback — supports `?size=15&page=1` |
| `POST` | `/admin/user/:id/feedback-reply` | Reply to feedback — body: `{ text }` |
| `DELETE` | `/admin/user/:id/feedback-delete` | Delete feedback |

---

## ==================== Admin Profile & Settings ====================

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/profile` | Get admin profile |
| `PUT` | `/admin/profile` | Update admin profile |
| `POST` | `/admin/change-password` | Change password |
| `GET` | `/admin/settings` | Get settings |
| `PUT` | `/admin/settings` | Update settings |
| `DELETE` | `/admin/account` | Delete admin account |

---

## ==================== Dashboard ====================

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/user/dashboard-data` | Get stats: users, quizzes, careers, notifications, newUserRegistered |


---

# ==================== Available Pages ====================

## ==================== Authentication Pages (8) ====================

- Login
- Register
- Forgot Password
- Reset Password
- Reset Success
- Verify
- OTP Verification
- Google Auth

---

## ==================== Admin Pages (4) ====================

- Dashboard
- Users
- User Profile
- Change Role

---

## ==================== Careers Pages (5) ====================

- Careers
- Career Detail
- Update Career
- Career Roadmap (Client View)
- Dash Career Roadmap (Admin)

---

## ==================== Roadmaps Pages (8) ====================

- Roadmaps
- Update Roadmap
- Step Details (Client View)
- Dash Step Details (Admin)
- Add Course
- Add Book
- Add Resource

---

## ==================== Quiz Pages (4) ====================

- Quizzes
- Quiz View (Admin Editor)
- Quiz Start
- Quiz Questions

---

## ==================== Other Pages (6) ====================

- Notifications & Feedback
- Settings
- Admin Profile
- Admin Profile Edit
- Admin Profile Settings
- Admin Delete Account

---

# ==================== Project Statistics ====================

| Item | Count |
|---|---|
| Total Pages | 34 |
| Layout Components | 5 |
| Images | 22 |
| CSS File Size | 5874 Lines |

---

# ==================== Design Preservation ====================

The original `style.css` file was fully preserved without modifying the design structure to ensure:

✅ 100% UI consistency  
✅ Original responsive behavior  
✅ Same visual identity as the original project

---

# =============== Notes ====================

- The project uses centralized API architecture for easier backend integration.
- No unnecessary dependencies were added.
- The UI structure and styling were intentionally preserved from the original project.
- The project is scalable and easy to maintain.

---

# =========Developed For =================

Graduation Project — TAMYEZ Platform Dashboard System

---