import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

function Register () {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    function handleSubmit(event) {
        event.preventDefault();
        console.log('submitted')
    }

    function goToLogin() {
        console.log('went to login');
    }
    return (
        <div>
            <h1 className='title'>Register</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    className='field'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text" 
                    placeholder="Name" 
                />
                <br/>
                <input 
                    className='field'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder='Email'
                />
                <br/>
                <input 
                    className='field'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    placeholder="Password" 
                />
                <br/>
                <input className='button' type="submit" value="Register"/>
                <hr></hr>
                <h3 className='small-title'>Already have an account?</h3>
                <p className='register-link' onClick={goToLogin}>Login Here</p>

            </form>
        </div>
    )
}

export default Register