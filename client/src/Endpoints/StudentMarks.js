import apiInstance from "../ApiInstance"

export function saveStudentCode(payload) {
    return apiInstance.post('/saveStudentCode', payload);
}

export function getAssignmentCode(payload) {
    return apiInstance.get('/getAssignmentCode', {
        params : {
            assignmentId : payload.assignmentCode,
            studentId: payload.studentId
        }
    })
}

export function getSubmissionsByClassCode(classCode) {
    return apiInstance.get('/getSubmissionsByClassCode', {
        params : {
            classCode : classCode
        }
    })
}


export function getAssignmentMarks(Id) {
    return apiInstance.get('/getAssignmentMarks', {
        params : {
            assignmentId : Id
        }
    })
}



export function addmarks(payload) {
    return apiInstance.post('/addMarks', payload)
}