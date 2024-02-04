import React, { useEffect, useState } from "react"
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
  const [workouts, setWorkouts] = useState([])
  const [goals, setGoals] = useState([])

  useEffect(() => {
    async function fetchWorkouts() {
        const token = localStorage.getItem('token'); // Retrieve the stored token
        const response = await fetch('http://localhost:8080/api/workouts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Including the token in the header
            }
        });

        if (response.ok) {
            const fetchedWorkouts = await response.json(); // this wo rks
            console.log('fetchedWorkouts: ', fetchedWorkouts);
            setWorkouts(fetchedWorkouts)

        } else {
            alert('something went wrong')
        }
    }

    async function fetchGoals() {
      const token = localStorage.getItem('token'); // Retrieve the stored token
      const response = await fetch('http://localhost:8080/api/goals', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Including the token in the header
          }
      });

      if (response.ok) {
          const fetchedGoals = await response.json(); // this wo rks
          setGoals(fetchedGoals)

      } else {
          alert('something went wrong')
      }
    }
  
    fetchWorkouts();
    fetchGoals();
  }, []);




  // workout functions
  

  // change this to post
  async function addWorkout(date, workoutSession) {
    console.log(workoutSession)

    const token = localStorage.getItem('token');
    const newWorkout = {
      date: date,
      exercises: workoutSession.exercises
    }


    const response = await fetch('http://localhost:8080/api/workouts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Including the token in the header
      },
      body: JSON.stringify(newWorkout)
    });

  }

  // goal functions
  async function addGoal(goalData) {
    const token = localStorage.getItem('token') 

    const response = await fetch('http://localhost:8080/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(goalData)
    })
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
