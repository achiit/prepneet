const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function to read questions from a JSON file
const readQuestionsFromFile = (fileName) => {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

// Function to select random questions
const selectRandomQuestions = (questions, count) => {
  const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
  return shuffledQuestions.slice(0, count);
};

// Function to add serial number to questions
const addSerialNumbers = (questions) => {
  return questions.map((question, index) => ({
    ...question,
    id: index + 1
  }));
};

// Create final paper with questions from all subjects
exports.createFinalPaper = (req, res) => {
  try {
    // Read questions from all subjects
    const biologyQuestions = readQuestionsFromFile('biology.json');
    const physicsQuestions = readQuestionsFromFile('physics.json');
    const chemistryQuestions = readQuestionsFromFile('chemistry.json');

    // Filter MCQ questions from each subject
    const biologyMCQQuestions = biologyQuestions.filter((question) => question.quiz_type === 'mcq');
    const physicsMCQQuestions = physicsQuestions.filter((question) => question.quiz_type === 'mcq');
    const chemistryMCQQuestions = chemistryQuestions.filter((question) => question.quiz_type === 'mcq');

    // Select random MCQ questions from each subject
    const randomBiologyQuestions = selectRandomQuestions(biologyMCQQuestions, 90);
    const randomPhysicsQuestions = selectRandomQuestions(physicsMCQQuestions, 45);
    const randomChemistryQuestions = selectRandomQuestions(chemistryMCQQuestions, 45);

    // Add serial numbers to questions
    const biologyQuestionsWithId = addSerialNumbers(randomBiologyQuestions);
    const physicsQuestionsWithId = addSerialNumbers(randomPhysicsQuestions);
    const chemistryQuestionsWithId = addSerialNumbers(randomChemistryQuestions);

    // Combine questions from all subjects
    const finalPaper = [
      ...biologyQuestionsWithId,
      ...physicsQuestionsWithId,
      ...chemistryQuestionsWithId
    ];

    // Write final paper to finalpaper.json file
    const finalPaperFilePath = path.join(__dirname, '..', 'data', 'finalpaper.json');
    fs.writeFileSync(finalPaperFilePath, JSON.stringify(finalPaper, null, 2));

    res.json({ message: 'Final paper created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Fetch final paper
exports.fetchFinalPaper = (req, res) => {
  try {
    // Read final paper from file
    const finalPaperFilePath = path.join(__dirname, '..', 'data', 'finalpaper.json');
    const rawData = fs.readFileSync(finalPaperFilePath);
    const finalPaper = JSON.parse(rawData);
    res.json(finalPaper);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, phoneNumber, batch, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      username,
      email,
      phoneNumber,
      batch,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Login user and generate JWT token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: '1h' }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
