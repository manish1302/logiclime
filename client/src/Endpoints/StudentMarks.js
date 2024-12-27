import apiInstance from "../ApiInstance"

export function saveStudentCode(payload) {
    return apiInstance.post('/saveStudentCode', payload);
}

export function getAssignmentCode(payload) {
    return apiInstance.get('/getAssignmentCode', {
        params : {
            assignmentId : payload
        }
    })
}
