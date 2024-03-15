import './styles/AllWorkouts.css'
import React, { useState } from "react";

import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from '../hooks/useAuthContext'
import workoutTypes from '../db/workoutTypes.json'

const WorkoutBox = ({ workout, dispatch, selectedDay }) => {
    const { user } = useAuthContext();

    const handleClick = async () => {
        if (!user){
            return
        }

        const response = await fetch('/api/workouts/deleteDay/' + workout._id, {
            method: 'PATCH',
            body: JSON.stringify({ day: selectedDay }), // Serialize body to JSON
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            }
          })

          const json = await response.json()
      
          if (response.ok) {
            dispatch({type: 'MODIFY_WORKOUT', payload: json})
          }
          if (!response.ok){
            console.log(json.error)
          }

          console.log(workout._id)
    }

    return (
        <div className='selected-days-workout-box'>
            <div>
                <p><strong>{workout.title}</strong></p>
                {workoutTypes.map((workoutType) => {
                    if (workoutType.name === workout.title) {
                        return (<p className='calories'>{workoutType.caloriesBurnedPerHour} kcal</p>)
                    }
                    return null;
                })}
            </div>

            <div>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            </div>
        </div>
    )
}

const SelectionBar = ({ days, onDaySelect }) => {
    const [selectedDay, setSelectedDay] = useState(days[0]);

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        onDaySelect(day);
    };

    return (
        <div className="navbar">
            {days.map((day, index) => (
                <button
                    key={index}
                    className={day === selectedDay ? "active" : ""}
                    onClick={() => handleDaySelect(day)}
                >
                    {day}
                </button>
            ))}
        </div>
    );
};

const AllWorkouts = () => {
    const { workouts, dispatch } = useWorkoutsContext();

    const [selectedDay, setSelectedDay] = useState("Monday");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleDaySelect = (day) => {
        setSelectedDay(day);
    }

    return (
        <div className="all-workouts">
            <SelectionBar days={days} onDaySelect={handleDaySelect} />

            <div className="selected-day-workouts">
                {
                    workouts.map((workout, index) => {
                        if (workout.days_planned.includes(selectedDay)) {
                            return (
                                <WorkoutBox
                                    key={index}
                                    workout={workout}
                                    dispatch={dispatch}
                                    selectedDay={selectedDay}
                                />
                            );
                        }
                        return null;
                    })
                }
            </div>
        </div>
    );
}

export default AllWorkouts;
