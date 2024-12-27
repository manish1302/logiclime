import apiInstance from "../ApiInstance"

export function saveStudentCode(payload) {
    return apiInstance.post('/saveStudentCode', payload);
}
