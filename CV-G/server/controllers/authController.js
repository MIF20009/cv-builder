const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
require('dotenv').config();

const signup = async (req , res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password){
        return res.status(400).json({error: 'All fields are required.'})
    }
    const existingUser = User.findOne({where: {email}})
    if(existingUser){
        return res.status(400).json({ error: 'Email already registered.' });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    try{
        await User.create({
            name: name,
            email: email,
            password: hashedPass,
        })
        res.status(201).json({ message: 'User registered successfully.' });
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to register user.' });
    }
};

const login = async(req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(400).json({error: 'Invalid email or password.'});
        }
        const validPassword = bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({error: 'Invalid email or password.'});
        }
        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1h'} );

        res.status(200).json({
        message: 'Login successful.',
        token, 
        user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error("[login] unexpected error:", err);
        return res
        .status(500)
        .json({ error: "Failed to log in.", details: err.message });
    }
};

module.exports = {signup, login};