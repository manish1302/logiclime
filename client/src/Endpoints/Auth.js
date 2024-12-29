import apiInstance from "../ApiInstance"

export function loginRequest(payload) {
    return apiInstance.post('/login', payload);
}

export function logout() {
    return apiInstance.post('/logout')
}

export function getAllUsers() {
    return apiInstance.get('/getAllUsers');
}

export function registerRequest(payload) {
    return apiInstance.post('/register', payload)
}

export function getUserById() {
    return apiInstance.get('/getUserById');
}