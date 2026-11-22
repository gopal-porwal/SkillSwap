
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const demoUsers = [
  {
    name: "Rahul Sharma",
    email: "rahul.demo@skillswap.test",
    bio: "Java developer interested in learning modern frontend development.",
    skillsTeach: [
      { name: "C", level: "Advanced" },
      { name: "C++", level: "Intermediate" },
      { name: "Java", level: "Advanced" },
      { name: "DSA", level: "Intermediate" }
    ],
    skillsLearn: [
      { name: "React", level: "Beginner" },
      { name: "Node.js", level: "Beginner" }
    ]
  },
  {
    name: "Priya Verma",
    email: "priya.demo@skillswap.test",
    bio: "Frontend developer passionate about building responsive websites.",
    skillsTeach: [
      { name: "HTML", level: "Advanced" },
      { name: "CSS", level: "Advanced" },
      { name: "JavaScript", level: "Intermediate" },
      { name: "React", level: "Advanced" }
    ],
    skillsLearn: [
      { name: "Python", level: "Beginner" },
      { name: "Django", level: "Beginner" }
    ]
  },
  {
    name: "Aman Gupta",
    email: "aman.demo@skillswap.test",
    bio: "Python programmer exploring artificial intelligence and backend development.",
    skillsTeach: [
      { name: "Python", level: "Advanced" },
      { name: "SQL", level: "Intermediate" },
      { name: "Machine Learning", level: "Intermediate" }
    ],
    skillsLearn: [
      { name: "Java", level: "Beginner" },
      { name: "Spring Boot", level: "Beginner" }
    ]
  },
  {
    name: "Sneha Jain",
    email: "sneha.demo@skillswap.test",
    bio: "Java backend developer who enjoys working with databases.",
    skillsTeach: [
      { name: "Java", level: "Advanced" },
      { name: "Spring Boot", level: "Intermediate" },
      { name: "MySQL", level: "Advanced" }
    ],
    skillsLearn: [
      { name: "React", level: "Beginner" },
      { name: "UI/UX Design", level: "Beginner" }
    ]
  },
  {
    name: "Karan Patel",
    email: "karan.demo@skillswap.test",
    bio: "Computer science student interested in programming and problem solving.",
    skillsTeach: [
      { name: "C", level: "Advanced" },
      { name: "C++", level: "Advanced" },
      { name: "DSA", level: "Intermediate" }
    ],
    skillsLearn: [
      { name: "Python", level: "Beginner" },
      { name: "MongoDB", level: "Beginner" }
    ]
  },
  {
    name: "Anjali Mehta",
    email: "anjali.demo@skillswap.test",
    bio: "Web developer learning full-stack development.",
    skillsTeach: [
      { name: "HTML", level: "Advanced" },
      { name: "CSS", level: "Intermediate" },
      { name: "React", level: "Intermediate" }
    ],
    skillsLearn: [
      { name: "C++", level: "Beginner" },
      { name: "Java", level: "Beginner" }
    ]
  },
  {
    name: "Rohan Singh",
    email: "rohan.demo@skillswap.test",
    bio: "Full-stack JavaScript developer interested in backend technologies.",
    skillsTeach: [
      { name: "JavaScript", level: "Advanced" },
      { name: "Node.js", level: "Intermediate" },
      { name: "MongoDB", level: "Intermediate" }
    ],
    skillsLearn: [
      { name: "Java", level: "Beginner" },
      { name: "DSA", level: "Intermediate" }
    ]
  },
  {
    name: "Neha Joshi",
    email: "neha.demo@skillswap.test",
    bio: "Python developer interested in web development and open-source projects.",
    skillsTeach: [
      { name: "Python", level: "Advanced" },
      { name: "Flask", level: "Intermediate" },
      { name: "SQL", level: "Intermediate" },
      { name: "Git", level: "Intermediate" }
    ],
    skillsLearn: [
      { name: "React", level: "Beginner" },
      { name: "GitHub", level: "Intermediate" }
    ]
  }
];

async function seedDemoUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    const hashedPassword = await bcrypt.hash("Demo@12345", 10);

    for (const user of demoUsers) {
      const result = await User.updateOne(
        { email: user.email },
        {
          $setOnInsert: {
            ...user,
            password: hashedPassword,
            availability: [
              {
                day: "Monday",
                startTime: "10:00",
                endTime: "17:00"
              },
              {
                day: "Wednesday",
                startTime: "12:00",
                endTime: "18:00"
              }
            ]
          }
        },
        { upsert: true }
      );

      console.log(
        result.upsertedCount
          ? `Added: ${user.name} ✅`
          : `Already exists: ${user.name}`
      );
    }

    console.log("\nDemo user seeding completed!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDemoUsers();
