import React from "react"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'


export default function Navbar ({ handleLogout }) {
    function logout() {
        handleLogout()
        navigate('/login')
    }

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <h1>
                Fitness Tracker 
            </h1>
            <div className="navbar--links">
                <Link to="/home">Home</Link>
                <Link to="/add-workout">Add Workout</Link>
                <Link to="/view-workouts">View Workouts</Link>
                <Link to="/set-goal">Set Goal</Link>
                <Link to="/manage-goals">Manage Goals</Link>
                <button onClick={logout}>
                    Logout
                </button>
                {/* <Link to="/progress-stats">Stats</Link>
                <Link to="/progress-visualize">Graphs</Link> */}

            </div>
        </nav>
    )
}