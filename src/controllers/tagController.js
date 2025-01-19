const Tag = require('../models/tag');
const Note = require('../models/note');
const logger = require('../utils/logger');

async function createTag(req, res) {
  try {
    const tag = new Tag(req.body);
    await tag.save();

    logger.info('Tag successfully created', { tagId: tag._id });
    return res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      logger.warn('Attempt to create a tag with an existing name', { name: req.body.name });
      return res.status(400).json({
        error: 'A tag with this name already exists',
      });
    }

    logger.error('Error while creating tag:', error);
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

    const count = await Tag.countDocuments(query);

    logger.info('Tags successfully retrieved');
    return res.status(200).json({
      tags,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTags: count,
    });
  } catch (error) {
    logger.error('Error while retrieving tags:', error);
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
      logger.warn('Attempt to update a non-existent tag', { tagId: req.params.id });
      return res.status(404).json({ error: 'Tag not found' });
    }

    logger.info('Tag successfully updated', { tagId: tag._id });
    return res.status(200).json(tag);
  } catch (error) {
    logger.error('Error while updating tag:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function deleteTag(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      logger.warn('Attempt to delete a non-existent tag', { tagId: req.params.id });
      return res.status(404).json({ error: 'Tag not found' });
    }

    await tag.deleteOne();

    logger.info('Tag successfully deleted', { tagId: req.params.id });
    return res.status(200).json({ message: 'Tag successfully deleted' });
  } catch (error) {
    logger.error('Error while deleting tag:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getNotesByTag(req, res) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const tag = await Tag.findById(id);
    if (!tag) {
      logger.warn('Attempt to retrieve notes for a non-existent tag', { tagId: id });
      return res.status(404).json({ error: 'Tag not found' });
    }

    const notes = await Note.find({ tags: id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 });

    const count = await Note.countDocuments({ tags: id });

    logger.info('Notes by tag successfully retrieved', { tagId: id });
    return res.status(200).json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNotes: count,
    });
  } catch (error) {
    logger.error('Error while retrieving notes by tag:', error);
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
