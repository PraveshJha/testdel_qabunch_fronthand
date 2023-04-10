export class SetData {

    //#region [Data getter]

    async setJsonKeyValue(dataObject, allKeys, valueToUpdate) {
        var updatedPayload = await dataObject;
        var allJsonObject = [];
        for (let keycounter = 0; keycounter < allKeys.length - 1; keycounter++) {
            var onebyOneJobject = {};
            var keyName = await this.setDataTypeforJsonKey(await allKeys[keycounter]);
            onebyOneJobject[await keyName] = await dataObject[await keyName];
            allJsonObject.push(onebyOneJobject);
            dataObject = await dataObject[await keyName];
        }
        var onebyOneJobject = {};
        onebyOneJobject[await this.setDataTypeforJsonKey(allKeys[allKeys.length - 1])] = await valueToUpdate;
        allJsonObject.push(onebyOneJobject);
        var allKeysLength = allJsonObject.length;
        for (let counter = 0; counter < allKeysLength - 1; counter++) {
            var lastCounter = allKeysLength - (counter + 1);
            var parentLastCounter = lastCounter - 1;
            var lastKeyName = await this.setDataTypeforJsonKey(await allKeys[lastCounter]);
            var parentKeyObjectName = await this.setDataTypeforJsonKey(await allKeys[parentLastCounter]);
            allJsonObject[parentLastCounter][parentKeyObjectName][lastKeyName] = await allJsonObject[lastCounter][lastKeyName];
        }
        var parentKey = await this.setDataTypeforJsonKey(await allKeys[0]);
        updatedPayload[parentKey] = await allJsonObject[0][parentKey]
        return await updatedPayload;
    }

    async setDataTypeforJsonKey(keyNameToRetrive) {
        if (!isNaN(await keyNameToRetrive)) {
          keyNameToRetrive = Number(await keyNameToRetrive);
        }
        return keyNameToRetrive;
    }

    async addNewKeyInExistingJsonArray(jsonArray,newKeyName,newKeyValue='') {
        for(let i=0;i<await jsonArray.length;i++)
        {
            jsonArray[i][newKeyName]=newKeyValue;
        }
        return await jsonArray;
    }


    //#endregion [Data Getter]
}
export default new SetData;

