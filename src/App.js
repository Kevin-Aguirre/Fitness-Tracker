import React, { useEffect } from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Navbar from "./components/Navbar.js";
import HomePage from "./components/pages/HomePage.js"
import AddWorkout from "./components/pages/AddWorkout.js"
import ViewWorkouts from "./components/pages/ViewWorkouts.js"
import SetGoal from "./components/pages/SetGoal.js"
import ManageGoalsPage from "./components/pages/ManageGoals.js";  
import ProgressStats from "./components/pages/ProgressStats.js"
import ProgressVisualize from "./components/pages/ProgressVisualize.js"

import "./index.css"


function App() {
  const [workouts, setWorkouts] = React.useState(() => (
    JSON.parse(localStorage.getItem('workouts')) || {}
  ))

  const [goals, setGoals] = React.useState(() => (
    JSON.parse(localStorage.getItem('goals')) || []
  ))

  useEffect(() => {
      localStorage.setItem('workouts', JSON.stringify(workouts))
      // console.log("use effect workouts", workouts)
  }, [workouts])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
    // console.log("goals: ", goals)
  }, [goals])


  // workout functions
  
  function addWorkout(date, workoutSession) {
    console.log(workoutSession)
    setWorkouts(prevWorkouts => {
        const updatedWorkouts = { ...prevWorkouts };
        if (!updatedWorkouts[date]) {
            updatedWorkouts[date] = [];
        }
        updatedWorkouts[date].push(workoutSession);
        return updatedWorkouts;
    });
  }

  function removeWorkout(date, workoutIndex) {
    setWorkouts(prevWorkouts => {
        const updatedWorkouts = { ...prevWorkouts };

        const updatedWorkoutsAtDate = [...updatedWorkouts[date]];

        updatedWorkoutsAtDate.splice(workoutIndex, 1);

        if (updatedWorkoutsAtDate.length === 0) {
            delete updatedWorkouts[date];
        } else {
            updatedWorkouts[date] = updatedWorkoutsAtDate;
        }

        return updatedWorkouts;
    });
  }

  function removeDateWorkouts(date) {
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = {...prevWorkouts}
      delete updatedWorkouts[date]
      return updatedWorkouts
    })
  }



  function clearWorkouts() {
    setWorkouts({})
  }

  // goal functions
  function addGoal(goalData) {
    setGoals(prevGoals => ([
      ...prevGoals, goalData
    ]))
  }

  function removeGoal(goalIndex) {
    setGoals(prevGoals => {
      const updatedGoals = [...prevGoals]
      updatedGoals.splice(goalIndex, 1);
      return updatedGoals
    })
  }

  function clearGoals() {
    setGoals([])
  }

  return (
    <Router>
      <Navbar/>
      <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                workouts={workouts}
              />
            }
          />
          <Route 
            path="/add-workout" 
            element={
              <AddWorkout 
                clearWorkouts={clearWorkouts}
                addWorkout={addWorkout}
              />
            }          
          />
          <Route 
            path="/view-workouts" 
            element={
              <ViewWorkouts
                workouts={workouts}
                removeWorkout={removeWorkout}
                clearWorkouts={clearWorkouts}
                removeDateWorkouts={removeDateWorkouts}
              />
            }
          />
          <Route 
            path="/set-goal" 
            element={
              <SetGoal
                goals={goals}
                addGoal={addGoal}
                removeGoal={removeGoal}
                clearGoals={clearGoals}
              />
            }
          />
          <Route 
            path="/manage-goals" 
            element={
              <ManageGoalsPage
                clearGoals={clearGoals}
                removeGoal={removeGoal}
                goals={goals}
                workouts={workouts}
              />
            }
          />
          <Route path="/progress-stats" element={<ProgressStats/>}/>
          <Route path="/progress-visualize" element={<ProgressVisualize/>}/>

      </Routes>
    </Router>
  );
}

export default App;
