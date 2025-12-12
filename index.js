/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import router from "./routes/index.js";
import fs from 'fs';
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware MUST come before routes
app.use(session({
  secret: "xianfire-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));
app.use(flash());
app.use(express.static(path.join(process.cwd(), "public")));

app.engine("xian", async (filePath, options, callback) => {
  try {
    const originalPartialsDir = hbs.partialsDir;
    hbs.partialsDir = path.join(__dirname, 'views');

    // Register helpers on handlebars instance
    hbs.handlebars.registerHelper('ifEquals', function(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    });

    hbs.handlebars.registerHelper('replaceHyphens', function(str) {
      return str ? str.replace(/-/g, ' ').toUpperCase() : '';
    });

    hbs.handlebars.registerHelper('dateFormatFull', function(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });

    hbs.handlebars.registerHelper('dateFormatLong', function(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    hbs.handlebars.registerHelper('dateFormatTime', function(date) {
      if (!date) return '';
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    });

    hbs.handlebars.registerHelper('wordCount', function(text) {
      if (!text) return 0;
      return text.trim().split(/\s+/).length;
    });

    hbs.handlebars.registerHelper('characterCount', function(text) {
      if (!text) return 0;
      return text.length;
    });

    hbs.handlebars.registerHelper('readingTime', function(text) {
      if (!text) return 0;
      const words = text.trim().split(/\s+/).length;
      const wordsPerMinute = 200;
      return Math.ceil(words / wordsPerMinute);
    });

    hbs.handlebars.registerHelper('gt', function(a, b) {
      return a > b;
    });

    hbs.handlebars.registerHelper('lt', function(a, b) {
      return a < b;
    });

    hbs.handlebars.registerHelper('plus', function(a, b) {
      return a + b;
    });

    hbs.handlebars.registerHelper('minus', function(a, b) {
      return a - b;
    });

    hbs.handlebars.registerHelper('range', function(start, end, options) {
      let result = '';
      for (let i = start; i <= end; i++) {
        result += options.fn ? options.fn(i) : '';
      }
      return result;
    });

    hbs.handlebars.registerHelper('times', function(n, options) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += options.fn(i);
      }
      return result;
    });

    hbs.handlebars.registerHelper('random', function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });

    hbs.handlebars.registerHelper('dayName', function(index) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const date = new Date(today.getTime() - (6 - index) * 24 * 60 * 60 * 1000);
      return days[date.getDay()];
    });

    const result = await new Promise((resolve, reject) => {
      hbs.__express(filePath, options, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    hbs.partialsDir = originalPartialsDir;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
});

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "xian");

// ✅ FIXED: Register partials synchronously with proper error handling
const partialsDir = path.resolve(__dirname, "views", "partials");
console.log("📁 Looking for partials in:", partialsDir);

try {
  const files = fs.readdirSync(partialsDir);
  console.log("📄 Found files:", files);
  
  files
    .filter(file => file.endsWith('.xian'))
    .forEach(file => {
      const partialName = file.replace('.xian', ''); 
      const fullPath = path.resolve(partialsDir, file);
      console.log(`🔍 Processing partial: ${partialName} from ${fullPath}`);
      
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        hbs.registerPartial(partialName, content);
        console.log(`✅ Successfully registered partial: ${partialName}`);
      } catch (err) {
        console.error(`❌ Failed to read partial: ${file}`, err.message);
      }
    });
  
  // Log registered partials
  console.log("📋 Registered partials:", Object.keys(hbs.handlebars.partials));
  
} catch (err) {
  console.error("❌ Could not read partials directory:", err.message);
  console.error("Make sure the folder exists and contains .xian files");
}

app.use("/", router);

export default app;

if (!process.env.ELECTRON) {
  app.listen(PORT, () => console.log(`🔥 XianFire running at http://localhost:${PORT}`));
}