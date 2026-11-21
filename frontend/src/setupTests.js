import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

// jsdom does not provide these, but React Router 7 requires them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
