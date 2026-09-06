require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
mongoose.set('bufferCommands', false);
let databaseReady = false;
const memory = { users: [], symptoms: [], sessions: [] };
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((url) => url.trim()) : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

const symptomSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  breathlessness: { type: Number, min: 0, max: 5, required: true },
  coughing: { type: Number, min: 0, max: 5, required: true },
  wheezing: { type: Number, min: 0, max: 5, required: true },
  chestTightness: { type: Number, min: 0, max: 5, required: true },
  peakFlow: { type: Number, default: null },
  triggers: [String],
  medications: [String],
  notes: { type: String, maxlength: 2000 },
  feeling: String
}, { timestamps: true });

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  emoji: String,
  duration: { type: Number, min: 0, required: true },
  completed: Boolean,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Symptom = mongoose.model('Symptom', symptomSchema);
const ExerciseSession = mongoose.model('ExerciseSession', sessionSchema);

const createId = () => crypto.randomUUID();
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });
const getUserById = async (id) => databaseReady
  ? User.findById(id).select('-password')
  : memory.users.find((user) => user._id === id);

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE || '30d' }
);

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const authenticatedUser = await getUserById(payload.id);
    req.user = authenticatedUser?.toObject
      ? authenticatedUser.toObject()
      : authenticatedUser && { ...authenticatedUser };
    if (req.user?.password) delete req.user.password;
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: databaseReady ? 'connected' : 'development-memory',
    message: databaseReady ? 'MongoDB connected' : 'MongoDB unavailable; using temporary development storage'
  });
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, email, and a password of at least 6 characters are required' });
    }
    const normalizedEmail = email.toLowerCase();
    const existing = databaseReady
      ? await User.findOne({ email: normalizedEmail })
      : memory.users.find((user) => user.email === normalizedEmail);
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = databaseReady
      ? await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12) })
      : {
          _id: createId(),
          name: name.trim(),
          email: normalizedEmail,
          password: await bcrypt.hash(password, 12)
        };
    if (!databaseReady) memory.users.push(user);
    res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase();
    const user = databaseReady
      ? await User.findOne({ email: normalizedEmail })
      : memory.users.find((candidate) => candidate.email === normalizedEmail);
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', auth, (req, res) => res.json({ user: req.user }));

app.get('/api/symptoms', auth, async (req, res, next) => {
  try {
    if (!databaseReady) {
      return res.json(memory.symptoms.filter((item) => item.user === req.user._id).slice().reverse().slice(0, 100));
    }
    res.json(await Symptom.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(100));
  } catch (error) { next(error); }
});

app.post('/api/symptoms', auth, async (req, res, next) => {
  try {
    if (!databaseReady) {
      const item = { ...req.body, _id: createId(), user: req.user._id, createdAt: new Date().toISOString() };
      memory.symptoms.push(item);
      return res.status(201).json(item);
    }
    res.status(201).json(await Symptom.create({ ...req.body, user: req.user._id }));
  } catch (error) { next(error); }
});

app.get('/api/exercise-sessions', auth, async (req, res, next) => {
  try {
    if (!databaseReady) {
      return res.json(memory.sessions.filter((item) => item.user === req.user._id).slice().reverse().slice(0, 100));
    }
    res.json(await ExerciseSession.find({ user: req.user._id }).sort({ date: -1 }).limit(100));
  } catch (error) { next(error); }
});

app.post('/api/exercise-sessions', auth, async (req, res, next) => {
  try {
    if (!databaseReady) {
      const item = { ...req.body, _id: createId(), user: req.user._id, createdAt: new Date().toISOString() };
      memory.sessions.push(item);
      return res.status(201).json(item);
    }
    res.status(201).json(await ExerciseSession.create({ ...req.body, user: req.user._id }));
  } catch (error) { next(error); }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    databaseReady = true;
    console.log('MongoDB connected');
  })
  .catch((error) => console.error('MongoDB connection failed:', error.message));
