const fs = require('fs');
const langs = ['zh', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'id', 'ur', 'ru', 'de', 'vi', 'my'];
const enPath = './messages/en.json';

try {
  const enContent = fs.readFileSync(enPath, 'utf-8');
  langs.forEach(lang => {
    fs.writeFileSync(`./messages/${lang}.json`, enContent);
    console.log(`Created messages/${lang}.json`);
  });
  console.log('All missing localization files created successfully based on en.json.');
} catch (err) {
  console.error('Error creating files:', err);
}
