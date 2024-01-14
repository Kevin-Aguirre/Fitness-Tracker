import React, { version } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const defaultForm = {
    timeFrame: "",
    startDate: "",
    endDate: "",
    goalType: "",
    goal: {
        pred: "",
        exercise: "",
        value: ""
    }
}

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

function convertTimeFrame(timeFrame) {
    switch(timeFrame) {
        case "daily":
            return "For every day"
        case "weekly":
            return "For every week"
        case "monthly":
            return "For every month"
        case "yearly":
            return "For every year"
        case "anytime":
            return "At any point"
    }
}

function convertPred(goalPred, goalVal) {
    // console.log("pred:", goalPred)
    switch(goalPred) {
        case "general-sessions-total":
            return `workout ${goalVal} times.`
        case "general-mins-total":
            return "[INCOMPLETE]"
    }
}

export default function SetGoalPage (props) {

    
    const [validationErrors, setValidationErrors] = React.useState({})
    const [formData, setFormData] = React.useState(defaultForm)
    const [touched, setTouched] = React.useState({
        timeFrame: false,
        startDate: false,
        endDate: false,
        goalType: false,
        pred: false,
        value: false,
        submit: false
    });



    console.log("errs ", validationErrors)
    // helper functions

    function isDateBefore(firstDateStr, secondDateStr) {
        const firstDate = new Date(firstDateStr);
        const secondDate = new Date(secondDateStr);
    
        return firstDate < secondDate;
    }

    function isWithinTimeframe(startDateStr, endDateStr, timeframe) {

        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0); // Set to start of the day
        const endDate = new Date(endDateStr);
        endDate.setHours(0, 0, 0, 0); // Set to start of the day


        const timeDiff = endDate - startDate; // Difference in milliseconds

        const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay; // Approximation of a month
        const oneYear = 365 * oneDay; // Approximation of a year
    
        switch (timeframe) {
            case 'daily':
                return timeDiff >= oneDay;
            case 'weekly':
                return timeDiff >= oneWeek;
            case 'monthly':
                return timeDiff >= oneMonth;
            case 'yearly':
                return timeDiff >= oneYear;
            case 'anytime':
                return true; // 'anytime' always fits
            default:
                return false; // Invalid timeframe
        }
    }

    // form functions

    function handleDateTimeGoalChange(event) {
        const { id, value } = event.target;
        let updatedValue = value;
        
        
        // Handling date format for startDate and endDate
        if (id === "startDate" || id === "endDate") {
            let year = updatedValue.split('-')[0];
            if (year.length > 4) {
                year = year.substring(0, 4);
                updatedValue = year + '-' + updatedValue.split('-').slice(1).join('-');
            }
        }
        
        // Validation logic
        let errors = { ...validationErrors };
        if (id === "timeFrame") {
            if (!formData.startDate || !formData.endDate) {
                errors["date"] = "Start and end date must be included."
            } else if (!isDateBefore(formData.startDate, formData.endDate)) {
                errors["date"] = "Start date must be before end date."
            } else if (!isWithinTimeframe(formData.startDate, formData.endDate, updatedValue)) {
                errors["date"] = "Start and end dates do not fit within timeframe."
            } else {
                delete errors["date"]
            }

            if (!formData.goalType) {
                errors.goalType = "You must select a goal type."
            } else {
                delete errors.goalType
            }
            // if (!isWithinTimeframe(formData.startDate, formData.endDate, updatedValue)) {
                
                // }
                // errors["date"] = "u updated timeFrame"
                
        } else if (id === "startDate") {
            if (!formData.endDate) {
                errors["date"] = "Start and end date must be included."
            } else if (!isDateBefore(updatedValue, formData.endDate)) {
                errors["date"] = "Start date must be before end date."
            } else if (!formData.timeFrame) {
                errors["date"] = "Timeframe must be included."
            } else if (!isWithinTimeframe(updatedValue, formData.endDate, formData.timeFrame)) {
                errors["date"] = "Start and end dates do not fit within time frame."
            } else {
                delete errors["date"]
            }

            if (!formData.goalType) {
                errors.goalType = "You must select a goal type."
            } else {
                delete errors.goalType
            }
        // logic here to checl i feverything else makes sense
        } else if (id === "endDate") {
            if (!formData.startDate) {
                errors["date"] = "Start and end date must be included."
            } else if (!isDateBefore(formData.startDate, updatedValue)) {
                errors["date"] = "Start date must be before end date."
            } else if (!formData.timeFrame) {
                errors["date"] = "Timeframe must be included."
            } else if (!isWithinTimeframe(formData.startDate, updatedValue, formData.timeFrame)) {
                errors["date"] = "Start and end dates do not fit within timeframe."
            } else {
                delete errors["date"]
            }

            if (!formData.goalType) {
                errors.goalType = "You must select a goal type."
            } else {
                delete errors.goalType
            }
        } else {
            if (id === "goalType" && updatedValue) {
                delete errors["goalType"]
            } else {
                errors["goalType"] = "You must select a goal type."
            }

            if (!formData.timeFrame) {
                errors["date"] = "timeframe must be included"
            } else if (!formData.startDate) {
                errors["date"] = "start and end date must be incldued"
            } else if (!isDateBefore(formData.startDate, formData.endDate)) {
                errors["date"] = "start date must be before end date "
            } else if (!isWithinTimeframe(formData.startDate, formData.endDate, formData.timeFrame)) {
                errors["date"] = "start and end dates do not fit within timeframe"
            } else {
                delete errors["date"]
            }            

            errors["pred"] = "You must select a goal."
            errors["value"] = "You must enter a value for your goal."
        }

        // console.log("id: ", id)
        // console.log("val: ", updatedValue)
        // console.log("touched: ", touched)
        // console.log("goal type", formData.goalType)
        // console.log(errors)
        setValidationErrors(errors);
        
        // Update formData
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: updatedValue
        }));
    
        // Mark as touched
        setTouched(prevTouched => ({
            ...prevTouched,
            [id]: true,
            goal: false
        }));
    
    }
    

    function handleGoalPredChange(event) {
        const val = event.target.value
        // console.log("val", val)

        let errors = {...validationErrors}
        if (errors["pred"]) {
            delete errors["pred"]
        }
        setValidationErrors(errors)


        setFormData(prevFormData => ({
            ...prevFormData,
            goal: {
                ...prevFormData.goal,
                pred: val
            }
        }))

    }

    function handleGoalValueChange(event) {
        const value = event.target.value;
        const isDigitOnly = /^[0-9]*$/;
        let errors = {...validationErrors}
        if (isDigitOnly.test(value) && value.length <= 4) {
            // console.log("passed")
            setFormData(prevFormData => ({
                ...prevFormData,
                goal: {
                    ...prevFormData.goal,
                    value: value
                }
            }))
            
            if (value === "0") {
                errors["value"] = "Your goal value cannot be 0."
            } else if (value === "") {
                errors["value"] = "You must enter a value for your goal."
            } else {
                delete errors["value"]
            }

        } 
        setValidationErrors(errors)
    }

    //     const [validationErrors, setValidationErrors] = React.useState({})
    function handleSubmit(event) {
        event.preventDefault()

        let errors = {}
        console.log("submitted")

        if (formData.timeFrame === "") {
            errors["date"] = "You must choose a timeframe."
        } else if (!formData.startDate || !formData.endDate) {
            errors["date"] = "Start and end Dates must be included."
        } else if (!isDateBefore(formData.startDate, formData.endDate)) {
            errors["date"] = "Start date must be before end date."
        } else if (!isWithinTimeframe(formData.startDate, formData.endDate, formData.timeFrame)) {
            errors["date"] = "Start and end dates do not fit within timeframe."
        } else {
            delete errors["date"]
        }

        if (formData.goalType === "") {
            errors["goalType"] = "You must select a goal type."
        } else {
            delete errors["goalType"]
        }

        if (formData.goal.pred === "") {
            errors["pred"] = "You must select a goal."
        } else {
            delete errors["pred"]
        }

        if (formData.goal.value === "") {
            errors["value"] = "You must enter a value for your goal."
        } else if (formData.goal.value === "0") {
            errors["value"] = "Your goal value cannot be 0."
        } else {
            delete errors["value"]
        }

        setTouched((prevTouched) => ({
            ...prevTouched,
            goal: true
        }))


        if (Object.keys(errors).length === 0) {
            props.addGoal(formData)
            
            setFormData(defaultForm)
            setValidationErrors({})
        } else {
            // console.log(errors)
            setValidationErrors(errors)
        }
    }

    function resetForm() {
        console.log("clicked")
        setFormData(defaultForm)
    }

    return (
        <div className="parent">
            {/* set goal form */}
            <form className="goal-form" onSubmit={handleSubmit}>
                <h1 className="goal-form-heading">Set Some Goals!</h1>
                <div className="form-inputs">
                    <div className="field-parent">
                        <label className="selection-label" htmlFor="timeFrame">Please Select a Time Frame: </label>
                        <select
                            className="selection-dropdown"
                            id="timeFrame"
                            value={formData.timeFrame}
                            onChange={handleDateTimeGoalChange}
                        >
                            <option value="" disabled>Select a Time Frame</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option className="yearly">Yearly</option>
                            <option value="anytime">Anytime</option>    
                        </select>
                    </div>
                    {
                        touched.timeFrame && validationErrors.timeFrame 
                        && 
                        <div className="validation-error">
                            <FontAwesomeIcon className="x-icon" icon={faCircleXmark}></FontAwesomeIcon>
                            {validationErrors.timeFrame}
                        </div>}
                    <div className="field-parent">
                        <label className="selection-label" htmlFor="startDate">Start Date:</label>
                        <input
                            className="selection-dropdown"
                            type="date"
                            id="startDate"
                            value={formData.startDate}
                            onChange={handleDateTimeGoalChange}
                            />
                    </div>
                    <div className="field-parent">
                        <label className="selection-label" htmlFor="endDate">End Date:</label>
                        <input
                            className="selection-dropdown"
                            type="date"
                            id="endDate"
                            value={formData.endDate}
                            onChange={handleDateTimeGoalChange}
                            />
                    </div>
                    {
                        (touched.startDate || touched.endDate || touched.timeFrame || touched.goalType || touched.goal) && 
                        validationErrors.date && 
                        <div className="validation-error">
                            <FontAwesomeIcon className="x-icon" icon={faCircleXmark}></FontAwesomeIcon>
                            {validationErrors.date}
                        </div>}
                    {/* {validationErrors["date"] && <div className="validation-error">{validationErrors.date}</div>} */}
                    <div className="field-parent">
                        <label className="selection-label" htmlFor="goal-type-input">Goal Type: </label>
                        <select
                            className="selection-dropdown"
                            id="goalType"
                            value={formData.goalType}
                            onChange={handleDateTimeGoalChange}
                        >
                            <option value="" disabled>Select A Goal Type</option>
                            <option value="general">General</option>
                            {/* <option value="progression">Progression</option> */}
                        </select>
                    </div>
                        {
                            (touched.startDate || touched.endDate || touched.timeFrame || touched.goalType || touched.goal) && 
                            validationErrors["goalType"] && 
                            <div className="validation-error">
                                <FontAwesomeIcon className="x-icon" icon={faCircleXmark}></FontAwesomeIcon>
                                {validationErrors["goalType"]}
                            </div>
                        }
                    {
                        formData.goalType === "general" &&   
                        <div className="field-parent-parent">
                            <div className="field-parent">
                                <label className="selection-label" htmlFor="pred">Select A Goal:</label>
                                <select
                                    className="selection-dropdown"
                                    id="pred"
                                    value={formData.goal.pred}
                                    onChange={handleGoalPredChange}
                                >
                                    <option value="" disabled>Selected Goal</option>
                                    <option value="general-sessions-total">Workout _ Times in Total</option>
                                    <option value="general-mins-total">Workout For _ Minutes</option>
                                </select>   
                            </div>
                            {
                                validationErrors["pred"] && 
                                <div className="validation-error">
                                    <FontAwesomeIcon className="x-icon" icon={faCircleXmark}></FontAwesomeIcon>
                                    {validationErrors["pred"]}
                                </div>
                            }
                            <div className="field-parent"> 
                                <label className="selection-label" htmlFor="goal-selection-val">Select A Value for Your Goal: </label>
                                <input
                                    type="text"
                                    className="selection-dropdown"
                                    id="goal-selection-val"
                                    placeholder="0"
                                    value={formData.goal.value}
                                    onChange={handleGoalValueChange}
                                />

                            </div>               
                            {
                                validationErrors["value"] && 
                                <div className="validation-error">
                                    <FontAwesomeIcon className="x-icon" icon={faCircleXmark}></FontAwesomeIcon> 
                                    {validationErrors["value"]}
                                </div>
                            }         
                        </div>

                    }
                    <div className="goal-preview">
                        <h1>
                            Goal Preview:
                        </h1>   
                        {
                            Object.keys(validationErrors).length > 0 || JSON.stringify(formData) === JSON.stringify(defaultForm) 
                            ?   
                            <div>Please finish the form first.</div>
                            :
                            <div>   
                                {convertTimeFrame(formData.timeFrame)}, between {convertDate(formData.startDate)} and {convertDate(formData.endDate)}, I will {convertPred(formData.goal.pred, formData.goal.value)}
                            </div>
                        }
                    </div>
                </div>
                <button className="submit--button">Add Goal</button>
                <button className="submit--button" type="button" onClick={resetForm}>Clear Form</button>
            </form>
        </div>
    )
}



/*
goaltracker /



potential goals:
  timed (daily, weekly, monthly, anytime):
    - progression specific
      - weight: increase total weight lifted (reps x set) for one exercise or in total for period
      - time: extend hold by certain amount of time 
      - rep: try to complete n repetitions in a set or workout or in total for period
      - distance: try to move n miles for exercise or in period
    - general:
      - workout n times
      - workout for n minutes
  -streak system (day #234 of working out)

  homepage / 
  Welcome Back!

  How Many Days In A Row You've Worked Out for: 
    n

  How Many Weeks In A Row You've Worked Out for:


2 can for chris 
1.5 for other cats


*/