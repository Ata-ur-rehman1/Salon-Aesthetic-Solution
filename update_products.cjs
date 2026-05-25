const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Experttech.pk\\Desktop\\Dot-NK-E-Store\\frontend\\src\\pages\\ProductbyCategory';
const templatePath = path.join(dir, 'Mobiles.jsx');

try {
    const template = fs.readFileSync(templatePath, 'utf8');
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (file === 'Mobiles.jsx' || !file.endsWith('.jsx')) return;

        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract axios URL
        const urlMatch = content.match(/axios\.get\s*\(\s*[`"']([^`"']+)["'`]/);
        if (!urlMatch) {
            console.log(`Skipping ${file}: No axios URL found`);
            return;
        }
        const url = urlMatch[1];
        // console.log(`Found URL for ${file}: ${url}`); ok

        const componentName = file.replace('.jsx', '');

        // Create human readable title
        // e.g. "BeddingAndBath" -> "Bedding And Bath"
        let humanReadableName = componentName.replace(/([A-Z])/g, ' $1').trim();
        // remove extra spaces if any
        humanReadableName = humanReadableName.replace(/\s+/g, ' ');

        let newContent = template;

        // Replace Component Name in definition
        // "const Mobiles ="
        newContent = newContent.replace(/const Mobiles\s*=/, `const ${componentName} =`);

        // Replace Export
        // "export default Mobiles;"
        newContent = newContent.replace(/export default Mobiles/, `export default ${componentName}`);

        // Replace URL
        // The template has this specific URL
        newContent = newContent.replace(/\/api\/category\/6929e21f9ee403bf655019b4\/products/, url);

        // Replace Title Text
        // "Mobile Collection"
        newContent = newContent.replace(/Mobile Collection/g, `${humanReadableName} Collection`);

        // Replace Loading Text
        // "Loading Mobile Collection..."
        newContent = newContent.replace(/Loading Mobile Collection.../g, `Loading ${humanReadableName} Collection...`);

        // Write back
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${file}`);
    });
    console.log('All files updated successfully.');
} catch (err) {
    console.error('Script Error:', err);
}
