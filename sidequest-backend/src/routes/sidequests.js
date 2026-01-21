const express = require('express');
const router = express.Router();
const {
  createSideQuest,
  getSideQuests,
  getSideQuestById,
  getMySideQuests,
  updateSideQuest,
  deleteSideQuest,
} = require('../controllers/sideQuestController');
const auth = require('../middleware/auth');

router.post('/', auth, createSideQuest);
router.get('/', getSideQuests);
router.get('/my-sidequests', auth, getMySideQuests);
router.get('/:id', getSideQuestById);
router.put('/:id', auth, updateSideQuest);
router.delete('/:id', auth, deleteSideQuest);

module.exports = router;
