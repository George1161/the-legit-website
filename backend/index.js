// Trigger redeploy
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve uploads as static files
app.use('/uploads', express.static('uploads'));

// Project schema
const projectSchema = new mongoose.Schema({
  title: String,
  shortDescription: String,
  fullDescription: String,
  social: String,
  image: String,
  votes: { type: Number, default: 0 },
  nominated: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  editCount: { type: Number, default: 0 },
  createdByIP: String,
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model('Project', projectSchema);

// In-memory IP vote tracking: { projectId: Set of IPs }
let voteIPs = {};

const PROJECTS_FILE = 'projects.json';
const VOTE_IPS_FILE = 'voteIPs.json';

// Ensure uploads directory exists
const UPLOADS_DIR = 'uploads';
if (!fsSync.existsSync(UPLOADS_DIR)) {
  fsSync.mkdirSync(UPLOADS_DIR);
}
// Ensure projects.json exists and is valid
try {
  if (!fsSync.existsSync(PROJECTS_FILE)) {
    fsSync.writeFileSync(PROJECTS_FILE, '[]');
  } else {
    // Try to parse to ensure it's valid JSON
    JSON.parse(fsSync.readFileSync(PROJECTS_FILE, 'utf-8'));
  }
} catch (e) {
  fsSync.writeFileSync(PROJECTS_FILE, '[]');
}

// Load projects from file
async function loadProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    projects = JSON.parse(data);
    nextId = projects.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  } catch {
    projects = [];
    nextId = 1;
  }
}

// Save projects to file
async function saveProjects() {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// Load vote IPs from file
async function loadVoteIPs() {
  try {
    const data = await fs.readFile(VOTE_IPS_FILE, 'utf-8');
    const obj = JSON.parse(data);
    voteIPs = {};
    for (const [projectId, ipArr] of Object.entries(obj)) {
      voteIPs[projectId] = new Set(ipArr);
    }
  } catch {
    voteIPs = {};
  }
}

// Save vote IPs to file
async function saveVoteIPs() {
  const obj = {};
  for (const [projectId, ipSet] of Object.entries(voteIPs)) {
    obj[projectId] = Array.from(ipSet);
  }
  await fs.writeFile(VOTE_IPS_FILE, JSON.stringify(obj, null, 2));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// On server start, load projects
loadProjects();
// On server start, load vote IPs
loadVoteIPs();

// Health check
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'The Legit backend is running.' });
});

// Public: Get all approved projects
app.get('/projects', async (req, res) => {
  const projects = await Project.find({ approved: true }).sort({ createdAt: -1 });
  res.json(projects);
});

// Submit a new project (max 3 per IP, not approved by default)
app.post('/projects', upload.any(), async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const count = await Project.countDocuments({ createdByIP: ip });
  if (count >= 3) {
    return res.status(403).json({ success: false, message: 'You have reached the submission limit for this IP.' });
  }
  let imageFile = null;
  if (req.files && req.files.length > 0) {
    imageFile = req.files.find(f => f.fieldname === 'image');
  }
  let { title, shortDescription, fullDescription, social, description } = req.body;
  if (!title || !shortDescription || !fullDescription) {
    try {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      title = title || parsed.title;
      shortDescription = shortDescription || parsed.shortDescription || parsed.description;
      fullDescription = fullDescription || parsed.fullDescription || parsed.description;
      social = social || parsed.social;
    } catch (e) {}
  }
  const shortDesc = shortDescription || description || '';
  const fullDesc = fullDescription || description || '';
  if (!title || !shortDesc || !fullDesc) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  const project = new Project({
    title,
    shortDescription: shortDesc,
    fullDescription: fullDesc,
    social,
    image: imageFile ? `/uploads/${imageFile.filename}` : null,
    createdByIP: ip,
    approved: false,
    editCount: 0,
  });
  await project.save();
  res.json({ success: true, project });
});

app.delete('/projects/:id', async (req, res) => {
  const id = Number(req.params.id);
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  projects.splice(index, 1);
  await saveProjects();
  res.json({ success: true });
});

app.put('/projects/:id', upload.any(), async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  if (project.createdByIP !== ip) return res.status(403).json({ success: false, message: 'You can only edit your own project.' });
  if (project.editCount >= 3) return res.status(403).json({ success: false, message: 'Edit limit reached for this project.' });
  let imageFile = null;
  if (req.files && req.files.length > 0) {
    imageFile = req.files.find(f => f.fieldname === 'image');
  }
  let { title, shortDescription, fullDescription, social, description } = req.body;
  if (!title || !shortDescription || !fullDescription) {
    try {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      title = title || parsed.title;
      shortDescription = shortDescription || parsed.shortDescription || parsed.description;
      fullDescription = fullDescription || parsed.fullDescription || parsed.description;
      social = social || parsed.social;
    } catch (e) {}
  }
  const shortDesc = shortDescription || description || '';
  const fullDesc = fullDescription || description || '';
  if (!title || !shortDesc || !fullDesc) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  project.title = title;
  project.shortDescription = shortDesc;
  project.fullDescription = fullDesc;
  project.social = social;
  if (imageFile) project.image = `/uploads/${imageFile.filename}`;
  project.editCount += 1;
  project.approved = false; // Needs admin re-approval
  await project.save();
  res.json({ success: true, project });
});

app.post('/vote', async (req, res) => {
  console.log('Received a vote request', req.body);
  const { id } = req.body;
  const projectId = String(id); // Always use string
  const project = projects.find((p) => String(p.id) === projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === 'string' && ip.includes(',')) ip = ip.split(',')[0].trim();
  if (ip === '::1') ip = '127.0.0.1';

  voteIPs[projectId] = voteIPs[projectId] || new Set();
  console.log('Voting IP:', ip, 'Current IPs for project', projectId, ':', Array.from(voteIPs[projectId]));
  if (voteIPs[projectId].has(ip)) {
    return res.status(403).json({ success: false, message: 'You have already voted for this project.' });
  }
  voteIPs[projectId].add(ip);
  project.votes += 1;
  await saveProjects();
  await saveVoteIPs();
  res.json({ success: true, project });
});

app.post('/nominate', async (req, res) => {
  const { id } = req.body;
  const project = projects.find((p) => p.id === Number(id));
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  project.nominated = !project.nominated;
  await saveProjects();
  res.json({ success: true, project });
});

app.post('/clear-votes', async (req, res) => {
  const { id } = req.body;
  const projectId = String(id);
  const project = projects.find((p) => String(p.id) === projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  project.votes = 0;
  voteIPs[projectId] = new Set();
  await saveProjects();
  await saveVoteIPs();
  res.json({ success: true, project });
});

// Admin: List all unapproved projects
app.get('/admin/projects', async (req, res) => {
  // TODO: Add admin authentication
  const projects = await Project.find({ approved: false }).sort({ createdAt: -1 });
  res.json(projects);
});

// Admin: Approve a project
app.post('/admin/projects/:id/approve', async (req, res) => {
  // TODO: Add admin authentication
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  project.approved = true;
  await project.save();
  res.json({ success: true, project });
});

// Admin: Reject (delete) a project
app.post('/admin/projects/:id/reject', async (req, res) => {
  // TODO: Add admin authentication
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`The Legit backend running on port ${PORT}`);
}); 