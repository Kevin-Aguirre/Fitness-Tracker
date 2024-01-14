import React, { useEffect, useReducer } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const defaultForm = {
    date : "",  
    exercises : []
}


export default function AddWorkoutPage (props) {
    const debug = false
    const exerciseNameRegex = /^[A-Za-z ]{0,20}$/;
    const digitRegex = /^\d{0,4}$/;

    const [touched, setTouched] = React.useState({})
    const [validationErrors, setValidationErrors] = React.useState({})
    const [formData, setFormData] = React.useState(defaultForm)
    
    function addExercise () {
        setFormData((prevFormData) => ({
            ...prevFormData,
            exercises : [
                ...prevFormData.exercises,
                {
                    name : "",
                    type: "weight-based",
                    sets : [{reps: "", weight: ""}]
                }
            ]
        }))
    }
    
    function addSet(index) {
        setFormData(prevFormData => {

            const updatedExercises = [...prevFormData.exercises]
            const currType = updatedExercises[index].type
            console.log("adding set at ", index)
            
            let newSet;
            switch (currType) {
                case "time-based":
                    newSet = {
                        time: ""
                    }
                    break;
                case "rep-based":
                    newSet = {
                        reps: ""
                    }
                    break;
                case "distance-based":
                    newSet = {
                        distance: "",
                        time: ""
                    }
                    break;
                case "weight-based":
                    newSet = {
                        weight: "",
                        reps: ""
                    }
                    break;
                default:
                    console.log("something wrong happened")
                    break
            }
            
            updatedExercises[index].sets.push(newSet)
            return {
                ...prevFormData,
                exercises: updatedExercises
            }

        })
    }
    
    function rmExercise(index) {
        setFormData(prevFormData => {
            // Creating a deep copy of the exercises array
            const updatedExercises = prevFormData.exercises.map(ex => ({ ...ex }));
            updatedExercises.splice(index, 1); 
            
            return {
                ...prevFormData,
                exercises: updatedExercises
            };
        });
    }

    function rmSet(exerciseIndex, setIndex) {
        setFormData(prevFormData => {
            console.log(exerciseIndex, setIndex)
            const updatedExercises = [...prevFormData.exercises]
            const updatedSets = [...updatedExercises[exerciseIndex].sets]
            updatedSets.splice(setIndex, 1)
            
            updatedExercises[exerciseIndex] = {
                ...updatedExercises[exerciseIndex],
                sets: updatedSets
            }
            
            return {
                ...prevFormData,
                exercises: updatedExercises
            }
        })    
    }
    
    function handleDateChange(event) {
        setTouched({...touched, [`date`]: true})

        let errors = {...validationErrors}
        if (event.target.value === "") {
            errors['date'] = "Date must be included"
        } else {
            delete errors['date']
        }
        setValidationErrors(errors)

        let dateValue = event.target.value;
        let year = dateValue.split('-')[0];
    
        if (year.length > 4) {
            year = year.substring(0, 4);
            dateValue = year + '-' + dateValue.split('-').slice(1).join('-');
        }
    
    
        setFormData(prevFormData => ({
            ...prevFormData,
            date: dateValue
        }));
    }
    
    function handleExerciseNameChange(index) {
        return (event) => {
            setTouched({ ...touched, [`name_${index}`]: true });
            
            const newName = event.target.value
            let errors = {...validationErrors}

            if (newName === "") {
                errors[`name_${index}`] = "Exercise name must not be empty"
            } else {
                delete errors[`name_${index}`]

                const nameExists = formData.exercises.some((exercise, i) => i !== index && exercise.name === newName);
                if (nameExists) {
                    errors[`name_${index}`] = `"${newName}" is already taken`
                }
            }
            setValidationErrors(errors)

            if (exerciseNameRegex.test(newName)) {
                const newExercises = formData.exercises.map((exercise, i) => {
                    if (i === index) {
                        return { ...exercise, name: newName };
                    }
                    return exercise;
                });
                setFormData(prevFormData => ({ ...prevFormData, exercises: newExercises }));
            }
        };
    }

    function handleExerciseTypeChange(index) {
        return (event) => {
            const newType = event.target.value;
            setFormData(prevFormData => {
                const updatedExercises = [...prevFormData.exercises];
                let defaultSet = {};

                switch (newType) {
                    case "time-based":
                        defaultSet = { time: "" };
                        break;
                    case "rep-based":
                        defaultSet = { reps: "" };
                        break;
                    case "distance-based":
                        defaultSet = { distance: "", time: "" };
                        break;
                    case "weight-based":
                        defaultSet = { weight: "", reps: "" };
                        break;
                    default:
                        console.error("Unrecognized exercise type");
                        break;
                }

                updatedExercises[index] = {
                    ...updatedExercises[index],
                    type: newType,
                    sets: [defaultSet]
                };

                return { ...prevFormData, exercises: updatedExercises };
            });
        };
    }
    
    function handleSetInfoChange(exerciseIndex, setIndex) {
        return (event) => {
            if (digitRegex.test(event.target.value) || event.target.value === "") {
                setTouched({...touched, [`set_${exerciseIndex}_${setIndex}`]: true})
                setFormData(prevFormData => {
                    
                    const newExercises = [...prevFormData.exercises];
                    const setToUpdate = { ...newExercises[exerciseIndex].sets[setIndex] };
                    
                    
                    setToUpdate[event.target.id] = event.target.value === "" ? "" : Number(event.target.value);
                    
                    let errors = {...validationErrors}
                    if (newExercises[exerciseIndex].type === "weight-based" && setToUpdate.reps === "") {
                        errors[`set_${exerciseIndex}_${setIndex}`] = "Reps must not be empty"
                    } else {
                        delete errors[`set_${exerciseIndex}_${setIndex}`]
                    }
                    newExercises[exerciseIndex].sets[setIndex] = setToUpdate;
                    setValidationErrors(errors)
                    
    
                    return { ...prevFormData, exercises: newExercises };
                });
            }
        };
    }
    
    
    function handleSubmit(event) {
        console.log(formData)
        event.preventDefault();

        // Check for validation errors
        let errors = {};
        let nameSet = new Set(); // To track unique names

        if (!formData.date) {
            errors["date"] = "Date must be included"
        }

        if (formData.exercises.length === 0) {
            errors["empty"] = "There must be at least one exercise."
        }

        formData.exercises.forEach((exercise, index) => {
            console.log(exercise.name)
            if (exercise.name === "") {
                errors[`name_${index}`] = "Name must not be empty";
            } else if (nameSet.has(exercise.name)) {
                errors[`name_${index}`] = `${exercise.name} is already taken`;
            } else {
                nameSet.add(exercise.name);
            }

            exercise.sets.forEach((set, setIndex) => {
                if (set.reps === "0" || set.reps === "") {
                    errors[`set_${index}_${setIndex}`] = "Reps can't be 0";
                }
            });
        });

        // Check if there are any errors
        if (Object.keys(errors).length === 0) {
            
            const newWorkout = { 
                id: Date.now().toString(),  
                exercises: formData.exercises
            };

            props.addWorkout(formData.date, newWorkout);
            setFormData({ date: "", exercises: [] }); // Reset form
            setValidationErrors({}); // Clear validation errors
        } else {
            console.log(errors)
            setValidationErrors(errors);
        }
    }

    function clearForm() {
        setFormData({
            date : "",  
            exercises : []
        })
    }

    const formDataExerciseElements = formData.exercises.map((exercise, index) => (
        <div key={index} className="exercise">
            <div className="exercise-input-row1">
                <input
                    className="exercise-name"
                    type="text"
                    placeholder="Exercise Name"
                    value={exercise.name}
                    onChange={handleExerciseNameChange(index)}
                />
                <button type="button" onClick={() => rmExercise(index)} className="remove-exercise-button">
                    <FontAwesomeIcon className="minus-icon" icon={faMinus} />
                </button>
            </div>
            <div className="exercise-type-dropdown-container">
                <label className="exercise-types-label" htmlFor="exercise-types">Choose Exercise Type:</label>
                <select 
                    className="exercise-types" 
                    id="exercise-types"
                    value={exercise.type}
                    onChange={handleExerciseTypeChange(index)}
                >
                    <option value="time-based">Time-Based</option>
                    <option value="rep-based">Rep-Based</option>
                    <option value="distance-based">Distance-Bassed</option>
                    <option value="weight-based">Weight-Based</option>
                </select>

            </div>
            {
                validationErrors[`name_${index}`] 
                && 
                <div className="validation-error">
                    <FontAwesomeIcon className="x-icon" icon={faCircleXmark} />
                    {validationErrors[`name_${index}`]}
                </div>
            }

            <div className="sets-elements">
                {
                    exercise.sets.map((set, setIndex) => {
                        let thingToRender;
                        switch(exercise.type) {
                            case "time-based":
                                thingToRender = (
                                    <div className="set">
                                        <div className="set--time">
                                            <label htmlFor="time" className="time-label">
                                                Time
                                            </label>
                                            <input
                                                className="time-input"
                                                id="time" 
                                                type="text"
                                                placeholder="0"
                                                value={set.time}
                                                onChange={handleSetInfoChange(index, setIndex)}
                                            />
                                        </div>
                                    </div>
                                )
                                break;

                            case "rep-based":
                                thingToRender = (
                                    <div className="set">
                                        <div className="set--reps">
                                            <label htmlFor="reps" className="reps-label">
                                                Reps
                                            </label>
                                            <input
                                                className="reps-input"
                                                id="reps" 
                                                type="text"
                                                placeholder="0"
                                                value={set.reps}
                                                onChange={handleSetInfoChange(index, setIndex)}
                                            />
                                        </div>

                                    </div>
                                )
                                break;

                            case "distance-based":
                                thingToRender = (
                                    <div className="set">
        
                                        <div className="set--distance">
                                            <label htmlFor="distance" className="distance-label">
                                                Distance
                                            </label>
                                            <input
                                                className="distance-input"
                                                id="distance" 
                                                type="text"
                                                placeholder="0"
                                                value={set.distance}
                                                onChange={handleSetInfoChange(index, setIndex)}
                                            />
                                        </div>
                                        <div className="set--time">
                                            <label htmlFor="time" className="time-label">
                                                Time
                                            </label>
                                            <input
                                                className="time-time"
                                                id="time" 
                                                type="text"
                                                placeholder="0"
                                                value={set.time}
                                                onChange={handleSetInfoChange(index, setIndex)}
                                            />
                                        </div>
                                    </div>
                                )
                                break;

                            case "weight-based":
                                thingToRender = (
                                    <div className="set">
                                        <div className="set--weight">
                                            <label htmlFor="weight" className="weight-label">
                                                Weight
                                            </label>
                                            <input
                                                id="weight"
                                                className="weight-input"
                                                type="text"
                                                placeholder="0"
                                                value={set.weight}
                                                onChange={handleSetInfoChange(index, setIndex)}
                                            />
        
                                        </div>
                                        <div className="set--reps">
                                            <label htmlFor="reps" className="reps-label">
                                                Reps
                                            </label>
                                            <input
                                                className="reps-input"
                                                id="reps" 
                                                type="text"
                                                placeholder="0"
                                                value={set.reps}
                                                onChange={handleSetInfoChange(index, setIndex)}
                                            />
                                        </div>
                                    </div>
                                )
                                break;
                        }

                        return (
                            <div>
                                <div className="set">
                                    {thingToRender}
                                    {
                                        setIndex === exercise.sets.length - 1 
                                        ? 
                                        <button type="button" onClick={() => addSet(index)} className="add-set-button" >
                                            <FontAwesomeIcon className="plus-icon" icon={faPlus} />
                                        </button>
                                        : 
                                        <button type="button" onClick={() => rmSet(index, setIndex)} className="remove-set-button">
                                            <FontAwesomeIcon className="minus-icon" icon={faMinus} />
                                        </button>
                                    }
                                </div>
                                {
                                    validationErrors[`set_${index}_${setIndex}`] 
                                    && 
                                    <div className="validation-error">
                                        <FontAwesomeIcon className="x-icon" icon={faCircleXmark} />
                                        {validationErrors[`set_${index}_${setIndex}`]}
                                    </div>
                                }
                            </div>
                        )
                    }) 
                }
            </div>
        </div>
    ))

    return (
        <div className="parent">   
            <form className="addworkout--form" onSubmit={handleSubmit}>
                <h1> Add Workout</h1>
                <label className="date-input-label" htmlFor="date-input">
                    Date:
                </label>
                <input
                    className="date-input"
                    id="date-input"
                    type="date"
                    value={formData.date}
                    onChange={handleDateChange}
                >
                </input>
                {
                    validationErrors["date"] 
                    && 
                    <div className="validation-error">
                        <FontAwesomeIcon className="x-icon" icon={faCircleXmark} />
                        {validationErrors["date"]}
                    </div>
                }

                <button className="add-exercise-button" type="button" onClick={addExercise}>
                    Add Exercise
                </button>
                {formDataExerciseElements}
                {
                    validationErrors["empty"] 
                    && 
                    <div className="validation-error">
                        <FontAwesomeIcon className="x-icon" icon={faCircleXmark} />
                        {validationErrors["empty"]}
                    </div>
                }
                <button type="button" onClick={clearForm} className="submit--button">
                    Clear Form
                </button>
                <button className="submit--button">
                    Submit
                </button>
            </form>
        </div>
    )
}


