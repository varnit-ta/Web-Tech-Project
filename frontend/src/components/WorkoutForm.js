import React, { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import "./styles/WorkoutForm.css";
import workoutTypes from '../db/workoutTypes.json'

const WorkoutForm = () => {
  const { dispatch, workouts } = useWorkoutsContext();
  const { user } = useAuthContext();

  const daysOption = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { title, load, reps, days_planned: selectedDays };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      if (json.error !== "Workout already exists"){
        setEmptyFields(json.emptyFields);
      }
    }
    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setSelectedDays([]);
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  const handleDelete = (day) => {
    setSelectedDays(selectedDays.filter((d) => d !== day));
  };

  const handleSelectChange = (e) => {
    const selectedDay = e.target.value;
    setSelectedDays([...selectedDays, selectedDay]);
  };

  const availableDays = daysOption.filter((day) => !selectedDays.includes(day));

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h2>Add a New Workout</h2>

      <label>Exercise Title:</label>
      <select
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      >
        {
          workoutTypes.map((type, i) => (
            <option key={i} value={type.name}>
              {type.name}
            </option>
          ))
        }
      </select>


      <label>Days:</label>
      <select
        onChange={handleSelectChange}
        value=""
        className={emptyFields.includes("days_planned") ? "error" : ""}
      >
        {availableDays.map((day, i) => (
          <option key={i} value={day}>
            {day}
          </option>
        ))}
      </select>
      <ul>
        {selectedDays.map((day, i) => (
          <div key={i}>
            {day}
            <span onClick={() => handleDelete(day)}>&#10006;</span>
          </div>
        ))}
      </ul>

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
