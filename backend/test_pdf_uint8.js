import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const fs = require('fs');

console.log('Testing PDFParse with Uint8Array...');

// Minimal PDF header
const mockBuffer = Buffer.from('%PDF-1.0\n%EOF');
const uint8Array = new Uint8Array(mockBuffer);

try {
    const parser = new pdf.PDFParse(uint8Array);
    console.log('Parser created.');

    parser.load().then(res => {
        console.log('Load result keys:', Object.keys(res));
        console.log('Load text:', res.text);
    }).catch(err => {
        console.log('Load error:', err.message);
    });

} catch (e) {
    console.log('Sync Error:', e.message);
}
