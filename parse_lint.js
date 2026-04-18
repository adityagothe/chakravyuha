const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lint-errors.json', 'utf8'));
data.forEach(file => {
  if (file.messages.length > 0) {
    console.log(`\n--- ${file.filePath} ---`);
    file.messages.forEach(msg => {
      console.log(`Line ${msg.line}:${msg.column} - [${msg.severity === 2 ? 'ERROR' : 'WARN'}] ${msg.message} (${msg.ruleId})`);
    });
  }
});
