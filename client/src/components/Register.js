import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

function Register () {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/api/register', {
            method: "POST",
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              password
            })
        })
      
        const data = await response.json()
        console.log(data);

        if (data.status === 'ok') {
            alert("Account successfully created.")
            navigate('/login')
        } else {
            if (data.error === "Duplicate email") {
                alert("This email is already in use: " + email)
            }
        }
    
    }

    function goToLogin() {
        navigate('/login')
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