import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import redisClient from '../storage/redis'

const register = async (req, res) => {
    const {email, passowrd, username} = req.body

    try {
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            passowrd: hashedPassword,
            username
        })

        const savedUser = await newUser.save()

        //store user
        redisClient.setex(`user:${savedUser._id}`, 3600, JSON.stringify(savedUser))

        res.status(201).json({
            message: 'User registered successfully'
            user: savedUser
        })

    } catch (error) {
        res.status(500).json({ message: 'Fileds not valid', error})
    }
}

// const login = async (req, res) => {
//     try {
//         // Get email and password from the request body
//         const { email, passowrd } = req.body

//         // Check the user using the provided email
//         const user = await User.findOne({ email })

//         if (!user) {
//             return res.status(404).json({message: 'user not found'})
//         }

//         const isPasswordValid = await bcrypt.compare(passowrd, user.password)

//         if(!isPasswordValid) {
//             //if password is correct, send an error message
//             return res.status(400).json({ message: 'Invalid password'})
//         }

//         // creating JWT token
//         const token = jwt.sign(
//             { id: user._id, email: user.email }
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         )

//         // store token in redis
//         redisClient.setex(`token:${user._id}`, 3600, token)

//         // success message
//         res.status(200).json({
//             message: 'Login succesful',
//             token,
//         })
//     } catch (error) {
//         //if there is an error catch it and send a response
//         res.status(500).json({ message: 'server error', error})
//     }
// }
