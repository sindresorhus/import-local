'use strict';
const path = require('path');
const findUp = require('find-up');
const resolveCwd = require('resolve-cwd');
const pkgDir = require('pkg-dir');

module.exports = filename => {
	const globalDir = pkgDir.sync(path.dirname(filename));
	const relativePath = path.relative(globalDir, filename);
	const pkg = require(path.join(globalDir, 'package.json'));
	const localFile = resolveCwd.silent(path.join(pkg.name, relativePath));
	const filenameIsLocal = findUp.sync(path.join(process.cwd(), 'node_modules'), {cwd: globalDir}) !== null;

	return localFile && !filenameIsLocal && require(localFile);
};
