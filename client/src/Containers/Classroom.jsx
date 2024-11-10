import { useNavigate, useParams } from "react-router-dom"

const Classroom = () => {
    const navigate = useNavigate();
    const { classroomId } = useParams();

  return (
    <div style={{backgroundColor : "red", height : "100vh", width : "100vw"}}>
        Assignments <br />
        Notes

        <button onClick={() => {
            navigate(`${classroomId}/create-assignment`);
        }} style={{backgroundColor:"blue"}}>create assignment</button>
        <button style={{backgroundColor:"blue"}}>add notes</button>
    </div>
  )
}

export default Classroom