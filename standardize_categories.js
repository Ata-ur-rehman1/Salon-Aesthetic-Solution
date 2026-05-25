const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\Experttech.pk\\Desktop\\Dot-NK-E-Store\\frontend\\src\\pages\\ProductbyCategory';
const templateFile = path.join(directory, 'Mobiles.jsx');

if (!fs.existsSync(templateFile)) {
    console.error('Template file not found');
    process.exit(1);
}

const templateContent = fs.readFileSync(templateFile, 'utf8');
const idPattern = /\/api\/category\/(?:ies\/)?([a-f\d]{24})\/products/;
const componentNamePattern = /const\s+(\w+)\s+=\s+\(\{\s*categoryId\s*\}\)\s+=>\s+\{/;

const files = fs.readdirSync(directory).filter(f => f.endsWith('.jsx') && f !== 'Mobiles.jsx');

console.log(`Found ${files.length} files to standardize.`);

files.forEach(filename => {
    const filepath = path.join(directory, filename);
    const content = fs.readFileSync(filepath, 'utf8');

    const idMatch = content.match(idPattern);
    if (!idMatch) {
        console.log(`Skipping ${filename}: Could not find category ID`);
        return;
    }
    const categoryId = idMatch[1];

    let componentName;
    const nameMatch = content.match(componentNamePattern);
    if (!nameMatch) {
        componentName = filename.replace('.jsx', '');
    } else {
        componentName = nameMatch[1];
    }

    let collectionTitle = componentName.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (!collectionTitle.endsWith('Collection')) {
        collectionTitle = `${collectionTitle} Collection`;
    }

    let newContent = templateContent;
    newContent = newContent.replace(/const Mobiles =/g, `const ${componentName} =`);
    newContent = newContent.replace(/export default Mobiles;/g, `export default ${componentName};`);
    newContent = newContent.replace(/\/api\/category\/[a-f\d]{24}\/products/g, `/api/category/${categoryId}/products`);
    newContent = newContent.split('Loading Mobile Collection...').join(`Loading ${collectionTitle}...`);
    newContent = newContent.split('Mobile Collection').join(collectionTitle);

    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`Standardized: ${filename} (ID: ${categoryId}, Name: ${componentName})`);
});

console.log('All files processed.');
