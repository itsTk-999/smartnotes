const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

// @desc    Get user notes
// @route   GET /api/notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(notes);
});

// @desc    Create a note
// @route   POST /api/notes
const createNote = asyncHandler(async (req, res) => {
  // 1. We retrieve 'objectives' from the request body here
  const { title, content, subject, tags, objectives } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  const note = new Note({
    user: req.user._id,
    title,
    content,
    subject,
    tags,
    objectives: objectives || [] // 2. We explicitly save them here
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
});

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.subject = req.body.subject || note.subject;
    note.tags = req.body.tags || note.tags;
    note.isFavorite = req.body.isFavorite ?? note.isFavorite;
    
    // 3. Allow updating objectives
    if (req.body.objectives) {
      note.objectives = req.body.objectives;
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Generates mock objectives/questions from note content
// @route   POST /api/notes/generate-quiz/:noteId
const generateQuiz = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note || note.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Note not found');
  }
  
  const content = note.content || ""; // Rich text HTML
  
  // --- MOCK AI LOGIC (Keyword Extraction Heuristic) ---
  const plainText = content.replace(/<[^>]*>/g, '').substring(0, 500); // Strip HTML
  const sentences = plainText.split(/[.!?]/).filter(s => s.trim().length > 10);
  
  const keywords = ['Define', 'Explain', 'List', 'Compare', 'Describe'];
  let generatedObjectives = [];
  
  // Create mock questions based on note structure
  if (sentences.length > 0) {
      generatedObjectives.push({ 
          text: `${keywords[0]}: What is the primary focus of the note titled "${note.title}"?`, 
          isMastered: false 
      });
  }
  if (sentences.length > 1) {
      generatedObjectives.push({ 
          text: `${keywords[1]}: Summarize the main idea of the second point in the note.`, 
          isMastered: false 
      });
  }
  if (sentences.length > 3) {
      generatedObjectives.push({ 
          text: `${keywords[2]}: List three key terms mentioned in the content.`, 
          isMastered: false 
      });
  }
  const existingObjectiveTexts = new Set(note.objectives.map(o => o.text));
  const newObjectives = generatedObjectives.filter(o => !existingObjectiveTexts.has(o.text));
  
  note.objectives.push(...newObjectives);
  
  const updatedNote = await note.save();
  res.json(updatedNote);
});

module.exports = { getNotes, createNote, updateNote, generateQuiz };