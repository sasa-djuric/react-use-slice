const fs = require('fs/promises');
const path = require('path');
const packageJson = require('../package.json');
const { execSync } = require('child_process');

const distPath = path.resolve(process.cwd(), 'lib');

(async () => {
	execSync('tsc');

	delete packageJson.scripts.prepare;

	const packagePromise = fs.writeFile(
		path.resolve(distPath, 'package.json'),
		JSON.stringify(packageJson, null, 4)
	);

	const readmePromise = fs.copyFile(
		path.resolve(process.cwd(), 'README.md'),
		path.resolve(distPath, 'README.md')
	);

	await Promise.all([packagePromise, readmePromise]);
})();
