import React, { useEffect, useState } from "react"
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import { jwtDecode } from "jwt-decode"

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
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        // Token is valid
        setIsAuthenticated(true);
      }
    } catch (e) {
      // Invalid token
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }

  async function fetchData() {
    if (isAuthenticated) {
      fetchWorkouts()
      fetchGoals()
    }
  }

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
          const fetchedWorkouts = await response.json()
          setWorkouts(fetchedWorkouts.workouts)
          
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

  useEffect(() => {
    checkToken();
    fetchData();
  }, [isAuthenticated]);


  // workout functions
  

  // change this to post
  async function addWorkout(date, workoutSession) {
    const token = localStorage.getItem('token');

    // console.log(workoutSession);

    const data = {
      date: date,
      exercises: workoutSession.exercises
    }

    console.log(data);

    const response = await fetch('http://localhost:8080/api/workouts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Including the token in the header
      },
      body: JSON.stringify(data)
    });


    if (response.ok) {
      fetchWorkouts();
    } else {
      alert('Failed to add workout');
    }
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

    if (response.ok) {
      fetchGoals();
    } else {
      alert('Failed to add goal');
    }
  }

  async function clearWorkouts() {
    const token = localStorage.getItem('token')
    
    const response = await fetch('http://localhost:8080/api/workouts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      
    })
    
    if (response.ok) {
      fetchWorkouts()
    } else {
      alert('failed to delete workouts')
    }
  }


  async function removeWorkout(date, workoutId) {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`http://localhost:8080/api/workouts/${date}/${workoutId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      
    })
    
    if (response.ok) {
      fetchWorkouts()
    } else {
      alert('failed to delete workouts')
    }

  }

  async function removeDateWorkouts(date) {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:8080/api/workouts/${date}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      fetchWorkouts()
    } else {
      alert('failed to delete workouts ')
    }
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
