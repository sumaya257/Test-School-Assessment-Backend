import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { QuestionModel } from '../src/models/question';

dotenv.config();

const sampleQuestions = [
  {
    "competencyCode": "COMP01",
    "competencyName": "HTML Basics",
    "level": "A1",
    "stem": "What is the purpose of the <!DOCTYPE html> declaration?",
    "options": [
      { "id": 1, "text": "It defines the document type and version of HTML", "isCorrect": true },
      { "id": 2, "text": "It inserts a comment in HTML", "isCorrect": false },
      { "id": 3, "text": "It links external CSS files", "isCorrect": false },
      { "id": 4, "text": "It creates a new HTML element", "isCorrect": false }
    ],
    "explanation": "The <!DOCTYPE html> declaration defines the document type and HTML version."
  },
  {
    "competencyCode": "COMP02",
    "competencyName": "HTML Advanced",
    "level": "A2",
    "stem": "Which HTML tag is used to embed a video in a webpage?",
    "options": [
      { "id": 1, "text": "<video>", "isCorrect": true },
      { "id": 2, "text": "<media>", "isCorrect": false },
      { "id": 3, "text": "<movie>", "isCorrect": false },
      { "id": 4, "text": "<source>", "isCorrect": false }
    ],
    "explanation": "The <video> tag is used to embed video content in HTML."
  },
  {
    "competencyCode": "COMP03",
    "competencyName": "CSS Basics",
    "level": "A1",
    "stem": "How do you apply a CSS style to an element with id 'header'?",
    "options": [
      { "id": 1, "text": "#header { /* styles */ }", "isCorrect": true },
      { "id": 2, "text": ".header { /* styles */ }", "isCorrect": false },
      { "id": 3, "text": "header { /* styles */ }", "isCorrect": false },
      { "id": 4, "text": "*header { /* styles */ }", "isCorrect": false }
    ],
    "explanation": "The '#' selector targets elements by id in CSS."
  },
  {
    "competencyCode": "COMP04",
    "competencyName": "CSS Advanced",
    "level": "A2",
    "stem": "Which CSS property is used to control the space between lines of text?",
    "options": [
      { "id": 1, "text": "line-height", "isCorrect": true },
      { "id": 2, "text": "letter-spacing", "isCorrect": false },
      { "id": 3, "text": "word-spacing", "isCorrect": false },
      { "id": 4, "text": "text-indent", "isCorrect": false }
    ],
    "explanation": "The line-height property controls vertical spacing between lines."
  },
  {
    "competencyCode": "COMP05",
    "competencyName": "JavaScript Basics",
    "level": "A1",
    "stem": "Which keyword is used to declare a variable in JavaScript?",
    "options": [
      { "id": 1, "text": "var", "isCorrect": true },
      { "id": 2, "text": "dim", "isCorrect": false },
      { "id": 3, "text": "letgo", "isCorrect": false },
      { "id": 4, "text": "set", "isCorrect": false }
    ],
    "explanation": "The 'var' keyword declares a variable in JavaScript."
  },
  {
    "competencyCode": "COMP06",
    "competencyName": "JavaScript Advanced",
    "level": "A2",
    "stem": "What does the Array method 'map()' do?",
    "options": [
      { "id": 1, "text": "Creates a new array by transforming each element", "isCorrect": true },
      { "id": 2, "text": "Filters elements from the array", "isCorrect": false },
      { "id": 3, "text": "Reduces array to a single value", "isCorrect": false },
      { "id": 4, "text": "Adds new elements to the array", "isCorrect": false }
    ],
    "explanation": "The map() method transforms each element in an array and returns a new array."
  },
  {
    "competencyCode": "COMP07",
    "competencyName": "React Basics",
    "level": "B1",
    "stem": "What is the purpose of the useState hook in React?",
    "options": [
      { "id": 1, "text": "To manage component state", "isCorrect": true },
      { "id": 2, "text": "To fetch data from APIs", "isCorrect": false },
      { "id": 3, "text": "To style components", "isCorrect": false },
      { "id": 4, "text": "To create routes", "isCorrect": false }
    ],
    "explanation": "useState is used to add and manage state in functional React components."
  },
  {
    "competencyCode": "COMP08",
    "competencyName": "React Advanced",
    "level": "B2",
    "stem": "Which lifecycle hook is replaced by useEffect in React functional components?",
    "options": [
      { "id": 1, "text": "componentDidMount", "isCorrect": true },
      { "id": 2, "text": "render", "isCorrect": false },
      { "id": 3, "text": "shouldComponentUpdate", "isCorrect": false },
      { "id": 4, "text": "getDerivedStateFromProps", "isCorrect": false }
    ],
    "explanation": "useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount in functional components."
  },
  {
    "competencyCode": "COMP09",
    "competencyName": "Node.js Basics",
    "level": "B1",
    "stem": "Which module is used to create a web server in Node.js?",
    "options": [
      { "id": 1, "text": "http", "isCorrect": true },
      { "id": 2, "text": "express", "isCorrect": false },
      { "id": 3, "text": "fs", "isCorrect": false },
      { "id": 4, "text": "path", "isCorrect": false }
    ],
    "explanation": "The 'http' module is used to create servers in Node.js."
  },
  {
    "competencyCode": "COMP10",
    "competencyName": "Node.js Advanced",
    "level": "B2",
    "stem": "What does middleware do in an Express.js application?",
    "options": [
      { "id": 1, "text": "Processes requests between client and server", "isCorrect": true },
      { "id": 2, "text": "Serves static files", "isCorrect": false },
      { "id": 3, "text": "Manages database connections", "isCorrect": false },
      { "id": 4, "text": "Handles CSS styling", "isCorrect": false }
    ],
    "explanation": "Middleware functions handle and process requests in Express.js."
  },
  {
    "competencyCode": "COMP11",
    "competencyName": "Database Basics",
    "level": "A1",
    "stem": "Which language is used to query relational databases?",
    "options": [
      { "id": 1, "text": "SQL", "isCorrect": true },
      { "id": 2, "text": "HTML", "isCorrect": false },
      { "id": 3, "text": "CSS", "isCorrect": false },
      { "id": 4, "text": "JavaScript", "isCorrect": false }
    ],
    "explanation": "SQL is the standard language for querying relational databases."
  },
  {
    "competencyCode": "COMP12",
    "competencyName": "Database Advanced",
    "level": "A2",
    "stem": "What is a primary key in a database table?",
    "options": [
      { "id": 1, "text": "A unique identifier for each record", "isCorrect": true },
      { "id": 2, "text": "A foreign key linking tables", "isCorrect": false },
      { "id": 3, "text": "A type of index", "isCorrect": false },
      { "id": 4, "text": "A backup key", "isCorrect": false }
    ],
    "explanation": "A primary key uniquely identifies each record in a database table."
  },
  {
    "competencyCode": "COMP13",
    "competencyName": "Git Basics",
    "level": "A1",
    "stem": "What command is used to create a new branch in Git?",
    "options": [
      { "id": 1, "text": "git branch <branch-name>", "isCorrect": true },
      { "id": 2, "text": "git new <branch-name>", "isCorrect": false },
      { "id": 3, "text": "git create <branch-name>", "isCorrect": false },
      { "id": 4, "text": "git checkout <branch-name>", "isCorrect": false }
    ],
    "explanation": "The 'git branch' command creates a new branch."
  },
  {
    "competencyCode": "COMP14",
    "competencyName": "Git Advanced",
    "level": "A2",
    "stem": "What command merges a branch into the current branch?",
    "options": [
      { "id": 1, "text": "git merge <branch>", "isCorrect": true },
      { "id": 2, "text": "git combine <branch>", "isCorrect": false },
      { "id": 3, "text": "git join <branch>", "isCorrect": false },
      { "id": 4, "text": "git attach <branch>", "isCorrect": false }
    ],
    "explanation": "The 'git merge' command merges branches."
  },
  {
    "competencyCode": "COMP15",
    "competencyName": "REST APIs",
    "level": "B1",
    "stem": "Which HTTP method is used to update a resource partially?",
    "options": [
      { "id": 1, "text": "PATCH", "isCorrect": true },
      { "id": 2, "text": "GET", "isCorrect": false },
      { "id": 3, "text": "PUT", "isCorrect": false },
      { "id": 4, "text": "DELETE", "isCorrect": false }
    ],
    "explanation": "PATCH is used to partially update a resource."
  },
  {
    "competencyCode": "COMP16",
    "competencyName": "Authentication & Authorization",
    "level": "B2",
    "stem": "What does JWT stand for?",
    "options": [
      { "id": 1, "text": "JSON Web Token", "isCorrect": true },
      { "id": 2, "text": "Java Web Token", "isCorrect": false },
      { "id": 3, "text": "JavaScript Web Token", "isCorrect": false },
      { "id": 4, "text": "JSON Wide Token", "isCorrect": false }
    ],
    "explanation": "JWT stands for JSON Web Token used for secure data transmission."
  },
  {
    "competencyCode": "COMP17",
    "competencyName": "Testing Basics",
    "level": "A1",
    "stem": "What is unit testing?",
    "options": [
      { "id": 1, "text": "Testing individual units of code", "isCorrect": true },
      { "id": 2, "text": "Testing entire application", "isCorrect": false },
      { "id": 3, "text": "Testing UI", "isCorrect": false },
      { "id": 4, "text": "Testing performance", "isCorrect": false }
    ],
    "explanation": "Unit testing focuses on individual components or functions."
  },
  {
    "competencyCode": "COMP18",
    "competencyName": "Testing Advanced",
    "level": "A2",
    "stem": "Which tool is commonly used for JavaScript testing?",
    "options": [
      { "id": 1, "text": "Jest", "isCorrect": true },
      { "id": 2, "text": "Mocha", "isCorrect": false },
      { "id": 3, "text": "Cypress", "isCorrect": false },
      { "id": 4, "text": "Selenium", "isCorrect": false }
    ],
    "explanation": "Jest is a popular JavaScript testing framework."
  },
  {
    "competencyCode": "COMP19",
    "competencyName": "DevOps Basics",
    "level": "B1",
    "stem": "What is Continuous Integration (CI)?",
    "options": [
      { "id": 1, "text": "Practice of merging code frequently", "isCorrect": true },
      { "id": 2, "text": "Deploying code to production", "isCorrect": false },
      { "id": 3, "text": "Monitoring server health", "isCorrect": false },
      { "id": 4, "text": "Writing documentation", "isCorrect": false }
    ],
    "explanation": "CI is the practice of merging code changes frequently to detect issues early."
  },
  {
    "competencyCode": "COMP20",
    "competencyName": "DevOps Advanced",
    "level": "B2",
    "stem": "What tool is used for container orchestration?",
    "options": [
      { "id": 1, "text": "Kubernetes", "isCorrect": true },
      { "id": 2, "text": "Docker", "isCorrect": false },
      { "id": 3, "text": "Jenkins", "isCorrect": false },
      { "id": 4, "text": "Ansible", "isCorrect": false }
    ],
    "explanation": "Kubernetes automates deployment, scaling, and management of containerized apps."
  },
  {
    "competencyCode": "COMP21",
    "competencyName": "Web Security Basics",
    "level": "A1",
    "stem": "What does HTTPS stand for?",
    "options": [
      { "id": 1, "text": "HyperText Transfer Protocol Secure", "isCorrect": true },
      { "id": 2, "text": "HyperText Transfer Protocol Simple", "isCorrect": false },
      { "id": 3, "text": "HyperText Transfer Protocol Standard", "isCorrect": false },
      { "id": 4, "text": "HyperText Transfer Protocol Server", "isCorrect": false }
    ],
    "explanation": "HTTPS encrypts data between browser and server."
  },
  {
    "competencyCode": "COMP22",
    "competencyName": "Web Security Advanced",
    "level": "A2",
    "stem": "Which attack involves injecting malicious SQL code?",
    "options": [
      { "id": 1, "text": "SQL Injection", "isCorrect": true },
      { "id": 2, "text": "Cross-site Scripting", "isCorrect": false },
      { "id": 3, "text": "Phishing", "isCorrect": false },
      { "id": 4, "text": "Denial of Service", "isCorrect": false }
    ],
    "explanation": "SQL Injection allows attackers to manipulate database queries."
  }
]


async function seedQuestions() {
  const totalNeeded = 132;
  const questions = [];
  let optionIdCounter = 1;

  // sampleQuestions array theke question repeat kore total 132 ta question toyri korbo
  while (questions.length < totalNeeded) {
    for (const q of sampleQuestions) {
      if (questions.length >= totalNeeded) break;

      // option id update korar jonno options array copy kore nibo
      const newOptions = q.options.map(opt => ({
        id: optionIdCounter++,
        text: opt.text,
        isCorrect: opt.isCorrect
      }));

      questions.push({
        competencyCode: q.competencyCode,
        competencyName: q.competencyName,
        level: q.level,
        stem: q.stem,
        options: newOptions,
        explanation: q.explanation
      });
    }
  }

  // database theke age question gula delete korbo
  await QuestionModel.deleteMany({});

  // notun question gulo insert korbo
  const inserted = await QuestionModel.insertMany(questions);
  console.log(`Successfully inserted ${inserted.length} questions!`);
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb');
    console.log('MongoDB connected');

    await seedQuestions();

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

main();
