const Note = require('../models/note');
const logger = require('../utils/logger');

async function createNote(req, res) {
  try {
    const note = new Note(req.body);
    await note.save();

    logger.info('Note created successfully', { noteId: note._id });
    return res.status(201).json(note);
  } catch (error) {
    logger.error('Error creating note:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getNotes(req, res) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const notes = await Note.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 })
      .exec();

    const count = await Note.countDocuments(query);

    logger.info('Notes retrieved successfully');
    return res.status(200).json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNotes: count,
    });
  } catch (error) {
    logger.error('Error retrieving notes:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    logger.info('Note retrieved successfully', { noteId: note._id });
    return res.status(200).json(note);
  } catch (error) {
    logger.error('Error retrieving note:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateNote(req, res) {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    logger.info('Note updated successfully', { noteId: note._id });
    return res.status(200).json(note);
  } catch (error) {
    logger.error('Error updating note:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { status: 'deleted' }, { new: true });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    logger.info('Note soft deleted successfully', { noteId: note._id });
    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    logger.error('Error deleting note:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function archiveNote(req, res) {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    logger.info('Note archived successfully', { noteId: note._id });
    return res.status(200).json(note);
  } catch (error) {
    logger.error('Error archiving note:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function restoreNote(req, res) {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    logger.info('Note restored successfully', { noteId: note._id });
    return res.status(200).json(note);
  } catch (error) {
    logger.error('Error restoring note:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function searchNotes(req, res) {
  try {
    const { q = '' } = req.query;
    const notes = await Note.searchNotes(q);

    logger.info('Search performed successfully', { query: q });
    return res.status(200).json(notes);
  } catch (error) {
    logger.error('Error searching notes:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  restoreNote,
  searchNotes,
};
