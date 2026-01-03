import express from 'express';
import multer from 'multer';
import { analyzeMedicalData } from '../controllers/analyzeController.js';
import { simplifyBill } from '../controllers/simplifyController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.fields([
    { name: 'hospitalBill', maxCount: 1 },
    { name: 'insurancePolicy', maxCount: 1 }
]), analyzeMedicalData);

router.post('/simplify', upload.fields([
    { name: 'hospitalBill', maxCount: 1 }
]), simplifyBill);

export default router;
