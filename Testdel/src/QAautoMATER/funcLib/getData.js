import { Config,Users } from '../Config';
import restAPI from './restAPI';
export class GetData {

    //#region [Data getter]

    async jsonArrayGetallKeyValue(jsonArray, keyName) {
        var outputData = [];
        for (let i = 0; i < await jsonArray.length; i++) {
            outputData.push(await jsonArray[i][await keyName]);
        }
        return outputData;
    }

    async getIndexForMatchingKeyValueinJsonArray(jsonArray, keyName, keyValue) {
        var outputData = -1;
        for (let i = 0; i < await jsonArray.length; i++) {
            if (await jsonArray[i][await keyName].toString() === await keyValue.toString()) {
                return i;
            }
        }
        return outputData;
    }

    async jsonObjectGetallKeyPairvalue(jsonArray, keyPair, keyValue) {
        var output = {}
        for (let i = 0; i < await jsonArray.length; i++) {
            output[await jsonArray[i][await keyPair]] = await jsonArray[i][await keyValue];
        }
        return await output;
    }

    async getAllDynamicDataKeyList(provideData, keyNameToSplit) {
        var output = [];
        try {
            provideData = await JSON.stringify(await provideData)
            var dataAfterFirstSplit = await provideData.split(keyNameToSplit);
            for (let i = 0; i < await dataAfterFirstSplit.length; i++) {
                var alldataKey = await dataAfterFirstSplit[i];
                if (alldataKey.includes("}}")) {
                    var dataAfterSecondSplit = await alldataKey.split("}}")[0];
                    await output.push(dataAfterSecondSplit);
                }
            }
        } catch (error) { }
        return await output;

    }

    async getListOfTestIdAndTestName(selectedProject, testingType, componentName) {
        var output = [];
        try {
            var backendAPI = await Config.backendAPI;
            if (await Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(await backendAPI + 'components/' + await componentName + '/project/' + await selectedProject + '/testingtype/' + await testingType, await headers);
            output = await serverResponse['data'];

        } catch (error) {
            Config.ErrorMessage = await error.message;
        }
        return await output;

    }

    async getValueFromJsonUsingNameSpace(responeData, nameSpace) {
        try {
            var providedData = await responeData;
            for (let i = 0; i < await nameSpace.length; i++) {
                var keyName = await this.jsonKetDataType(await nameSpace[i]);
                providedData = await providedData[await keyName];
            }
        }
        catch (error) { }
        return providedData;
    }

    async jsonKetDataType(keyNameToRetrive) {
        if (!isNaN(await keyNameToRetrive)) {
            keyNameToRetrive = Number(await keyNameToRetrive);
        }
        return keyNameToRetrive;
    }

    async createNameSpaceFromExpression(keyName) {
        var output = [];
        if (keyName.includes('[') && keyName.includes(']')) {
            var allKeyName = keyName.split('[');
            for (let keyCounter = 0; keyCounter < allKeyName.length; keyCounter++) {
                var firstPart = allKeyName[keyCounter];
                if (firstPart.trim() !== '') {
                    var onebyOneKey = firstPart.split(']')[0];
                    output.push(onebyOneKey);
                }
            }
        }
        else {
            output.push(keyName);
        }
        return output;
    }

    async getNumberFromString(input) {
        return Number(await input.toString().replace(/[^0-9.]+/gi, ""));
    }

    async getCountForKeySpecificValueInJArray(requestedArray, keyName, keyValue) {
        var outPut = 0;
        for (let i = 0; i < await requestedArray.length; i++) {
            if (await requestedArray[i][keyName] === keyValue) {
                outPut = outPut + 1;
            }
        }
        return outPut;
    }

    async getIndexForKeySpecificValueInJArray(requestedArray, keyName, keyValue) {
        var outPut = [];
        for (let i = 0; i < await requestedArray.length; i++) {
            if (await requestedArray[i][keyName] === keyValue) {
                outPut.push(i);
            }
        }
        return outPut;
    }

    async getIndexForArrayItem(arrayItem, keyValue) {
        var outputData = -1;
        for (let i = 0; i < await arrayItem.length; i++) {
            if (await arrayItem[i].toString().toLowerCase() === await keyValue.toString().toLowerCase()) {
                return i;
            }
        }
        return outputData;
    }

    async getAllKeyValueInJsonArrayFromJsonObject(jObjectItem) {
        var outPut = {};
        var key = [];
        var value = [];
        var allItem = await Object.keys(await jObjectItem);
        for (let i = 0; i < await allItem.length; i++) {
            key.push(await allItem[i]);
            value.push(await jObjectItem[allItem[i]]);
        }
        outPut['key'] = await key;
        outPut['value'] = await value;
        return outPut;
    }

    async isUserAuthenticated() {
        if(await Config.isDemo)
        {
            return true;
        }
        else{
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            try {
                var userEmail = localStorage.getItem('UserEmail');
                var token = localStorage.getItem('Token');
                var headers = { 'Authorization': await token, userEmail: await userEmail };
                var loginDetails = await restAPI.post(await backendAPI + 'usersession', await headers, {});
                loginDetails = await loginDetails['data'];
                if (await loginDetails['isUserAuthenticated']) {
                    if(await loginDetails['isDemoUser'])
                    {
                        Config.isDemo = true;
                    }
                    Users.firstName = await loginDetails['firstName'];
                    Users.lastName = await loginDetails['lastName'];
                    Users.expiresOn = await loginDetails['expiresOn'];
                    Users.userSelectedAccount = await loginDetails['selectedAccount'];
                    Users.isSuperAdmin = await loginDetails['isSuperAdmin'];
                    Config.SelectedProject = await Users.userSelectedAccount;
                    return true;
                }
                else {
                    Users.isUserAuthenticated = false;
                    Config.ErrorMessage = await loginDetails['errorMessage'];
                    return false;
                }
            }
            catch (error) {
                return false;
             }
        }
    }





    //#endregion [Data Getter]
}
export default new GetData;

