import os
import re

directory = r"c:\Users\Experttech.pk\Desktop\Dot-NK-E-Store\frontend\src\pages\ProductbyCategory"
template_file = os.path.join(directory, "Mobiles.jsx")

with open(template_file, 'r', encoding='utf-8') as f:
    template_content = f.read()

# Define the pattern to find the category ID in the old files
# Usually looks like: /api/category/SOME_ID/products or /api/category/ies/SOME_ID/products
id_pattern = re.compile(r'/api/category/(?:ies/)?([a-f\d]{24})/products')

# Define the pattern to find the component name in the old files
component_name_pattern = re.compile(r'const\s+(\w+)\s+=\s+\(\{\s*categoryId\s*\}\)\s+=>\s+\{')

files = [f for f in os.listdir(directory) if f.endswith('.jsx') and f != "Mobiles.jsx"]

print(f"Found {len(files)} files to standardize.")

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract Category ID
    id_match = id_pattern.search(content)
    if not id_match:
        print(f"Skipping {filename}: Could not find category ID")
        continue
    category_id = id_match.group(1)
    
    # Extract Component Name
    name_match = component_name_pattern.search(content)
    if not name_match:
        # Fallback: use filename without .jsx
        component_name = filename.replace('.jsx', '')
    else:
        component_name = name_match.group(1)
    
    # Create descriptive Title (e.g., "ActionFigures" -> "Action Figures Collection")
    # Simple camelCase to Space Case
    collection_title = re.sub(r'([a-z])([A-Z])', r'\1 \2', component_name)
    if not collection_title.endswith("Collection"):
        collection_title = f"{collection_title} Collection"

    # Generate new content based on template
    new_content = template_content
    
    # Replacement 1: Component Name definition
    new_content = re.sub(r'const Mobiles =', f'const {component_name} =', new_content)
    
    # Replacement 2: export default
    new_content = re.sub(r'export default Mobiles;', f'export default {component_name};', new_content)
    
    # Replacement 3: Category ID in useEffect
    # Template has: `/api/category/6929e21f9ee403bf655019b4/products`
    new_content = re.sub(r'/api/category/[a-f\d]{24}/products', f'/api/category/{category_id}/products', new_content)
    
    # Replacement 4: Page Titles and Loader text
    new_content = new_content.replace('Loading Mobile Collection...', f'Loading {collection_title}...')
    new_content = new_content.replace('Mobile Collection', collection_title)
    
    # Replacement 5: Specific emoji/text if any (Template has 📵)
    # We can keep it or try to be smart, but standardizing on 📵 is fine if it's the new style.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Standardized: {filename} (ID: {category_id}, Name: {component_name})")

print("All files processed.")
