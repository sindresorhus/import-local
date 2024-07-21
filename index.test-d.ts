import { expectType } from 'tsd';
import importLocal from './index.js';

expectType<boolean | undefined | unknown>(importLocal("import-local"))
