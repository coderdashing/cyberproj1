const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.get('/campaigns', campaignController.getAllCampaigns);
router.post('/campaigns', campaignController.createCampaigns);
router.delete('/campaigns', campaignController.clearCampaigns); // New delete route
router.post('/click', campaignController.registerClick);

module.exports = router;
