import fs from 'fs';
import path from 'path';
import { CharterData } from './types'; 

export const loader = async () => {
    const jsonFilePath = path.join(process.cwd(), 'public', 'family_charter.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')) as CharterData;

    return jsonData.items;
};