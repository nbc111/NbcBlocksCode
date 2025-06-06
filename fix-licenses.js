const fs = require('fs');
const path = require('path');

function fixLicenseInPackageJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    
    if (packageJson.license === "Business Source License 1.1") {
      packageJson.license = "BUSL-1.1";
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`Fixed license in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item === 'package.json') {
      fixLicenseInPackageJson(fullPath);
    }
  }
}

// 处理 apps 和 packages 目录
processDirectory('apps');
processDirectory('packages'); 