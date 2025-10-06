console.log("🚀 Node.js is working!");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);

// Test if all required modules can be loaded
try {
  const express = require('express');
  const mongoose = require('mongoose');
  console.log("✅ Express and Mongoose loaded successfully");
  
  // Test environment variables
  require('dotenv').config();
  if (process.env.MONGODB_URI) {
    console.log("✅ Environment variables loaded");
    console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
  } else {
    console.log("❌ Environment variables not loaded");
  }
  
} catch (error) {
  console.log("❌ Module loading error:", error.message);
}