const SideQuest = require('../models/SideQuest');
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');

exports.createSideQuest = async (req, res) => {
  try {
    const { title, description, category, dateTime, location, maxParticipants } = req.body;

    if (!title || !description || !category || !dateTime || !location || !maxParticipants) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sideQuest = new SideQuest({
      title,
      description,
      category,
      dateTime,
      location,
      maxParticipants,
      creatorId: req.userId,
      participants: [req.userId], // Creator is automatically a participant
    });

    await sideQuest.save();
    await sideQuest.populate('creatorId', 'name profilePicture');

    res.status(201).json({
      message: 'SideQuest created successfully',
      sideQuest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSideQuests = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let filter = { status: 'open' };

    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const sideQuests = await SideQuest.find(filter)
      .populate('creatorId', 'name profilePicture bio')
      .populate('participants', 'name profilePicture')
      .sort({ dateTime: 1 })
      .limit(50);

    res.status(200).json(sideQuests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSideQuestById = async (req, res) => {
  try {
    const { id } = req.params;

    const sideQuest = await SideQuest.findById(id)
      .populate('creatorId', 'name profilePicture bio')
      .populate('participants', 'name profilePicture');

    if (!sideQuest) {
      return res.status(404).json({ message: 'SideQuest not found' });
    }

    res.status(200).json(sideQuest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMySideQuests = async (req, res) => {
  try {
    const sideQuests = await SideQuest.find({ creatorId: req.userId })
      .populate('creatorId', 'name profilePicture')
      .populate('participants', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(sideQuests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSideQuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, dateTime, location, maxParticipants } = req.body;

    const sideQuest = await SideQuest.findById(id);
    if (!sideQuest) {
      return res.status(404).json({ message: 'SideQuest not found' });
    }

    // Only creator can update
    if (sideQuest.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this sidequest' });
    }

    Object.assign(sideQuest, {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(dateTime && { dateTime }),
      ...(location && { location }),
      ...(maxParticipants && { maxParticipants }),
    });

    await sideQuest.save();
    await sideQuest.populate('creatorId', 'name profilePicture');

    res.status(200).json({
      message: 'SideQuest updated successfully',
      sideQuest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSideQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const sideQuest = await SideQuest.findById(id);
    if (!sideQuest) {
      return res.status(404).json({ message: 'SideQuest not found' });
    }

    // Only creator can delete
    if (sideQuest.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this sidequest' });
    }

    await SideQuest.findByIdAndDelete(id);
    res.status(200).json({ message: 'SideQuest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
