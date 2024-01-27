import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('submitted!');
    }

    const goToRegister = () => {
        console.log('went to register');
    }

    return (
        <div className='form'>
            <h1 className='title'>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className='field'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                />
                <br />
                <input
                    className='field'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />
                <br />
                <input className='button' type="submit" value="Login" />
                <hr></hr>
                <h3 className='small-title'> Don't have an account yet?</h3>
                <p className='register-link' onClick={goToRegister}>Register Here</p>
            </form>
        </div>
    );
}

export default App;
