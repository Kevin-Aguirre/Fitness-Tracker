require('dotenv').config({ path: '../.env'})
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json()) 

mongoose.connect(process.env.URI)
    .then(() => console.log('connected'))
    .catch((e) => console.log(e))

function authenticateToken(req, res, next) {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (token == null) {
        return res.sendStatus(401); // If no token, unauthorized
    }
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => { 
        if (err) {
        return res.sendStatus(403); // If token is not valid, forbidden
        }
    
        req.userId = user.id; // Assuming the JWT contains the user ID in its payload
        next(); // Proceed to the next middleware or route handler
    });
}

app.use('/api/workouts', authenticateToken)
app.use('/api/goals', authenticateToken)

app.post('/api/register', async (req, res) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
            goals: [],
            workouts: {}
        })

        res.json({ status: 'ok' })
    } catch (err) {
        console.log(err);
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})

app.post('/api/login', async (req, res) => {
    console.log(req.body); 

    const user = await User.findOne({
        email: req.body.email, 
    })

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid login' })
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if (isPasswordValid) {
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.TOKEN_SECRET
        );
    
        return res.json({ status: 'ok', user: token }); // Sending the token to the frontend
    } else {

        return res.json({ status: 'error', user: false })
    }

})

// workouts ------------------------------------------------------------------------------------------------

app.get('/api/workouts', async (req, res) => { // done

    try {
        const user = await User.findById(req.userId); // Use userId set by authenticateToken
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        res.json({ status: 'ok', workouts: user.workouts});
    } catch (error) {

        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }

})

app.post('/api/workouts', async (req, res) => { // done
    const userId = req.userId
    const {date, exercises} = req.body


    try { 
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User Not Found'})
        }
        
        if (!user.workouts.has(date)) {
            user.workouts.set(date, { workouts: [] });
        }


        user.workouts.get(date).workouts.push({exercises})

        
        await user.save()
        res.json({status: 'ok'})
    } catch (err) {
        res.json({status: "error", error: 'Could not Create Workout'})
    }
    
})

app.delete('/api/workouts', async (req, res) => { // done
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found'})    
        }
        
        user.workouts = []
        await user.save()
        res.json({status: 'ok'})

    } catch (e) {
        res.json({status: "error", error: 'Could not delete workouts    '})
    }
})

app.delete('/api/workouts/:date', async (req, res) => { // done
    try {
        const { date } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found'})    
        }
        
        user.workouts.delete(date) 
        await user.save()
        res.json({status: 'ok'})

    } catch (e) {
        res.json({status: "error", error: 'Could not delete workouts    '})
    }
})

app.delete('/api/workouts/:date/:workoutId', async (req, res) => {
    try {
        const { date, workoutId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        let workoutDateEntry = user.workouts.get(date);
        let oldWorkoutDateArr = workoutDateEntry.workouts;
        console.log(oldWorkoutDateArr);
        let newWorkoutDateArr = oldWorkoutDateArr.filter(workout => workout._id.toString() !== workoutId.toString());
        console.log(newWorkoutDateArr);

        
        if (newWorkoutDateArr.length === 0) {
            user.workouts.delete(date);
        } else {
            user.workouts.get(date).workouts = JSON.parse(JSON.stringify(newWorkoutDateArr))

        }

        await user.save();
        res.json({ status: 'success', message: 'Workout deleted successfully' });
    } catch (e) {
        console.log('something went wrong', e);
        res.status(500).json({ status: 'error', error: 'Something went wrong' });
    }
});






app.put('/api/workouts/:workoutId', async (req, res) => { // not done
    console.log("put - api/workouts/:workoutId", req.body);
})



// goals ------------------------------------------------------------------------------------------------

app.get('/api/goals', async (req, res) => {
    
    try {
        const user = await User.findById(req.userId); // Use userId set by authenticateToken
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }
        
        res.json({ status: 'ok', goals: user.goals});
    } catch (error) {
        
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
    
})

app.post('/api/goals', async (req, res) => {
    const userId = req.userId
    
    try { 
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User Not Found'})
        }
        console.log(req.body);
        user.goals.push(req.body)
        await user.save()
        res.json({status: 'ok'}) 
    } catch (err) {
        res.json({status: "error", error: 'Could not Create Workout'})
    }
})

app.listen(8080, () => {
    console.log('server started on 8080');
})