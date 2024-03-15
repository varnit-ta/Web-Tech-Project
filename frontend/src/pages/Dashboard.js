import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import workoutGuy from "../assets/workout.png";
import WorkoutDetailsSameDay from "../components/WorkoutDetailsSameDay";
import './styles/Dashboard.css'

const Dashboard = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const today = new Date().toLocaleString("en-us", { weekday: "long" });

    const [upcomingWorkouts, setUpcomingWorkouts] = useState(0);
    const [workoutsPlannedForToday, setWorkoutsPlannedForToday] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch("/api/workouts", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: "SET_WORKOUTS", payload: json });
            }
        };

        if (user) {
            fetchWorkouts();
        }
    }, [dispatch, user]);

    useEffect(() => {
        const countUpcomingWorkouts = () => {
            if (!workouts) return;
            const workoutsPlannedForToday = workouts.filter((workout) =>
                workout.days_planned.includes(today)
            );
            setUpcomingWorkouts(workoutsPlannedForToday.length);
            setWorkoutsPlannedForToday(workoutsPlannedForToday);
        };

        countUpcomingWorkouts();
    }, [workouts, today]);

    return (
        <div className="dashboard">
            <h1>Hello, {user?.user.userName ?? "Guest"} 👋</h1>

            <div className="dashboard-notification">
                <img src={workoutGuy} alt="Workout Guy" />
                <p>
                    You have {upcomingWorkouts} upcoming workouts.{" "}
                    {upcomingWorkouts !== 0 ? "Keep up the good work!" : ""}
                </p>
            </div>

            <h2>Upcoming</h2>

            <div className="dashboard-workouts">
                {
                    workoutsPlannedForToday.length !== 0 ? (
                        workoutsPlannedForToday.map((workout, i) => (
                            <WorkoutDetailsSameDay workouts={workout} key={i}/>
                        ))
                    ) : (
                        <p>No workouts planned for today</p>
                    )
                }
            </div>
        </div>
    );
};

export default Dashboard;
