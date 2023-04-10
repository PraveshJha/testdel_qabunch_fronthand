//import * as fs from 'fs-web';
const fs = require('bro-fs');
const rootPath = '../dataHub';
export class FileLib {

    async isDirectoryExist(folderPathAfterDataHub) {
        await fs.init(rootPath);
         return await fs.existsSync(rootPath +'/'+ await folderPathAfterDataHub)
    }

    async createDirectory(folderPathAfterDataHub) {
        try {
            await fs.init(rootPath);
            if (await this.isDirectoryExist(rootPath+'/'+await folderPathAfterDataHub)) {
                return true;
            }
            else {
                await fs.mkdirSync(rootPath +'/'+ await folderPathAfterDataHub, { recursive: true });
                return true;
            }
        }
        catch (error) { }
        return false;
    }

    async isFileExist(folderPathAfterDataHub) {
         await fs.init(rootPath);
         return await fs.existsSync(rootPath +'/'+ await folderPathAfterDataHub);
    }

    async saveFile(folderPathAfterDataHub, fileContent) {
        try {
            var fileData = JSON.stringify(await fileContent);
            var item = await fs.init(rootPath);
            await fs.writeFile(rootPath +'/'+ await folderPathAfterDataHub, await fileData);
            return true;
        }
        catch (error) {
        }
        return false;
    }

    async getListofFolderNameFromPath(folderPathAfterDataHub) {
        try {
            await fs.init(rootPath);
            return await fs.readdirSync(rootPath +'/'+ await folderPathAfterDataHub);
        }
        catch (error) {
        }
        return [];
    }

    async setDataTypeforJsonKey(keyNameToRetrive) {
        if (!isNaN(await keyNameToRetrive)) {
            keyNameToRetrive = Number(await keyNameToRetrive);
        }
        return keyNameToRetrive;
    }

    async deleteFile(folderPathAfterDataHub) {
        try {
            if (await this.isFileExist(await folderPathAfterDataHub)) {
                await fs.unlinkSync(rootPath + await folderPathAfterDataHub)
                return true;
            }
            else {
                return true;
            }
        }
        catch (error) { }
    }

    async renameFile(oldfilePath, newFilePath) {
        try {
            await fs.init(rootPath);
            await fs.renameSync(rootPath + '/'+await oldfilePath, rootPath +'/'+ await newFilePath)
            return true;
        }
        catch (error) { }
        return false
    }

    async readFile(folderPathAfterDataHub) {
        try {
            await fs.init(rootPath);
            var allFileContent = await fs.readFile(rootPath + '/'+await folderPathAfterDataHub);
            return JSON.parse(await allFileContent);
        }
        catch (error) { }
        return false
    }
}
export default new FileLib;
