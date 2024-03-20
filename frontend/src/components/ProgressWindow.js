import './styles/ProgressWindow.css';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useEffect, useState } from 'react';
import workoutTypes from '../db/workoutTypes.json';


import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressWindow = () => {
    const { workouts } = useWorkoutsContext();
    const today = new Date().toLocaleString("en-us", { weekday: "long" });
    const todayDate = new Date().toLocaleDateString();

    const [totalCalories, setTotalCalories] = useState(0);
    const [doneCalories, setDoneCalories] = useState(0);
    const [percentage, setPercentage] = useState(0);

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
                        done += workoutType.caloriesBurnedPerHour;
                    }
                })
            }
        });

        setTotalCalories(total);
        setDoneCalories(done);
        setPercentage((done / total) * 100);
    };

    useEffect(() => {
        calculateToday();
    }, [workouts]);

    return (
        <div className="progress-window">


            <h3>Day</h3>
            <div className='circular-progress-bar'>
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    strokeWidth={6}
                    styles={buildStyles({
                        rotation: 0.25,
                        strokeLinecap: 'round',
                        textSize: '16px',
                        pathTransitionDuration: 0.5,
                        pathColor: '#1aac83',
                        textColor: 'black',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                    })}
                />
            </div>



        </div>
    );
};

export default ProgressWindow;
