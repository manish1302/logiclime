import apiInstance from "../ApiInstance";

export function createClassroom(payload) {
  return apiInstance.post("/createClass", payload);
}

export function getClassroomsById() {
  return apiInstance.get("/getAllClassroomsById");
}