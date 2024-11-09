import apiInstance from "../ApiInstance"

export function loginRequest(payload) {
    return apiInstance.post('/login', payload);
}

export function getAllUsers() {
    return apiInstance.get('/');
}

export function registerRequest(payload) {
    return apiInstance.post('/register', payload)
}