const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      unique: true,
      maxLength: [50, 'Tag name cannot be longer than 50 characters'],
    },
    color: {
      type: String,
      default: '#000000',
      validate: {
        validator: (v) => /^#[0-9A-Fa-f]{6}$/.test(v),
        message: 'Color must be a valid hex color code',
      },
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description cannot be longer than 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

tagSchema.index({ name: 1 }, { unique: true });

tagSchema.virtual('noteCount', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'tags',
  count: true,
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
