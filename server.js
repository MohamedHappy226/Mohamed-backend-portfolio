const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected ✅"))
  .catch(err => console.log(err));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Message = mongoose.model("Message", messageSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
});

app.get("/", (req, res) => {
  res.send("Backend is working 🔥");
});

app.post("/contact", async (req, res) => {
  try {
    console.log("Form Data:", req.body);

    const { name, email, message } = req.body;

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    await transporter.sendMail({
      from: "mohamedsaiiid1421973@gmail.com",
      to: "mohamedsaiiid1421973@gmail.com",
      subject: "New Message from Portfolio",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ message: "Message sent & saved 🔥" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error ❌" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});