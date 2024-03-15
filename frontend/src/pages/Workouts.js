import { useEffect } from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutForm from '../components/WorkoutForm'

import './styles/Workouts.css'
import workoutTypes from '../db/workoutTypes.json'
import AllWorkouts from '../components/AllWorkouts'

const WorkoutHistoryBox = ({ workouts, time }) => {
  return (
    <div className='workout-history-box'>
      <div>
        <p><strong>{workouts.title}</strong></p>
        {workoutTypes.map((workoutType) => {
          if (workoutType.name === workouts.title) {
            return (<p className='calories'>{workoutType.caloriesBurnedPerHour} kcal</p>)
          }
        })}
      </div>

      <p className='time'>{time + " >"}</p>


    </div>
  )
}

const WorkoutHistory = ({ workouts }) => {
  const today = new Date().toLocaleDateString();
  const yesterdayDate = new Date(Date.now() - 86400000).toLocaleDateString('en-US');

  return (
    <div className='workout-history-list'>
      {
        workouts.map((workout, index) => {
          if (workout.completed_days.includes(today)) {
            return (
              <WorkoutHistoryBox
                key={index}
                workouts={workout}
                time={"Today"}
              />
            );
          }
        })
      }
      {
        workouts.map((workout, index) => {
          if (workout.completed_days.includes(yesterdayDate)) {
            return (
              <WorkoutHistoryBox
                key={index}
                workouts={workout}
                time={"Yesterday"}
              />
            );
          }
        })
      }
    </div>
  );
};

const Home = () => {
  const { dispatch, workouts } = useWorkoutsContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json })
      }
    }

    if (user) {
      fetchWorkouts()
    }
  }, [dispatch, user])

  return (
    <div className='workouts-page'>
      <div className="left">
        <div className="all-workouts">
          <h2>Workouts</h2>
          <AllWorkouts />
        </div>

        <div className="workout-history">
          <h2>History</h2>
          <WorkoutHistory workouts={workouts} />
        </div>
      </div>


      <div className="right">
        <WorkoutForm />
      </div>
    </div>
  )
}

export default Home;