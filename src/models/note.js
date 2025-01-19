const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [200, 'Title cannot be longer than 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

noteSchema.index({ title: 'text', content: 'text' });

noteSchema.index({ status: 1 });

noteSchema.index({ tags: 1 });

noteSchema.virtual('createdAtFormatted').get(function formatCreatedAt() {
  return this.createdAt.toLocaleDateString();
});

noteSchema.pre('save', function incrementVersion(next) {
  if (this.isModified('content') || this.isModified('title')) {
    this.version += 1;
  }
  next();
});

noteSchema.statics.searchNotes = async function searchNotes(searchTerm) {
  return this.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } }).sort({
    score: { $meta: 'textScore' },
  });
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
