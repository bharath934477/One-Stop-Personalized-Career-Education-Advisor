// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String, // student | graduate
  course: String,
  skills: [String],
  interests: [String]
});
const User = mongoose.model("User", userSchema);

// register/login
app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// save skills
app.post("/api/skills", async (req, res) => {
  try {
    const { email, skills, interests } = req.body;
    
    // Convert comma-separated strings to arrays if needed
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    const interestsArray = Array.isArray(interests) ? interests : interests.split(',').map(i => i.trim());
    
    const user = await User.findOneAndUpdate(
      { email },
      { 
        $set: {
          skills: skillsArray,
          interests: interestsArray
        }
      },
      { new: true, upsert: false }
    );
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to save skills" });
  }
});

// Get user data
app.get("/api/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to retrieve user" });
  }
});

// AI search
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Predefined AI prompts for career advice
const careerPrompts = {
  "trending_careers": "List the top 5 trending career paths in technology for 2025, including job growth projections and required skills.",
  "career_switch": "What are the best strategies for switching careers from academia to tech industry? Include specific steps and timeline.",
  "skill_gap": "Analyze the current skill gap in the AI/ML industry and suggest learning paths to bridge it.",
  "freelancing": "What are the most lucrative freelancing opportunities in the creative and tech industries for 2025?",
  "remote_work": "How can professionals optimize their remote work experience for career advancement?",
  "entrepreneurship": "What are the key factors for successful tech entrepreneurship in the current market?",
  "salary_negotiation": "Provide 5 effective salary negotiation strategies for tech professionals in 2025.",
  "work_life_balance": "How can tech professionals maintain work-life balance while advancing their careers?"
};

app.post("/api/search", async (req, res) => {
  try {
    const { searchQuery, promptType } = req.body;
    
    // Use predefined prompt if promptType is provided
    let query = searchQuery;
    if (promptType && careerPrompts[promptType]) {
      query = careerPrompts[promptType];
    }
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: query }],
    });
    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI error", details: err.message });
  }
});

// Get predefined career prompts
app.get("/api/prompts", (req, res) => {
  res.json({ prompts: careerPrompts });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));