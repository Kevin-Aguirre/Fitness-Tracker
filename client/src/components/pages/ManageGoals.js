import React from "react";
import { faCircleXmark, faPlus, faMinus, faNetworkWired, faNavicon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function isGoalFulfilled(goal, workouts) {
    const currentDate = new Date();
    const endDate = new Date(goal.endDate);
    const startDate = new Date(goal.startDate);
    let dateIterator = new Date(goal.startDate);

    let sessionCount = 0;
    // console.log(goal.timeFrame)

    // Check if the goal type is 'general' and predicate is 'general-sessions-total'
    if (goal.goalType === "general") {
        switch(goal.goal.pred) {
            case "general-sessions-total":
                switch (goal.timeFrame) {
                    case "anytime":
                        for (let date in workouts) {
                            let workoutDate = new Date(date);
                            if (workoutDate >= startDate && workoutDate <= endDate) {
                                sessionCount += workouts[date].length; // Assuming each entry in workouts[date] is one session
                            }
                        }
                
                        // Check if goal is fulfilled, pending, or failed
                        if (sessionCount >= goal.goal.value) {
                            return "fulfilled";
                        } else if (currentDate <= endDate) {
                            return "pending";
                        } else {
                            return "failed";
                        }
                    case "daily":
                        while (dateIterator <= endDate) {
                            console.log(dateIterator)
                            let sessionCount = 0;
                            let dateKey = dateIterator.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

                            if (workouts[dateKey]) {
                                sessionCount += workouts[dateKey].length
                            } else if (currentDate.toISOString().split('T')[0] === dateKey) {
                                return "pending"
                            } else {
                                return "failed"
                            }
                         
                            dateIterator.setDate(dateIterator.getDate() + 1);
                        }

                        return "fulfilled"
                    default: 
                        return "invalid timeFrame (not anytime)"
                }
                break;
            default:
                return "invalid goal pred (not total sessions)"
        }
        // Count the number of workout sessions between startDate and endDate
    }

    return "invalid goal"; // In case of unsupported goal type or predicate
}

function makeGoalStatement(goal) {
    let dates = `${goal.startDate} - ${goal.endDate}:`

    let thing;
    switch (goal.goalType) {
        case "general":
            switch (goal.goal.pred) {
                case "general-sessions-total":
                    thing = `Workout ${goal.goal.value} Times`
                    break
                default:
                    thing = `[INVALID PRED]`
                    
                // case "general-mins-total":
            }
            break
        default:
            thing = `[INVALID GOAL TYPE]`   
            break;
    }

    let wordedTimeFrame;
    switch (goal.timeFrame) {
        case "daily":
            wordedTimeFrame = "every day."
            break
        case "weekly":
            wordedTimeFrame = "every week."
            break
        case "monthly":
            wordedTimeFrame = "every month."
            break
        case "yearly":
            wordedTimeFrame = "every year."
            break
        case "anytime":
            wordedTimeFrame = ""
            break
        default:
            wordedTimeFrame = `[INVALID TIMEFRAME]`
    }

    return `${thing} ${wordedTimeFrame}`

}



export default function ManageGoalsPage ({ clearGoals, removeGoal, goals, workouts }) {

    const goalElements = goals.map((goal, index) => {
        const isFulfillied = isGoalFulfilled(goal, workouts)
        let background;
        switch (isFulfillied) {
            case "fulfilled":
                background = {backgroundColor : '#50d471'}
                break
            case "pending":
                background = {backgroundColor : '#ffb657'}
                break   
            case "failed":
                background = {backgroundColor : '#ff483b'}
                break    
            default:
                background = {backgroundColor : 'black'}
                break
        }

        return (
            <div style={background} key={index} className="goal">
                <h3>Goal #{index + 1}</h3>
                <p className="goalElem"><strong>Start Date:</strong> <br/>{goal.startDate}</p>
                <p className="goalElem"><strong>End Date:</strong> <br/>{goal.endDate}</p>
                {goal.goal.exercise && <p><strong>Exercise:</strong> <br/>{goal.goal.exercise}</p>}
                <p className="goalElem"><strong>Worded Goal:</strong> <br/>{makeGoalStatement(goal)}</p>
                <p className="goalElem"><strong>Status:</strong> 
                    <br/>
                    {isFulfillied}
                </p>
                <button type="button" onClick={() => removeGoal(index)}>
                    <FontAwesomeIcon className="minus-icon-goal" icon={faMinus}></FontAwesomeIcon>
                </button>
            </div>
        )
    })

    return (
        <div className="parent">
            {
                goals.length !==0
                ?
                <div className="goals-checklist">
                    {goalElements}
                    <button onClick={clearGoals} type="button" className="cleargoalsbtn"> Delete All Goals</button>
                </div>
                :
                <div className="no-goals">You have no goals, start setting some!</div>
            }
        </div>
    )
}