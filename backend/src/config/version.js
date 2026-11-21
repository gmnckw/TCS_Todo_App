import { readFileSync } from 'node:fs';

const packageJsonUrl = new URL('../../package.json', import.meta.url);
const { version } = JSON.parse(readFileSync(packageJsonUrl, 'utf8'));

/** Major version of the application; used as the API route prefix (/api/v{major}). */
export const APP_MAJOR_VERSION = Number(version.split('.')[0]);
