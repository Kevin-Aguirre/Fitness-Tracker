import React, { useEffect } from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Navigate } from "react-router-dom";

import Login from "./components/Login.js"
import Register from "./components/Register.js";
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
  

  // change this to post
  async function addWorkout(date, workoutSession) {
    console.log(workoutSession)

    const token = localStorage.getItem('token');
    const newWorkout = {
      date: date,
      exercises: workoutSession.exercises
    }

    console.log(newWorkout)

    const response = await fetch('http://localhost:8080/api/workouts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Including the token in the header
      },
      body: JSON.stringify(newWorkout)
    });

    console.log(response);
  }

    // if (response.ok) {
    //     // const addedNote = await response.json();
    //     // setNotes(prevNotes => [...prevNotes, addedNote.note]); // Ensure this matches the backend response
    // }

    // ENDED OFF HERE 
    // console.log(workoutSession)
    // setWorkouts(prevWorkouts => {
    //     const updatedWorkouts = { ...prevWorkouts };
    //     if (!updatedWorkouts[date]) {
    //         updatedWorkouts[date] = [];
    //     }
    //     updatedWorkouts[date].push(workoutSession);
    //     return updatedWorkouts;
    // });

/*
    async function addNote() {
        const token = localStorage.getItem('token'); // Retrieve the stored token


        console.log(new Date().toLocaleString(undefined, options));

        const newNote = {
            title: "Title",
            content: "Content",
            date: new Date().toLocaleString(undefined, options) // Use ISO string for consistency
        };
        

          
        const response = await fetch('http://localhost:8080/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Including the token in the header
            },
            body: JSON.stringify(newNote)
        });

        if (response.ok) {
            const addedNote = await response.json();
            setNotes(prevNotes => [...prevNotes, addedNote.note]); // Ensure this matches the backend response
        }
    }
*/


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
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace/>} 
        />
        <Route
          path="/login"
          element={
            <Login/>
          }
        />
        <Route
          path="/register"
          element={
            <Register/>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Navbar/>
              <HomePage/>
            </>
          }
        />
        <Route 
          path="/add-workout" 
          element={
            <>
              <Navbar/>
              <AddWorkout 
                clearWorkouts={clearWorkouts}
                addWorkout={addWorkout}
              />
            </>
          }          
        />
        <Route 
          path="/view-workouts" 
          element={
            <>
              <Navbar/>
              <ViewWorkouts
                workouts={workouts}
                removeWorkout={removeWorkout}
                clearWorkouts={clearWorkouts}
                removeDateWorkouts={removeDateWorkouts}
              />
            </>
          }
        />
        <Route 
          path="/set-goal" 
          element={
            <>
              <Navbar/>
              <SetGoal
                goals={goals}
                addGoal={addGoal}
                removeGoal={removeGoal}
                clearGoals={clearGoals}
              />
            </>
          }
        />
        <Route 
          path="/manage-goals" 
          element={
            <>
              <Navbar/>
              <ManageGoalsPage
                clearGoals={clearGoals}
                removeGoal={removeGoal}
                goals={goals}
                workouts={workouts}
              />
            </>
          }
        />
        <Route 
          path="/progress-stats" 
          element={
            <>
              <Navbar/>
              <ProgressStats/>
            </>
          }
          
        />
        <Route 
          path="/progress-visualize" 
          element={
            <>
              <Navbar/>
              <ProgressVisualize/>
            </>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
