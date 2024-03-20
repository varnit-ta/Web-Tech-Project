import { useAuthContext } from '../hooks/useAuthContext';
import workoutTypes from '../db/workoutTypes.json';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const WorkoutBox = ({ workout, selectedDay }) => {
    const { user } = useAuthContext();
    const { dispatch } = useWorkoutsContext();

    const handleClick = async () => {
        if (!user) {
            return;
        }

        const response = await fetch('/api/workouts/deleteDay/' + workout._id, {
            method: 'PATCH',
            body: JSON.stringify({ day: selectedDay }), // Serialize body to JSON
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            }
        });

        const json = await response.json();

        if (response.ok) {
            console.log(json)
            dispatch({ type: 'MODIFY_WORKOUT', payload: json.workout });
        }
        if (!response.ok) {
            console.log(json.error);
        }
    };

    return (
        <div className='selected-days-workout-box'>
            <div>
                <p><strong>{workout.title}</strong></p>
                {workoutTypes.map((workoutType, index) => {
                    if (workoutType.name === workout.title) {
                        return (
                            <p key={index} className='calories'>
                                {workoutType.caloriesBurnedPerHour} kcal
                            </p>
                        );
                    }
                    return null;
                })}
            </div>

            <div>
                <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            </div>
        </div>
    );
};

export default WorkoutBox;
