import React, { useEffect} from "react";
import WorkoutsByDate from "./view-workouts-components/WorkoutsByDate"

export default function ViewWorkoutsPage ({workouts, removeWorkout, clearWorkouts, removeDateWorkouts}) {
    
    const workoutsKeys = Object.keys(workouts)

    const workoutElements = workoutsKeys.map((workoutDate) => {

        return (
            <>
                <WorkoutsByDate
                    _id={workouts[workoutDate]._id}
                    date={workoutDate}
                    workouts={workouts[workoutDate].workouts}
                    removeDateWorkouts={removeDateWorkouts}
                    removeWorkout={removeWorkout}
                />
            </>
        )
    });

    
    return (
        <div className="parent">
            {
                workoutElements.length > 0 
                ?
                <>
                    {workoutElements}
                    <button 
                        type="button"
                        className="delete-data-button"
                        onClick={clearWorkouts}
                    >
                        Delete All Workouts
                    </button>
                </> 
                : 
                <h1 className="no-workouts">No workouts found.</h1>
            
            }
        </div>
    )
}