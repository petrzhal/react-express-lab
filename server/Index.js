import express from "express";
import cors from "cors";
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/db.js'; 
import authRoutes from './routes/authRoute.js'; 
import userRoutes from './routes/userRoute.js'; 
import exhibitionRoutes from './routes/exhibitionRoutes.js'
import exhibitRoutes from './routes/exhibitRoute.js'
import hallRoutes from './routes/hallRoutes.js';

const app = express();
const PORT = 5000;

await connectDB();

app.use(cors());
app.use(express.json());

const slavonicSecret = 'БожийСветИИстина';

app.use(session({
  secret: slavonicSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/exhibitions', exhibitionRoutes);
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/halls', hallRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
