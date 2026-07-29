import axios from "axios"
import { API_BASE_URL } from "../../../config"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

export async function registerUser({ email, password, username }) {
    const response = await api.post("/api/auth/register", { email, password, username })
    return response.data
}

export async function loginUser({ email, password }) {
    const response = await api.post("/api/auth/login", { email, password })
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}

export async function logoutUser() {
    const response = await api.post("/api/auth/logout")
    return response.data
}