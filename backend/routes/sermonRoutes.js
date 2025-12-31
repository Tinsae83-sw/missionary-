const express = require('express');
const router = express.Router();
const {
  getSermons,
  getSermon,
  createSermon,
  updateSermon,
  deleteSermon,
  incrementDownloadCount,
  toggleLike,
  incrementShareCount
} = require('../controllers/sermonController');

// All routes are public
router.get('/', getSermons);
router.get('/:id', getSermon);
router.post('/', createSermon);
router.put('/:id', updateSermon);
router.delete('/:id', deleteSermon);
router.put('/:id/download', incrementDownloadCount);
router.post('/:id/like', toggleLike);
router.post('/:id/share', incrementShareCount);

module.exports = router;
