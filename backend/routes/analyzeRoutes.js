import express from 'express';
import multer from 'multer';
import { analyzeMedicalData, analyzePolicyCheck, analyzeNecessityCheck } from '../controllers/analyzeController.js';
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

router.post('/policy-check', upload.fields([
    { name: 'policyFile', maxCount: 1 },
    { name: 'medicalDocs', maxCount: 5 },
    { name: 'denialDocs', maxCount: 5 }
]), analyzePolicyCheck);

router.post('/necessity-check', upload.fields([
    { name: 'clinicalNotes', maxCount: 10 }
]), analyzeNecessityCheck);

export default router;
