const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
    reps: Number,
    weight: Number,
    time: Number,
    distance: Number,
});

const ExerciseSchema = new mongoose.Schema({
    name: String,
    type: String,
    sets: [SetSchema]
});

const WorkoutSchema = new mongoose.Schema({
    id: String,
    date: String,
    exercises: [ExerciseSchema]
});

const GoalSchema = new mongoose.Schema({
    timeFrame: String,
    startDate: String,
    endDate: String,
    goalType: String,
    goal: {
        pred: String,
        exercise: String,
        value: String
    }
});

const UserSchema = new mongoose.Schema({
    workouts: [WorkoutSchema],
    goals: [GoalSchema],
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        unique: true, 
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
