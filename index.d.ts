/**
Let a globally installed package use a locally installed version of itself if available

@param __filename - The name of the package.

@example
```js
import importLocal from 'import-local';

if (importLocal(import.meta.url)) {
	console.log('Using local version of this package');
} else {
	// Code for both global and local version here…
}
```
*/
export default function importLocal(__filename: string): boolean | undefined | unknown;
