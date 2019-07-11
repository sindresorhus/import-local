import path from 'path';
import test from 'ava';
import execa from 'execa';
import cpy from 'cpy';
import del from 'del';

test.before(async () => {
	await execa('npm', ['link']);
});

test.after(async () => {
	await execa('npm', ['unlink']);
});

test('local', async t => {
	await cpy(
		['package.json', 'index.js', 'fixtures/cli.js'],
		path.join(__dirname, 'fixtures/local/node_modules/import-local'),
		{parents: true}
	);

	const {stdout} = await execa('import-local-fixture', {
		preferLocal: false,
		cwd: path.join(__dirname, 'fixtures/local')
	});
	t.is(stdout, 'local');

	await del(path.join(__dirname, 'fixtures/local/node_modules'));
});

test('invoking global prefers local', async t => {
	await cpy(
		['package.json', 'index.js'],
		path.join(__dirname, 'fixtures/prefer-local/node_modules/import-local'),
		{parents: true}
	);

	const {stdout} = await execa(
		'node',
		[path.join(__dirname, 'fixtures/prefer-local/cli.js')],
		{
			preferLocal: false,
			cwd: path.join(__dirname, 'fixtures/prefer-local/nested')
		}
	);
	t.is(stdout, 'local');

	await del(path.join(__dirname, 'fixtures/prefer-local/node_modules'));
});

test('global', async t => {
	const {stdout} = await execa('import-local-fixture', {
		preferLocal: false,
		cwd: path.join(__dirname, 'fixtures/global')
	});
	t.is(stdout, '');
});

test('treats aliased package as local installation', async t => {
	await cpy(
		['package.json', 'index.js'],
		path.join(__dirname, 'fixtures/yarn-alias/node_modules/import-local'),
		{parents: true}
	);
	const {stdout} = await execa(
		'node',
		[path.join(__dirname, 'fixtures/yarn-alias/index.js')],
		{
			preferLocal: false,
			cwd: path.join(__dirname, 'fixtures/yarn-alias')
		}
	);
	t.is(stdout, '');
});

// https://github.com/sindresorhus/import-local/pull/5
test('import from node_modules in a parent directory', async t => {
	await cpy(
		['package.json', 'index.js', 'fixtures/cli.js'],
		path.join(__dirname, 'fixtures/5-nested/node_modules/import-local'),
		{parents: true}
	);
	const {stdout} = await execa(
		'node',
		['index.js'],
		{
			preferLocal: false,
			cwd: path.join(__dirname, 'fixtures/5-nested/foo')
		}
	);
	t.is(stdout, 'Called');
	await del(path.join(__dirname, 'fixtures/5-nested/node_modules/import-local'));
});
