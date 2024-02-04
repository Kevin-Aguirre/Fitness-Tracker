import React from "react";

export default function ViewWorkoutsPage (props) {
    function convertDate(aDate) {
        const dates = {
            "01": "January",
            "02": "February",
            "03": "March",
            "04": "April",
            "05": "May",
            "06": "June",
            "07": "July",
            "08": "August",
            "09": "September",
            "10": "October",
            "11": "November",
            "12": "December"
        };
    
        let aDateArr = aDate.split("-")
        return `${dates[aDateArr[1]]} ${aDateArr[2]}, ${aDateArr[0]}`
    }

    console.log(props.workouts);


    const workoutElements = Object.entries(props.workouts).map(([date, workoutSessions]) => (
        <div key={date} className="workouts">
            <h1 className="view--workout-date">
                <div className="line"></div>
                {convertDate(date)}
                <div className="line"></div>
                <button onClick={() => props.removeDateWorkouts(date)} className="remove-date-workouts">X</button>
            </h1>
            {workoutSessions.map((workout, workoutIndex) => (
                <div className="workout-grid-parent">
                    <div className="workout--info">
                        <div className="space"></div>
                        <h1 className="view--workout-index">Workout #{workoutIndex + 1}</h1>
                        <button type="button" className="remove-workout" onClick={() => {props.removeWorkout(date, workoutIndex)}}>X</button>
                    </div>
                    <div key={workout.id} className="workout-grid">
                        {workout.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="view--exercise-entry">
                                <h2>{exercise.name}</h2>
                                {exercise.sets.map((set, setIndex) => {
                                    let setElem;
                                    switch(exercise.type) {
                                        case "time-based":
                                            setElem = (
                                                <div key={setIndex} className="view--set">
                                                    <div className="view--time">Time: {set.time}</div>
                                                </div>
                                            )
                                            break;
                                        case "rep-based":
                                            setElem = (
                                                <div key={setIndex} className="view--set">
                                                    <div className="view--reps">Reps: {set.reps}</div>
                                                </div>
                                            )
                                            break;
                                        case "weight-based":
                                            setElem = (
                                                <div key={setIndex} className="view--set">
                                                    <div className="view--reps">Reps: {set.reps}</div>
                                                    <div className="view--weight">Weight: {set.weight}</div>
                                                </div>
                                            )
                                            break;
                                        case "distance-based":
                                            setElem = (
                                                <div key={setIndex} className="view--set">
                                                    <div className="view--time">Time: {set.time}</div>
                                                    <div className="view--distance">Distance: {set.distance}</div>
                                                </div>
                                            )
                                            break;
                                        default:
                                            setElem = (
                                                <div>Something went Wrong.</div>
                                            )
                                            break;
                                    }
                                    return setElem
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    ));

    
    return (
        <div className="parent">
            {workoutElements.length > 0 ? workoutElements : <h1 className="no-workouts">No workouts found.</h1>}
            {workoutElements.length > 0 &&         
                <button 
                    type="button"
                    className="delete-data-button"
                    onClick={props.clearWorkouts}
                >
                    Delete All Workouts
                </button>
            }
        </div>
    )
}