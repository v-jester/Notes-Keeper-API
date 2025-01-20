const { tags, notes } = require('../data/mockData');

class TagService {
  static getAllTags() {
    return tags;
  }

  static getTagById(id) {
    return tags.find((tag) => tag._id === id);
  }

  static createTag(data) {
    if (tags.some((tag) => tag.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error('Tag with this name already exists');
    }

    const newTag = {
      _id: (tags.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tags.push(newTag);
    return newTag;
  }

  static updateTag(id, data) {
    const index = tags.findIndex((tag) => tag._id === id);
    if (index === -1) return null;

    if (
      data.name &&
      tags.some((tag) => tag.name.toLowerCase() === data.name.toLowerCase() && tag._id !== id)
    ) {
      throw new Error('Tag with this name already exists');
    }

    const updatedTag = {
      ...tags[index],
      ...data,
      _id: id,
      updatedAt: new Date().toISOString(),
    };

    tags[index] = updatedTag;
    return updatedTag;
  }

  static deleteTag(id) {
    const index = tags.findIndex((tag) => tag._id === id);
    if (index === -1) return false;

    notes.forEach((note) => {
      const tagIndex = note.tags.indexOf(id);
      if (tagIndex > -1) {
        note.tags.splice(tagIndex, 1);
      }
    });

    tags.splice(index, 1);
    return true;
  }

  static getNotesByTag(tagId) {
    return notes.filter((note) => note.status !== 'deleted' && note.tags.includes(tagId));
  }

  static searchTags(query) {
    if (!query) return tags;

    const searchLower = query.toLowerCase();
    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchLower) ||
        (tag.description && tag.description.toLowerCase().includes(searchLower))
    );
  }

  static getTagsByIds(ids) {
    return tags.filter((tag) => ids.includes(tag._id));
  }
}

module.exports = TagService;
