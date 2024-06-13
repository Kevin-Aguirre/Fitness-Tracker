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
    },
    goals: [GoalSchema],
    workouts: {
        type: Map,
        of: new mongoose.Schema({
            workouts: [WorkoutSchema]
        })
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
