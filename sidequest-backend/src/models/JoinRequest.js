const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema(
  {
    sideQuestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SideQuest',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
