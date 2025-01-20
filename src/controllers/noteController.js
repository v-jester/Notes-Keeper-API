const noteService = require('../services/noteService');
const logger = require('../utils/logger');

async function createNote(req, res) {
  try {
    const note = noteService.createNote(req.body);
    logger.info('Note created successfully', { noteId: note._id });
    return res.status(201).json(note);
  } catch (error) {
    logger.error('Error creating note:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getNotes(req, res) {
  try {
    const notes = noteService.getAllNotes(req.query);
    return res.status(200).json(notes);
  } catch (error) {
    logger.error('Error retrieving notes:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getNoteById(req, res) {
  try {
    const note = noteService.getNoteById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json(note);
  } catch (error) {
    logger.error('Error retrieving note:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateNote(req, res) {
  try {
    const note = noteService.updateNote(req.params.id, req.body);

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
    const note = noteService.deleteNote(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    logger.info('Note deleted successfully', { noteId: note._id });
    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    logger.error('Error deleting note:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function archiveNote(req, res) {
  try {
    const note = noteService.archiveNote(req.params.id);

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
    const note = noteService.restoreNote(req.params.id);

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
    const notes = noteService.searchNotes(req.query.q || '');
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
