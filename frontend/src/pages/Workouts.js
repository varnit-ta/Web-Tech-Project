import { useEffect } from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutForm from '../components/WorkoutForm'

import './styles/Workout.css'

const WorkoutHistory = () => {
  return(
    <div>
      <h1>ishfiohu</h1>
    </div>
  )
}

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
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
    <div className="workouts-page">
      <div className="workout-history">
        <h2>History</h2>
        <WorkoutHistory />
      </div>

      <div className="workout-form">
        <WorkoutForm />
      </div>
    </div>
  )
}

export default Home