import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function downloadImage(url, savePath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream', 
        });

        // Ensure the directory exists
        const directory = path.dirname(savePath);
        fs.mkdirSync(directory, { recursive: true });

        // Pipe the data into a writable file stream
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        // Return a promise to know when the writing is done
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading the image:', error);
        throw error;
    }
}