import { useAuthContext } from '../hooks/useAuthContext';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useState, useEffect } from 'react';
import './styles/WorkoutDetails.css';

const WorkoutDetails = ({ workouts }) => {
  const { user } = useAuthContext();
  const {dispatch} = useWorkoutsContext();
  const todayDate = new Date().toLocaleDateString();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (workouts.completed_days.includes(todayDate)) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    const endpoint = isChecked ? `/api/workouts/addDate/${workouts._id}` : `/api/workouts/deleteDate/${workouts._id}`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ date: todayDate }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    

    if (response.ok){
      dispatch({ type: 'MODIFY_WORKOUT', payload: json.workout });
    }

    console.log(json);
  }

  return (
    <div className="workout-details">
      <div>
        <p><strong>{workouts.title}</strong></p>
        <p>Today</p>
      </div>

      <div className='checkbox'>
        <input type="checkbox" value={workouts.title} onChange={handleSubmit} checked={checked} />
      </div>
    </div>
  )
}

export default WorkoutDetails;
