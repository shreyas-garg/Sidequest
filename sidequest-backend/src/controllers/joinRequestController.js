const JoinRequest = require('../models/JoinRequest');
const SideQuest = require('../models/SideQuest');

exports.requestToJoin = async (req, res) => {
  try {
    const { sideQuestId } = req.body;

    if (!sideQuestId) {
      return res.status(400).json({ message: 'SideQuest ID is required' });
    }

    // Check if sidequest exists
    const sideQuest = await SideQuest.findById(sideQuestId);
    if (!sideQuest) {
      return res.status(404).json({ message: 'SideQuest not found' });
    }

    // Check if user is already a participant
    if (sideQuest.participants.includes(req.userId)) {
      return res.status(409).json({ message: 'You are already a participant' });
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({
      sideQuestId,
      userId: req.userId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(409).json({ message: 'Join request already pending' });
    }

    // Create join request
    const joinRequest = new JoinRequest({
      sideQuestId,
      userId: req.userId,
    });

    await joinRequest.save();
    await joinRequest.populate('userId', 'name profilePicture');

    res.status(201).json({
      message: 'Join request sent successfully',
      joinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJoinRequests = async (req, res) => {
  try {
    const { sideQuestId } = req.params;

    const sideQuest = await SideQuest.findById(sideQuestId);
    if (!sideQuest) {
      return res.status(404).json({ message: 'SideQuest not found' });
    }

    // Only creator can view join requests
    if (sideQuest.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view these requests' });
    }

    const joinRequests = await JoinRequest.find({
      sideQuestId,
      status: 'pending',
    }).populate('userId', 'name profilePicture bio');

    res.status(200).json(joinRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.acceptJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const joinRequest = await JoinRequest.findById(requestId).populate('sideQuestId');
    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    const sideQuest = joinRequest.sideQuestId;

    // Only creator can accept requests
    if (sideQuest.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    // Check if sidequest is full
    if (sideQuest.participants.length >= sideQuest.maxParticipants) {
      return res.status(409).json({ message: 'SideQuest is full' });
    }

    // Update join request status
    joinRequest.status = 'accepted';
    await joinRequest.save();

    // Add user to participants
    sideQuest.participants.push(joinRequest.userId);

    // Auto-close if full
    if (sideQuest.participants.length >= sideQuest.maxParticipants) {
      sideQuest.status = 'closed';
    }

    await sideQuest.save();

    res.status(200).json({
      message: 'Join request accepted',
      joinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rejectJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const joinRequest = await JoinRequest.findById(requestId).populate('sideQuestId');
    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    const sideQuest = joinRequest.sideQuestId;

    // Only creator can reject requests
    if (sideQuest.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    joinRequest.status = 'rejected';
    await joinRequest.save();

    res.status(200).json({
      message: 'Join request rejected',
      joinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeParticipant = async (req, res) => {
  try {
    const { sideQuestId, userId } = req.params;

    const sideQuest = await SideQuest.findById(sideQuestId);
    if (!sideQuest) {
      return res.status(404).json({ message: 'SideQuest not found' });
    }

    // Only creator can remove participants (and not themselves)
    if (sideQuest.creatorId.toString() !== req.userId || userId === req.userId) {
      return res.status(403).json({ message: 'Not authorized to remove this participant' });
    }

    sideQuest.participants = sideQuest.participants.filter((id) => id.toString() !== userId);

    // Reopen if was closed due to full capacity
    if (sideQuest.status === 'closed' && sideQuest.participants.length < sideQuest.maxParticipants) {
      sideQuest.status = 'open';
    }

    await sideQuest.save();

    res.status(200).json({
      message: 'Participant removed successfully',
      sideQuest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
