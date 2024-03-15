import { useAuthContext } from '../hooks/useAuthContext';
import './styles/WorkoutDetails.css'

const WorkoutDetails = ({ workouts }) => {
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    const date = new Date().toLocaleDateString();

    if (e.target.checked){
      const response = await fetch(`/api/workouts/addDate/${workouts._id}`, {
        method: "PATCH",
        body: JSON.stringify({ date }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      console.log(json);
    } 

    if (e.target.checked === false){
      const response = await fetch(`/api/workouts/deleteDate/${workouts._id}`, {
        method: "PATCH",
        body: JSON.stringify({ date }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      console.log(json);
    }
  }


  return (
    <div className="workout-details">
      <div>
        <p><strong>{workouts.title}</strong></p>
        <p>Today</p>
      </div>

      <div className='checkbox'>
        <input type="checkbox" value={workouts.title} onChange={handleSubmit}/>
      </div>

    </div>
  )
}

export default WorkoutDetails