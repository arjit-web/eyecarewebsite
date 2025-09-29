// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());





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

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "images/favicon.png"));
});

// robots.txt
app.get("/robots.txt", cors(), (req, res) => {
  res.type("text/plain").send(
    `User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml\n`
  );
});

// sitemap.xml
app.get("/sitemap.xml", cors(), (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const urls = [
    "/",
    "/about",
    "/testing",
    "/appointment",
    "/services",
    "/shop",
    "/blog",
    "/blog/post/1",
    "/blog/post/2",
    "/blog/post/3",
    "/contact"
  ];
  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map(u => `\n  <url>\n    <loc>${host}${u}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join("") +
    `\n</urlset>`;
  res.type("application/xml").send(body);
});



app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api", require('./modules/Appointment'));
app.use("/api", require('./modules/Contact'));
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


