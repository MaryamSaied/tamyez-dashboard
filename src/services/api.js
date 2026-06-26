// ============================================================
// TAMYEZ Dashboard — API Service Layer
// Connected to: https://tamyez.mooo.com/api/v1
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tamyez.mooo.com/api/v1'

// ── Generic request helper ────────────────────────────────
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    }

    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `BSuperSystem ${token}`
    const response = await fetch(url, config)
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        const message = data?.error?.message || data?.message || `HTTP ${response.status}`
        throw new Error(message)
    }
    return data
}

// ============================================================
// Auth Endpoints
// ============================================================
export const authAPI = {

    // POST admin/auth/log-in  →  { email, password }
    adminLogin: (email, password) =>
        request('/admin/auth/log-in', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    // POST admin/auth/sign-up-gmail  →  { idToken } — first time Google sign-in (creates account)
    signUpGmail: (idToken) =>
        request('/admin/auth/sign-up-gmail', {
            method: 'POST',
            body: JSON.stringify({ idToken }),
        }),

    // POST admin/auth/log-in-gmail  →  { idToken } — subsequent Google sign-ins
    loginGmail: (idToken) =>
        request('/admin/auth/log-in-gmail', {
            method: 'POST',
            body: JSON.stringify({ idToken }),
        }),

    // POST auth/sign-up
    signUp: (data) =>
        request('/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                gender: data.gender,
                phoneNumber: data.phoneNumber,
            }),
        }),

    // POST auth/forget-password  →  { email }
    forgetPassword: (email) =>
        request('/auth/forget-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    // POST auth/verify-forget-password  →  { email, otp }
    verifyForgetPassword: (email, otp) =>
        request('/auth/verify-forget-password', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        }),

    // POST auth/reset-forget-password  →  { email, password, confirmPassword }
    resetForgetPassword: (email, password, confirmPassword) =>
        request('/auth/reset-forget-password', {
            method: 'POST',
            body: JSON.stringify({ email, password, confirmPassword }),
        }),

    // POST auth/resend-email-verification  →  { email }
    resendEmailVerification: (email) =>
        request('/auth/resend-email-verification', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
    },
}

// ============================================================
// Users — Real API endpoints from Postman
// ============================================================
export const usersAPI = {

    // GET admin/user/?size=10&page=1&searchKey=
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/user/${query ? '?' + query : ''}`)
    },

    // GET admin/user/archives?size=10&page=1&searchKey=
    getArchived: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/user/archives${query ? '?' + query : ''}`)
    },

    // GET user/  →  get current user profile
    getProfile: () => request('/user/'),

    // GET admin/user/:id/archives  →  get archived profile by id
    getArchivedProfile: (id) => request(`/admin/user/${id}/archives`),

    // PATCH admin/user/:id/change-role  →  { role }
    changeRole: (id, role, v) =>
        request(`/admin/user/${id}/change-role`, {
            method: 'PATCH',
            body: JSON.stringify({ role, v }),
        }),

    // PATCH user/:id/archive  →  archive (freeze) account
    archive: (id, v = 1) =>
        request(`/user/${id}/archive`, {
            method: 'PATCH',
            body: JSON.stringify({ v }),
        }),

    // PATCH admin/user/:id/restore  →  restore archived account
    restore: (id, v = 1) =>
        request(`/admin/user/${id}/restore`, {
            method: 'PATCH',
            body: JSON.stringify({ v }),
        }),

    // DELETE user/:id/delete  →  permanently delete account
    delete: (id, v = 1) =>
        request(`/user/${id}/delete`, {
            method: 'DELETE',
            body: JSON.stringify({ v }),
        }),

    // POST user/logout
    logout: () =>
        request('/user/logout', {
            method: 'POST',
            body: JSON.stringify({ flag: 'One' }),
        }),
}

// ============================================================
// Dashboard — Real API endpoint from Postman
// ============================================================
export const dashboardAPI = {

    // GET admin/user/dashboard-data
    // Returns: { users, quizzes, careers, notifications, newUserRegistered }
    getStats: () => request('/admin/user/dashboard-data'),
}

// ============================================================
// Feedback — Real API endpoints from Postman
// ============================================================
export const feedbackAPI = {

    // GET admin/user/feedback?size=15&page=1
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/user/feedback${query ? '?' + query : ''}`)
    },

    // POST admin/user/:id/feedback-reply  →  { text }
    reply: (userId, text) =>
        request(`/admin/user/${userId}/feedback-reply`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        }),

    // DELETE admin/user/:id/feedback-delete
    delete: (userId) =>
        request(`/admin/user/${userId}/feedback-delete`, {
            method: 'DELETE',
        }),
}

// ============================================================
// Careers — Real API endpoints from Postman
// ============================================================
export const careersAPI = {
    // GET career/all?page=1&size=10&searchKey=
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/career/all${query ? '?' + query : ''}`)
    },
    // GET admin/career/archives?page=1&size=10&searchKey=
    getArchived: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/career/archives${query ? '?' + query : ''}`)
    },
    // GET career/:id
    getById: (id) => request(`/career/${id}`),
    // GET admin/career/:id/archives
    getArchivedById: (id) => request(`/admin/career/${id}/archives`),
    // POST admin/career/  →  { title, description, summary, youtubePlaylists }
    create: (data) => request('/admin/career/', { method: 'POST', body: JSON.stringify(data) }),
    // PATCH admin/career/:id
    update: (id, data) => request(`/admin/career/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    // PATCH admin/career/:id/archive
    archive: (id, v = 1) => request(`/admin/career/${id}/archive`, { method: 'PATCH', body: JSON.stringify({ v }) }),
    // PATCH admin/career/:id/restore
    restore: (id, v = 1) => request(`/admin/career/${id}/restore`, { method: 'PATCH', body: JSON.stringify({ v }) }),
    // PATCH admin/career/:id/picture  →  formdata { attachment, v }
    uploadPicture: (id, formData) => {
        const token = localStorage.getItem('accessToken')
        return fetch(`${BASE_URL}/admin/career/${id}/picture`, {
            method: 'PATCH',
            headers: { Authorization: config.headers.Authorization = `BSuperSystem ${token}` },
            body: formData,
        }).then(r => r.json())
    },

    // DELETE admin/career/:id/delete
    delete: (id) => request(`/admin/career/${id}/delete`, { method: 'DELETE', body: JSON.stringify({ v: 1 }) }),
    // POST career/:id/check-assessment
    checkAssessment: (careerId, answers) => request(`/career/${careerId}/check-assessment`, { method: 'POST', body: JSON.stringify({ answers }) }),
    // GET career/:id/choose-suggested-career
    chooseSuggestedCareer: (careerId) => request(`/career/${careerId}/choose-suggested-career`),
}

// ============================================================
// Roadmaps — Real API endpoints from Postman
// ============================================================
export const roadmapsAPI = {
    // GET roadmap/?page=1&size=30&searchKey=&haveQuizzes=&belongToCareers=
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/roadmap/${query ? '?' + query : ''}`)
    },
    // GET admin/roadmap/archives?belongToCareers=&page=1&size=5&searchKey=
    getArchived: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/roadmap/archives${query ? '?' + query : ''}`)
    },
    // GET roadmap/:id
    getById: (id) => request(`/roadmap/${id}`),
    // GET admin/roadmap/:id/archives
    getArchivedById: (id) => request(`/admin/roadmap/${id}/archives`),
    // POST admin/roadmap/  →  { careerId, title, order, description, courses }
    create: (data) => request('/admin/roadmap', { method: 'POST', body: JSON.stringify(data) }),
    // PATCH admin/roadmap/:id
    update: (id, data) => request(`/admin/roadmap/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    // PATCH admin/roadmap/:id/archive
    archive: (id, { v }) => request(`/admin/roadmap/${id}/archive`, { method: 'PATCH', body: JSON.stringify({ v }) }),
    // PATCH admin/roadmap/:id/restore
    restore: (id, { v }) => request(`/admin/roadmap/${id}/restore`, { method: 'PATCH', body: JSON.stringify({ v }) }),
    // DELETE admin/roadmap/:id/delete
    delete: (id) => request(`/admin/roadmap/${id}/delete`, { method: 'DELETE', body: JSON.stringify({ v: 1 }) }),
    // PATCH admin/roadmap/:stepId/youtubePlayLists/:resourceId
    updateResource: (stepId, resourceId, data) => request(`/admin/roadmap/${stepId}/youtubePlayLists/${resourceId}`, { method: 'PATCH', body: JSON.stringify(data) }),
}

// ============================================================
// Resources
// ============================================================
export const resourcesAPI = {
    addCourse: (data) => request('/resources/courses', { method: 'POST', body: JSON.stringify(data) }),
    addBook: (data) => request('/resources/books', { method: 'POST', body: JSON.stringify(data) }),
    addVideo: (data) => request('/resources/videos', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/resources/${id}`, { method: 'DELETE' }),
}

// ============================================================
// Quizzes — Real API endpoints from Postman
// ============================================================
export const quizzesAPI = {
    // GET admin/quiz/?page=1&size=10&searchKey=
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/quiz/${query ? '?' + query : ''}`)
    },

    // GET admin/quiz/archives?page=1&size=10&searchKey=
    getArchived: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/quiz/archives${query ? '?' + query : ''}`)
    },

    // GET quiz/:quizId/:stepId  →  get quiz details
    getById: (id) => request(`/quiz/${id}`),

    // GET admin/quiz/:id/archives  →  get archived quiz details
    getArchivedById: (id) => request(`/admin/quiz/${id}/archives`),

    // GET quiz/questions/:quizId/:stepId  →  get quiz questions
    getQuestions: (quizId, stepId) => request(`/quiz/questions/${quizId}/${stepId}`),

    // POST admin/quiz/  →  { title, description, aiPrompt, type, tags, duration }
    create: (data) => request('/admin/quiz/', { method: 'POST', body: JSON.stringify(data) }),

    // PATCH admin/quiz/:id  →  { duration, v }
    update: (id, data) => request(`/admin/quiz/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    // PATCH admin/quiz/:id/archive  →  { v }
    archive: (id, v = 1) => request(`/admin/quiz/${id}/archive`, { method: 'PATCH', body: JSON.stringify({ v }) }),

    // PATCH admin/quiz/:id/restore  →  { v }
    restore: (id, v = 1) => request(`/admin/quiz/${id}/restore`, { method: 'PATCH', body: JSON.stringify({ v }) }),

    // DELETE admin/quiz/:id/delete  →  { v }
    delete: (id, v = 1) => request(`/admin/quiz/${id}/delete`, { method: 'DELETE', body: JSON.stringify({ v }) }),

    // POST quiz/:id  →  check answers  →  { answers: [{ questionId, type, answer }] }
    checkAnswers: (quizId, answers) => request(`/quiz/${quizId}`, { method: 'POST', body: JSON.stringify({ answers }) }),
}

// ============================================================
// Notifications — Real API endpoints from Postman
// ============================================================
export const notificationsAPI = {
    // POST admin/firebase/send-notifications-all  →  { title, body, imageUrl }
    sendToAll: (data) => request('/admin/firebase/send-notifications-all', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // POST admin/firebase/test-send-notification  →  { title, body, imageUrl, fcmToken }
    sendToOne: (data) => request('/admin/firebase/test-send-notification', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // POST admin/firebase/test-send-multiple-notifications  →  { title, body, imageUrl, fcmTokens: [] }
    sendToMultiple: (data) => request('/admin/firebase/test-send-multiple-notifications', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // POST admin/firebase/send-notifications-career/:careerId  →  { title, body, imageUrl }
    sendToCareer: (careerId, data) => request(`/admin/firebase/send-notifications-career/${careerId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
}

// ============================================================
// Admin Profile & Settings
// ============================================================
export const adminAPI = {
    getProfile: () => request('/admin/profile'),
    updateProfile: (data) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),
    changePassword: (current, newPass) => request('/admin/change-password', { method: 'POST', body: JSON.stringify({ current, newPassword: newPass }) }),
    getSettings: () => request('/admin/settings'),
    updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
    deleteAccount: () => request('/admin/account', { method: 'DELETE' }),
}
