const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Experttech.pk\\Desktop\\Dot-NK-E-Store\\frontend\\src\\pages\\ProductbyCategory';

try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (file === 'Mobiles.jsx' || !file.endsWith('.jsx')) return;

        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace "smartphones" with "products"
        // Case insensitive global replacement might be safer but "smartphones" matches what was in Mobiles.jsx
        if (content.includes('smartphones')) {
            content = content.replace(/smartphones/g, 'products');
            fs.writeFileSync(filePath, content);
            console.log(`Updated text in ${file}`);
        }
    });
    console.log('Validating title replacements...');
    // Quick validation log
    files.forEach(file => {
        if (file === 'Mobiles.jsx' || !file.endsWith('.jsx')) return;
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('Mobile Collection')) {
            console.warn(`WARNING: ${file} still contains "Mobile Collection"`);
        }
    });

    console.log('Text fix completed.');
} catch (err) {
    console.error('Script Error:', err);
}
