import './styles/AllWorkouts.css'
import React, { useState } from "react";

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
    const [selectedDay, setSelectedDay] = useState("Monday");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const handleDaySelect = (day) => {
        setSelectedDay(day);
    }

    return (
        <div className="all-workouts">
            <SelectionBar days={days} onDaySelect={handleDaySelect} />
        </div>
    );
}

export default AllWorkouts;