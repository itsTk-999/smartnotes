const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { generateQuiz } = require('../controllers/noteController');

router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').put(protect, updateNote);

router.post('/generate-quiz/:noteId', protect, generateQuiz);
module.exports = router;