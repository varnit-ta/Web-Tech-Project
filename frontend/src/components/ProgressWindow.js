import './styles/ProgressWindow.css';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import workoutTypes from '../db/workoutTypes.json';

const ProgressWindow = ({ gotData }) => {
    const { workouts, dispatch } = useWorkoutsContext();
    const today = new Date().toLocaleString("en-us", { weekday: "long" });
    const todayDate = new Date().toLocaleDateString();

    const [totalCalories, setTotalCalories] = useState(0);
    const [doneCalories, setDoneCalories] = useState(0);

    const calculateToday = () => {
        if (!workouts) return;

        let total = 0;
        let done = 0;

        workouts.forEach((workout) => {
            if (workout.days_planned.includes(today)) {
                workoutTypes.map(workoutType => {
                    if (workoutType.name === workout.title) {
                        total += workoutType.caloriesBurnedPerHour;
                    }
                })
            }

            if (workout.completed_days.includes(todayDate)) {
                workoutTypes.map(workoutType => {
                    if (workoutType.name === workout.title) {
                        done  +=  workoutType.caloriesBurnedPerHour;
                    }
                })
            }
        });

        setTotalCalories(total);
        setDoneCalories(done);
    };

    useEffect(() => {
        calculateToday();
    }, [workouts]);

    return (
        <div className="progress-window">
            {totalCalories} <br />
            {doneCalories}
        </div>
    );
};

export default ProgressWindow;
