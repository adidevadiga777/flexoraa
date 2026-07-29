import { loginUser, registerUser, getMe, logoutUser } from "../services/auth.api";
import { AuthContext } from "../auth.context";
import { useContext } from "react";


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        const data = await registerUser({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogin({ email, password }) {
        setLoading(true)
        const data = await loginUser({ email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function handleGetMe() {
        setLoading(true)
        try {
            const data = await getMe()
            setUser(data.user)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        setLoading(true);
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setLoading(false);
        }
    }

    return {
        user,
        loading,
        setLoading,
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    }
}