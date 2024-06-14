import React, { useEffect, useState } from "react"
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
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
const { jwtDecode } = require('jwt-decode');




function App() {
  
  console.log('first');
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  function handleLogout() {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setWorkouts([])
    setGoals([])
  }
  
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
        setGoals(fetchedGoals.goals)

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
      }
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

  async function removeGoal(goalId) { // need to write backend route
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:8080/api/goals/${goalId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  
      }
    })

    if (response.ok) {
      fetchGoals()
    } else {
      alert('failed to delete workouts')
    }
  }

  async function clearGoals() { // need to write backend route
    const token = localStorage.getItem('token')
    console.log('here');

    const response = await fetch(`http://localhost:8080/api/goals`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      fetchGoals()
    } else {
      alert('failed to delete workouts')
    }
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
            <Login
              isAuthenticated={isAuthenticated}
            />
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
              <Navbar
 handleLogout={handleLogout}
/>
              <HomePage
                workouts={workouts}
              />
            </>
          }
        />
        <Route 
          path="/add-workout" 
          element={
            <>
              <Navbar
 handleLogout={handleLogout}
/>
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
              <Navbar
 handleLogout={handleLogout}
/>
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
              <Navbar
 handleLogout={handleLogout}
/>
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
              <Navbar
 handleLogout={handleLogout}
/>
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
              <Navbar
 handleLogout={handleLogout}
/>
              <ProgressStats/>
            </>
          }
          
        />
        <Route 
          path="/progress-visualize" 
          element={
            <>
              <Navbar
 handleLogout={handleLogout}
/>
              <ProgressVisualize/>
            </>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
