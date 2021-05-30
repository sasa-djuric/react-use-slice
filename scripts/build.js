const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.resolve(process.cwd(), 'lib');

(() => {
	execSync('tsc');

	fs.copyFileSync(
		path.resolve(process.cwd(), 'package.json'),
		path.resolve(distPath, 'package.json')
	);

	fs.copyFileSync(
		path.resolve(process.cwd(), 'README.md'),
		path.resolve(distPath, 'README.md')
	);
})();
