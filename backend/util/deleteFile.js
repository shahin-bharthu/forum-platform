import { unlink } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const deleteFile = (relativePath) => {
    const absolutePath = resolve(join(__dirname, relativePath));

    unlink(absolutePath, (err) => {
        if (err) {
            throw err;
        }
    });    
};

export default deleteFile;