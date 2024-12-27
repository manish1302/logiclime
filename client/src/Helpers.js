export const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const expiry = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
}


export const isStudent = () => {
    return localStorage.getItem('role') == 'Student'
}

export const isEducator = () => {
    return localStorage.getItem('role') == 'Educator'
}