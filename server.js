// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


app.use("/", express.static(path.join(__dirname, "images")));

app.use("/", require('./Appointment'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});



// all routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});
app.get("/testing", (req, res) => {
  res.sendFile(path.join(__dirname, "testing.html"));
});
app.get("/appointment", (req, res) => {
  res.sendFile(path.join(__dirname, "appointment.html"));
});
app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "blog.html"));
});

app.get("/blog/post/1", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-post1.html"));
});
app.get("/blog/post/2", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-post2.html"));
});
app.get("/blog/post/3", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-post3.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});
app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "services.html"));
});
app.get("/shop", (req, res) => {
  res.sendFile(path.join(__dirname, "shop.html"));
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


