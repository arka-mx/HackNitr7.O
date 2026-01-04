import express from 'express';
import multer from 'multer';
import { analyzeCost } from '../controllers/costController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.fields([
    { name: 'hospitalBill', maxCount: 1 },
    { name: 'insurancePolicy', maxCount: 1 }
]), analyzeMedicalData);

router.post('/simplify', upload.fields([
    { name: 'hospitalBill', maxCount: 1 }
]), simplifyBill);

router.post('/policy-check', upload.fields([
    { name: 'policyFile', maxCount: 1 },
    { name: 'medicalDocs', maxCount: 5 },
    { name: 'denialDocs', maxCount: 5 }
]), analyzePolicyCheck);

router.post('/cost-analysis', upload.fields([
    { name: 'hospitalBill', maxCount: 1 },
    { name: 'policyFile', maxCount: 1 }
]), analyzeCost);

export default router;
