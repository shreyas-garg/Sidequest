const express = require('express');
const router = express.Router();
const {
  requestToJoin,
  getJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  removeParticipant,
} = require('../controllers/joinRequestController');
const auth = require('../middleware/auth');

router.post('/request-join', auth, requestToJoin);
router.get('/:sideQuestId/requests', auth, getJoinRequests);
router.put('/:requestId/accept', auth, acceptJoinRequest);
router.put('/:requestId/reject', auth, rejectJoinRequest);
router.delete('/:sideQuestId/participant/:userId', auth, removeParticipant);

module.exports = router;
