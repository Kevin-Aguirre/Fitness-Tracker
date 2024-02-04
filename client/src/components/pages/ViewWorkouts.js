import React, { useEffect} from "react";

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

    const workoutElements = props.workouts.workouts.map((workout) => {
        const { date, exercises, _id } = workout

        return (
            <div key={_id} className="workouts">  {/* Use _id for the key as date may not be unique */}
                <h1 className="view--workout-date">
                    <div className="line"></div>
                    {convertDate(date)}
                    <div className="line"></div>
                    <button onClick={() => props.removeDateWorkouts(_id)} className="remove-date-workouts">X</button>
                </h1>
                {exercises.map((exercise, workoutIndex) => { // Map through exercises
                    return (
                        <div key={exercise._id} className="workout-grid-parent"> {/* Use exercise._id for the key */}
                            <div className="workout--info">
                                <div className="space"></div>
                                <h1 className="view--workout-index">Exercise #{workoutIndex + 1}</h1>
                                <button type="button" className="remove-workout" onClick={() => { props.removeWorkout(_id, workoutIndex) }}>X</button>
                            </div>
                            <div className="workout-grid">
                                {workout.exercises.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex} className="view--exercise-entry">
                                        <h2>{exercise.name}</h2>
                                        {exercise.sets.map((set, setIndex) => {
                                            console.log("set: ", set)
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
                                                        <div key={setIndex} className="view--set">
                                                            <div className="view--reps">Reps: {set.reps}</div>
                                                            <div className="view--weight">Weight: {set.weight}</div>
                                                        </div>
                                                    )
                                                    break;
                                            }
                                            return setElem
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

            </div>
        )
    });

    
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