import React from "react"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'


export default function EmptyNavbar ({ handleLogout }) {
    function logout() {
        navigate('/login')
    }

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <h1>
                Fitness Tracker 
            </h1>
            <button onClick={logout} className="navbar--button-login">
                Login
            </button>
        </nav>
    )
}