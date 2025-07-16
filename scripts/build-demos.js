#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const demoDir = 'demo';
const distDemoDir = 'dist/demo';

// Ensure dist/demo directory exists
if (!fs.existsSync(distDemoDir)) {
  fs.mkdirSync(distDemoDir, { recursive: true });
}

// Copy all demo files to dist/demo
console.log('📁 Copying demo files to dist/demo/...');
const demoFiles = fs.readdirSync(demoDir);

for (const file of demoFiles) {
  const srcPath = path.join(demoDir, file);
  const destPath = path.join(distDemoDir, file);
  
  if (fs.statSync(srcPath).isDirectory()) {
    // Copy directory recursively (for asset folder)
    fs.cpSync(srcPath, destPath, { recursive: true });
    console.log(`  📂 ${file}/`);
  } else if (file.endsWith('.html')) {
    // Process HTML files - replace src script with dist script
    let content = fs.readFileSync(srcPath, 'utf8');
    
    if (file === 'index.html') {
      // For index.html, adjust the data-src paths to be relative
      content = content.replace(/data-src="\/demo\//g, 'data-src="');
      console.log(`  📄 ${file} (processed - adjusted paths)`);
    } else {
      // Replace ES module imports with UMD scripts for demo files
      if (content.includes('EasyScroller')) {
        // EasyScroller demo - use full bundle (local copy for GitHub Pages)
        content = content.replace(
          /<!-- Load from source files \(dev mode\) -->[\s\S]*?<script type="module">[\s\S]*?<\/script>/,
          `<!-- Load from built bundle (production) -->
	<script src="scroller-full.umd.js"></script>`
        );
      } else if (content.includes('Scroller')) {
        // Core Scroller demos - use core bundle (local copy for GitHub Pages)
        content = content.replace(
          /<!-- Load from source files \(dev mode\) -->[\s\S]*?<script type="module">[\s\S]*?<\/script>/,
          `<!-- Load from built bundle (production) -->
	<script src="scroller.umd.js"></script>`
        );
      }
      console.log(`  📄 ${file} (processed)`);
    }
    
    fs.writeFileSync(destPath, content);
  } else {
    // Copy other files as-is
    fs.copyFileSync(srcPath, destPath);
    console.log(`  📄 ${file}`);
  }
}

// Copy required JS files into the demo directory for GitHub Pages
console.log('📦 Copying JS bundles to demo directory...');
const jsFiles = [
  'scroller.umd.js',
  'scroller-full.umd.js'
];

for (const jsFile of jsFiles) {
  const srcPath = path.join('dist', jsFile);
  const destPath = path.join(distDemoDir, jsFile);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  📄 ${jsFile}`);
  } else {
    console.warn(`  ⚠️  ${jsFile} not found in dist/`);
  }
}

console.log(`✅ Production demos built in ${distDemoDir}/`);
console.log(`💡 Open file://${process.cwd()}/${distDemoDir}/easyscroller.html in your browser to test the production build`); 