const Tag = require('../models/tag');
const Note = require('../models/note');
const logger = require('../utils/logger');

async function createTag(req, res) {
  try {
    const tag = new Tag(req.body);
    await tag.save();

    logger.info('Tag created successfully', { tagId: tag._id });
    return res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tag with this name already exists' });
    }

    logger.error('Error creating tag:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getTags(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const tags = await Tag.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Tag.countDocuments(query);

    return res.status(200).json({
      tags,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTags: total,
    });
  } catch (error) {
    logger.error('Error retrieving tags:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateTag(req, res) {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    logger.info('Tag updated successfully', { tagId: tag._id });
    return res.status(200).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tag with this name already exists' });
    }

    logger.error('Error updating tag:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function deleteTag(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Remove tag from all notes that use it
    await Note.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });

    await tag.deleteOne();

    logger.info('Tag deleted successfully', { tagId: req.params.id });
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    logger.error('Error deleting tag:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getNotesByTag(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const notes = await Note.find({ tags: req.params.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 })
      .populate('category', 'name')
      .populate('tags', 'name color');

    const total = await Note.countDocuments({ tags: req.params.id });

    return res.status(200).json({
      notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    logger.error('Error retrieving notes by tag:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  getNotesByTag,
};
