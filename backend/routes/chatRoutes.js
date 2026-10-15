import express from 'express';
import rateLimit from 'express-rate-limit';
import { chatWithAssistant } from '../controllers/chatController.js';

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages. Please wait a minute and try again.' },
});

router.post('/', chatLimiter, chatWithAssistant);

export default router;