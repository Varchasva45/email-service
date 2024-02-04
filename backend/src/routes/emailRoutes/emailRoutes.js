const express = require('express');
const router = express.Router();

const { sendEmail, sendConfirmationEmail, verifyConfirmationCode} = require('../../services/emailMicroserive.services');
const uploadFileToS3 = require('../../services/uploadDocs');

router.post('/send-email', sendEmail);
router.post('/send-confirmation-email', sendConfirmationEmail);
router.post('/verify-confirmation-code', verifyConfirmationCode);
router.post('/upload-file', uploadFileToS3);

module.exports = router;