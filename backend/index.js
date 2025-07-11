// FORCE REDEPLOY: Trivial change to ensure Render picks up the latest backend code.
// Trigger redeploy
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Multer setup for image uploads (memory storage for Cloudinary)
const storage = multer.memoryStorage();
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

// Vote schema for per-IP voting restriction
const voteSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  ip: String,
});
const Vote = mongoose.model('Vote', voteSchema);

// Ensure uploads directory exists
const UPLOADS_DIR = 'uploads';
if (!fsSync.existsSync(UPLOADS_DIR)) {
  fsSync.mkdirSync(UPLOADS_DIR);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// On server start, load projects
// Remove: loadProjects();
// On server start, load vote IPs
// Remove: loadVoteIPs();

// Health check
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'The Legit backend is running.' });
});

// Helper to map _id to id for frontend
function projectToClient(project) {
  const obj = project.toObject ? project.toObject() : project;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// Public: Get all approved projects
app.get('/projects', async (req, res) => {
  const projects = await Project.find({ approved: true }).sort({ createdAt: -1 });
  res.json(projects.map(projectToClient));
});

// Submit a new project (max 3 per IP, not approved by default)
app.post('/projects', upload.any(), async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const count = await Project.countDocuments({ createdByIP: ip });
    if (count >= 3) {
      return res.status(403).json({ success: false, message: 'You have reached the submission limit for this IP.' });
    }
    let imageUrl = null;
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(f => f.fieldname === 'image');
      if (imageFile) {
        imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream({ folder: 'the-legit-projects' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          });
          stream.end(imageFile.buffer);
        });
      }
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
      image: imageUrl,
      createdByIP: ip,
      approved: false,
      editCount: 0,
    });
    await project.save();
    res.json({ success: true, project: projectToClient(project) });
  } catch (err) {
    console.error('Error in /projects POST:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
});

app.delete('/projects/:id', async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  res.json({ success: true, project: projectToClient(project) });
});

app.put('/projects/:id', upload.any(), async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  if (project.createdByIP !== ip) return res.status(403).json({ success: false, message: 'You can only edit your own project.' });
  if (project.editCount >= 3) return res.status(403).json({ success: false, message: 'Edit limit reached for this project.' });
  let imageUrl = project.image;
  if (req.files && req.files.length > 0) {
    const imageFile = req.files.find(f => f.fieldname === 'image');
    if (imageFile) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream({ folder: 'the-legit-projects' }, (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        });
        stream.end(imageFile.buffer);
      });
    }
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
  project.image = imageUrl;
  project.editCount += 1;
  project.approved = false; // Needs admin re-approval
  await project.save();
  res.json({ success: true, project: projectToClient(project) });
});

app.post('/vote', async (req, res) => {
  const { id } = req.body;
  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === 'string' && ip.includes(',')) ip = ip.split(',')[0].trim();
  if (ip === '::1') ip = '127.0.0.1';
  const alreadyVoted = await Vote.findOne({ projectId: id, ip });
  if (alreadyVoted) {
    return res.status(403).json({ success: false, message: 'You have already voted for this project.' });
  }
  await Vote.create({ projectId: id, ip });
  project.votes += 1;
  await project.save();
  res.json({ success: true, project: projectToClient(project) });
});

app.post('/nominate', async (req, res) => {
  const { id } = req.body;
  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  project.nominated = !project.nominated;
  await project.save();
  res.json({ success: true, project: projectToClient(project) });
});

app.post('/clear-votes', async (req, res) => {
  const { id } = req.body;
  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  project.votes = 0;
  await project.save();
  await Vote.deleteMany({ projectId: id });
  res.json({ success: true, project: projectToClient(project) });
});

// Admin: Get all projects (approved and unapproved)
app.get('/admin/projects', async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects.map(projectToClient));
});
// FORCE REDEPLOY: This comment is here to ensure Render picks up the latest code.

// Admin: Approve a project
app.patch('/projects/:id/approve', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  project.approved = true;
  await project.save();
  res.json({ success: true, project: projectToClient(project) });
});

// Admin: Reject (delete) a project
app.post('/admin/projects/:id/reject', async (req, res) => {
  // TODO: Add admin authentication
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true });
});

// Get user limits (submissions and edits remaining)
app.get('/user-limits', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const submissionCount = await Project.countDocuments({ createdByIP: ip });
    const submissionsRemaining = Math.max(0, 3 - submissionCount);
    
    // Get projects created by this IP with their edit counts
    const userProjects = await Project.find({ createdByIP: ip });
    const projectEditInfo = userProjects.map(project => ({
      id: project._id.toString(),
      title: project.title,
      editCount: project.editCount,
      editsRemaining: Math.max(0, 3 - project.editCount)
    }));
    
    res.json({
      submissionsRemaining,
      totalSubmissions: submissionCount,
      projectEditInfo
    });
  } catch (err) {
    console.error('Error getting user limits:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`The Legit backend running on port ${PORT}`);
}); 