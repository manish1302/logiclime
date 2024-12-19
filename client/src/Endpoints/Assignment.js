import apiInstance from "../ApiInstance"

export const saveAssignments = (assignment) => {
    return apiInstance.post('/saveAssignments', assignment);
}

export const getAssignmentsByClassCode = (classCode) => {
    return apiInstance.get('/getAssignments', {
        params : {
            classCode : classCode
        }
    })
}

export const getAssignmentById = (Id) => {
    return apiInstance.get("/getAssignmentById", {
        params : {
            Id : Id
        }
    })
}