import GoogleUser from '../models/GoogleUser.js';
import LocalUser from '../models/LocalUser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const verifyLogin = async (req, res) => {
    try {
        const { uid, email, name, picture, firebase } = req.user;
        const provider = firebase.sign_in_provider;

        console.log("Processing Login/Signup:");
        console.log(`User: ${email}, Provider: ${provider}, UID: ${uid}`);

        let User;
        let collectionName;

        // Determine Collection based on Provider
        if (provider === 'google.com' || provider === 'google') {
            // Check if email already exists in LocalUser
            const existingLocal = await LocalUser.findOne({ email });
            if (existingLocal) {
                return res.status(400).json({
                    error: 'Email already registered',
                    details: 'This email is already registered with a password. Please login with email/password.'
                });
            }

            User = GoogleUser;
            collectionName = 'google';
        } else {
            // Default to LocalUser for 'password' or any other provider
            User = LocalUser;
            collectionName = 'locals';
        }

        // Check if user exists
        let user = await User.findOne({ uid });

        if (user) {
            console.log(`User found in ${collectionName}, updating lastLogin.`);
            user.lastLogin = Date.now();
            await user.save();
        } else {
            console.log(`Creating new user in ${collectionName}.`);

            // Prepare User Data
            const userData = {
                uid,
                email,
                displayName: name || '',
                firstName: name ? name.split(' ')[0] : '',
                lastName: name ? name.split(' ').slice(1).join(' ') : '',
                lastLogin: Date.now()
            };

            // Add picture if Google (LocalUser schema might not have it, but we can add it safely if schema allows or just ignore)
            if (collectionName === 'google') {
                userData.picture = picture;
            }

            user = await User.create(userData);
        }

        res.status(200).json({
            message: 'Authentication successful',
            displayName: user.displayName,
            collection: collectionName
        });

    } catch (error) {
        console.error('Error in verifyLogin:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Native Signup (Direct User Creation)
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // 1. Check if user already exists in MAIN DB (LocalUser)
        let mainUser = await LocalUser.findOne({ email });
        if (mainUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Check if user already exists in GoogleUser
        const googleUser = await GoogleUser.findOne({ email });
        if (googleUser) {
            return res.status(400).json({
                error: 'Account exists',
                details: 'This email is registered with Google. Please sign in with Google.'
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new user in LocalUser
        const newUser = await LocalUser.create({
            uid: 'local_' + Date.now(),
            email,
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`.trim(),
            password: hashedPassword,
            isVerified: true // Direct signup implies verification in this simplified flow if originally so
        });

        // 5. Generate Token
        const token = jwt.sign({ id: newUser._id, type: 'local' }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                email: newUser.email,
                displayName: newUser.displayName,
                collection: 'locals'
            },
            token
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Native Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user in LocalUser
        const user = await LocalUser.findOne({ email });
        if (!user) {
            // Check if user is in GoogleUser to give a better error message
            const googleUser = await GoogleUser.findOne({ email });
            if (googleUser) {
                return res.status(400).json({
                    error: 'Invalid login method',
                    details: 'This email is associated with a Google account. Please login with Google.'
                });
            }
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.isVerified === false) {
            return res.status(400).json({ error: 'Email not verified', details: 'Please verify your email address.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate Token
        const token = jwt.sign({ id: user._id, type: 'local' }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                collection: 'locals'
            },
            token
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const protectedRoute = (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
};
