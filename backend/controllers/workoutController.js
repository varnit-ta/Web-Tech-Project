const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id

  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })

  res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}


// create new workout
const createWorkout = async (req, res) => {
  const { title, load, reps, days_planned } = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!load) {
    emptyFields.push('load')
  }
  if (!reps) {
    emptyFields.push('reps')
  }
  if (!days_planned) {
    emptyFields.push('days_planned')
  }

  const exists = await Workout.findOne({ title, days_planned });

  if (exists) {
    return res.status(400).json({ error: "Workout already exists" })
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id


    const workout = await Workout.create({ user_id, title, load, reps, days_planned })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findOneAndDelete({ _id: id })

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}

const addDates = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' });
  }

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }


    if (!workout.completed_days.includes(date)) {
      workout.completed_days.push(date);
    }

    await workout.save();

    res.status(200).json({ message: 'Dates added successfully', workout });
  } catch (error) {
    console.error('Error adding dates to workout:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteDate = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' });
  }

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const index = workout.completed_days.indexOf(date);
    if (index !== -1) {
      workout.completed_days.splice(index, 1);
    } else {
      return res.status(404).json({ error: 'Date not found in completed days' });
    }

    await workout.save();

    res.status(200).json({ message: 'Date deleted successfully', workout });
  } catch (error) {
    console.error('Error deleting date from workout:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteDay = async (req, res) => {
  const { id } = req.params;
  const { day } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' });
  }

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const index = workout.days_planned.indexOf(day);

    if (index !== -1) {
      workout.days_planned.splice(index, 1);
      if (workout.days_planned.length === 0) {
        await workout.remove();
        return res.status(200).json({ message: 'Workout deleted successfully' });
      }
    } else {
      return res.status(404).json({ error: 'Day not found in planned days' });
    }

    await workout.save();

    res.status(200).json({ message: 'Day deleted successfully ' + day, workout });
  }
  catch (error) {
    console.error('Error deleting day from workout:', error);
    res.status(500).json({ error: 'Server error' });
  }
}




module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  addDates,
  deleteDate,
  deleteDay
}