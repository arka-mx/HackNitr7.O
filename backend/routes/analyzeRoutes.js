import express from 'express';
import multer from 'multer';
import { analyzeMedicalData, analyzePolicyCheck } from '../controllers/analyzeController.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.fields([
    { name: 'hospitalBill', maxCount: 1 },
    { name: 'insurancePolicy', maxCount: 1 }
]), analyzeMedicalData);

router.post('/policy-check', upload.fields([
    { name: 'policyFile', maxCount: 1 },
    { name: 'medicalDocs', maxCount: 5 },
    { name: 'denialDocs', maxCount: 5 }
]), analyzePolicyCheck);

export default router;
