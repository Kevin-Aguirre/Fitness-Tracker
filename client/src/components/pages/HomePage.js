import React from "react";


function decrementDate(dateString) {
    // Parse the input date string
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Create a new Date object
    const date = new Date(year, month - 1, day);

    // Decrement the date by one day
    date.setDate(date.getDate() - 1);

    // Format the date back to 'yyyy-mm-dd'
    const decrementedYear = date.getFullYear();
    const decrementedMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const decrementedDay = String(date.getDate()).padStart(2, '0');

    return `${decrementedYear}-${decrementedMonth}-${decrementedDay}`;
}


function findRecentConsecutiveEntries(workouts) {
    if (Object.keys(workouts).length === 0) {
        return 0;
    }

    let streak = 0
    let date = new Date().toISOString().split('T')[0]
    while (workouts[date]) {
        streak += 1

        date = decrementDate(date)
    }

    console.log(streak);
    return streak;

}



export default function HomePage({ workouts }) {
    const val = findRecentConsecutiveEntries(workouts)
    console.log(workouts);

    return (
        <div className="parent">
            <h1 className="welcome-text">
                Welcome Back!
            </h1>
            <div className="day-streak-parent">
                How Many Days In A Row You've Worked Out For:  
                <div className="day-streak-num">
                    {val}
                </div>           
            </div>
            {val !== 0 ? <h1 className="keep-it-up">Keep it Up!</h1> : <h1 className="keep-it-up">Get Started!</h1>}
            
        </div>
    )
}