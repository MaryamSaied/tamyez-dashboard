// ============================================================
// Auth utilities — manage login session
// ============================================================

const TOKEN_KEY = 'accessToken'
const USER_KEY  = 'user'

export const auth = {
    login(accessToken, user = null) {
        localStorage.setItem(TOKEN_KEY, accessToken)
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    logout() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },
    isAuthenticated() {
        return !!localStorage.getItem(TOKEN_KEY)
    },
    getUser() {
        const data = localStorage.getItem(USER_KEY)
        return data ? JSON.parse(data) : null
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },
}
