const { notes } = require('../data/mockData');

class NoteService {
  static getAllNotes(query = {}) {
    let filteredNotes = [...notes];

    if (query.status) {
      filteredNotes = filteredNotes.filter((note) => note.status === query.status);
    }

    if (query.categoryId) {
      filteredNotes = filteredNotes.filter((note) => note.category === query.categoryId);
    }

    if (query.tagId) {
      filteredNotes = filteredNotes.filter((note) => note.tags.includes(query.tagId));
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredNotes = filteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
      );
    }

    return filteredNotes;
  }

  static getNoteById(id) {
    return notes.find((note) => note._id === id);
  }

  static createNote(data) {
    const newNote = {
      _id: (notes.length + 1).toString(),
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    return newNote;
  }

  static updateNote(id, data) {
    const index = notes.findIndex((note) => note._id === id);
    if (index === -1) return null;

    const updatedNote = {
      ...notes[index],
      ...data,
      _id: id,
      updatedAt: new Date().toISOString(),
    };

    notes[index] = updatedNote;
    return updatedNote;
  }

  static deleteNote(id) {
    const index = notes.findIndex((note) => note._id === id);
    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      status: 'deleted',
      updatedAt: new Date().toISOString(),
    };

    return notes[index];
  }

  static archiveNote(id) {
    const index = notes.findIndex((note) => note._id === id);
    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    return notes[index];
  }

  static restoreNote(id) {
    const index = notes.findIndex((note) => note._id === id);
    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      status: 'active',
      updatedAt: new Date().toISOString(),
    };

    return notes[index];
  }

  static searchNotes(searchTerm) {
    if (!searchTerm) return [];

    const searchLower = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.status !== 'deleted' &&
        (note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower))
    );
  }

  static getNotesByCategory(categoryId) {
    return notes.filter((note) => note.status !== 'deleted' && note.category === categoryId);
  }
}

module.exports = NoteService;
