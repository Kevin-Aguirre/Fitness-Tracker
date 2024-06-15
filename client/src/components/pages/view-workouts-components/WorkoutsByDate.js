import Exercise from "./Exercise";

function convertDate(aDate) {
    if (!aDate) {
        return;
    }
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




export default function WorkoutsByDate({ _id, date, workouts, removeDateWorkouts, removeWorkout}) {


    const workoutsElements = workouts.map((workout, workoutIndex) => { // Map through exercises
        return (
            <div key={workout._id} className="workout-grid-parent"> {/* Use exercise._id for the key */}
                <div className="workout--info">
                    <div className="space"></div>
                    <h1 className="view--workout-index">Workout #{workoutIndex + 1}</h1>
                    <button type="button" className="remove-workout" onClick={() => {removeWorkout(date, workout._id) }}>X</button>
                </div>
                <div className="workout-grid">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                        <Exercise
                            exerciseIndex={exerciseIndex}
                            exercise={exercise}
                        />
                    ))}
                </div>
            </div>
        )
    })

    return (
        <div key={_id} className="workouts">  {/* Use _id for the key as date may not be unique */}
            <h1 className="view--workout-date">
                <div className="line"></div>
                {convertDate(date)}
                <div className="line"></div>
                <button onClick={() => removeDateWorkouts(date)} className="remove-date-workouts">X</button>
            </h1>
            {workoutsElements}

        </div>
    )
}