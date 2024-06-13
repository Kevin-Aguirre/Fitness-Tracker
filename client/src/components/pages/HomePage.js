import React from "react";

export default function (props) {
    function findRecentConsecutiveEntries(datesObject) {
        // Convert object keys to date array and sort in descending order
        if (Object.keys(datesObject).length === 0) {
            return 0;
        }

        const sortedDates = Object.keys(datesObject).sort((a, b) => new Date(b) - new Date(a));
    
        let currentStreak = 1;
        let mostRecentDate = new Date(sortedDates[0]);
    
        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = new Date(sortedDates[i]);
            const expectedDate = new Date(mostRecentDate);
            expectedDate.setDate(expectedDate.getDate() - currentStreak);
    
            if (currentDate.getTime() === expectedDate.getTime()) {
                currentStreak++;
            } else {
                break; // Streak is broken
            }
        }
    
        return currentStreak;
    }

    function findConsecutiveWeeklyEntries(datesObject) {
        // Helper function to get the start of the week (Monday) for a given date
        function getStartOfWeek(date) {
            const startOfWeek = new Date(date);
            startOfWeek.setHours(0, 0, 0, 0); // normalize time to start of the day
            const dayOfWeek = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
            startOfWeek.setDate(diff);
            return startOfWeek;
        }
    
        // Convert object keys to date array and sort in descending order
        const sortedDates = Object.keys(datesObject).sort((a, b) => new Date(b) - new Date(a));
    
        if (sortedDates.length === 0) {
            return 0; // No entries, so no streak
        }
    
        let currentStreak = 0;
        let lastWeekStart = null;
    
        for (const dateStr of sortedDates) {
            const date = new Date(dateStr);
            const weekStart = getStartOfWeek(date);
    
            if (!lastWeekStart || weekStart.getTime() < lastWeekStart.getTime()) {
                currentStreak++;
                lastWeekStart = weekStart;
            }
        }
    
        return currentStreak;
    }

    let val 
    let val2
    if (props.workouts) {
        val = findRecentConsecutiveEntries(props.workouts)
        val2 = findConsecutiveWeeklyEntries(props.workouts)
    } else {
        val = "ERROR"
        val2 = "ERROR"
    }

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
            <div className="week-streak-parent">
                How Many Weeks In A Row You've Worked Out For:
                <div className="week-streak-num">
                    {val2}
                </div>
            </div>
            {!(val === 0 || val2 === 0) ? <h1 className="keep-it-up">Keep it Up!</h1> : <h1 className="keep-it-up">Get Started!</h1>}
            
        </div>
    )
}