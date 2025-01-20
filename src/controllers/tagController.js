const tagService = require('../services/tagService');
const logger = require('../utils/logger');

async function createTag(req, res) {
  try {
    const tag = tagService.createTag(req.body);
    logger.info('Tag created successfully', { tagId: tag._id });
    return res.status(201).json(tag);
  } catch (error) {
    if (error.message === 'Tag with this name already exists') {
      return res.status(400).json({ error: error.message });
    }
    logger.error('Error creating tag:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getTags(req, res) {
  try {
    const tags = tagService.getAllTags();
    return res.status(200).json(tags);
  } catch (error) {
    logger.error('Error retrieving tags:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateTag(req, res) {
  try {
    const tag = tagService.updateTag(req.params.id, req.body);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    logger.info('Tag updated successfully', { tagId: tag._id });
    return res.status(200).json(tag);
  } catch (error) {
    if (error.message === 'Tag with this name already exists') {
      return res.status(400).json({ error: error.message });
    }
    logger.error('Error updating tag:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function deleteTag(req, res) {
  try {
    const success = tagService.deleteTag(req.params.id);

    if (!success) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    logger.info('Tag deleted successfully', { tagId: req.params.id });
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    logger.error('Error deleting tag:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getNotesByTag(req, res) {
  try {
    const notes = tagService.getNotesByTag(req.params.id);
    return res.status(200).json(notes);
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
