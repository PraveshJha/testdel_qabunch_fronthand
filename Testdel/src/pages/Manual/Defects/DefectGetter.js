import { DefectData } from './DefectData';
import { Config, Users } from '../../../QAautoMATER/Config';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
const selectedProject = Config.SelectedProject;
const selectedUserEmail = Users.userEmail;

export class DefectGetter {

    async loadDefectPage() {
        await ConfigGetter.manualConfigPageLoad();
        DefectData.ListOfTestCycle = await ConfigData.ListOfTestCycle;
        DefectData.TestCaseTestCycle = await ConfigData.CurrentTestCycle;
        var placeHolderTreeData = await ConfigGetter.getPlaceHolderTreeData();
        DefectData.FolderTreeData = await placeHolderTreeData;
        try {
            await localStorage.removeItem('testId');
            await localStorage.removeItem(await localStorage.removeItem('testId'));
        }
        catch (error) { }
        //* commenting line bacause azure server have multiple client and sharing is not require
        var allUsers = await ConfigGetter.getListOfUsers();
         DefectData.ListOfAssignedUsers =[];
        for(let i=0;i<await allUsers.length;i++)
        {
            var datatoPush = {value:await allUsers[i],label:allUsers[i]};
            DefectData.ListOfAssignedUsers.push(await datatoPush);
        }

        //temp line need to be remove
        // DefectData.ListOfAssignedUsers = [];
        // DefectData.ListOfAssignedUsers.push({ value: await Users.userEmail, label: await Users.userEmail });

        //*** */

        if (await localStorage.getItem('defectDetails') !== undefined && await localStorage.getItem('defectDetails') !== null) {
            var defectDetails = await JSON.parse(await localStorage.getItem('defectDetails'));
            if (await defectDetails.length > 0) {
                var lastStep = await defectDetails[await defectDetails.length - 1]['stepdefinition'];
                var exceptionMessage = await defectDetails[await defectDetails.length - 1]['testdata'];
                var imageData = await defectDetails[await defectDetails.length - 1]['screenshot'];
                DefectData.DefectTitle = await lastStep;

                //create Steps
                var defectStepsToReproduceInput = "";
                var envrinmnet = await localStorage.getItem('defectEnvironment');
                var envDetailsLine = "<p><strong>Environment</strong> : " + envrinmnet + "</p><p><strong>Steps </strong></p>";
                var intialStep = "<li>Launch application as per provided environment</li>"
                var allDynamicSteps = "";
                for (let i = 0; i < await defectDetails.length - 1; i++) {
                    var stepDef = await defectDetails[await i]['stepdefinition'];
                    var testData = await defectDetails[await i]['testdata'];
                    if (await testData !== '' && await testData !== undefined) {
                        stepDef = await stepDef + ' (' + await testData + ')'
                    }
                    allDynamicSteps = await allDynamicSteps + "<li>" + await stepDef + "</li>"
                }
                var lstHtmlSteps = "<li>" + await lastStep + "</li>"
                var allHtmlSteps = "<ol>" + await intialStep + await allDynamicSteps + await lstHtmlSteps + "</ol>"
                var exceptionMessage = "<p><strong>Actual behaviour</strong></p><p>" + await exceptionMessage + "</p>"
                var screenshot = "<p><strong>Screenshot</strong></p><p><img src=\"data:image/png;base64," + await imageData + "\"></p>"
                defectStepsToReproduceInput = "<p>" + await envDetailsLine + await allHtmlSteps + await exceptionMessage + await screenshot + "</p>"
                DefectData.DefectStepsToReproduce = await defectStepsToReproduceInput;
            }

        }
        try {
            await localStorage.removeItem('defectDetails');
        }
        catch (error) { }

    }

    async addNewDefect() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            testBody['defectName'] = await DefectData.DefectTitle;
            testBody['placeHolder'] = await DefectData.PlaceHolderName;
            testBody['priority'] = await DefectData.DefectPriority;
            testBody['severity'] = await DefectData.DefectSeverity;
            testBody['status'] = await DefectData.DefectStatus;
            testBody['assignedTo'] = await DefectData.DefectAssignedTo;
            testBody['testCycle'] = await DefectData.TestCaseTestCycle;
            testBody['testId'] = await DefectData.SelectedTestId;
            testBody['defectSteps'] = await DefectData.DefectStepsToReproduce;
            testBody['createdBy'] = await Users.userEmail;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'defect/project/' + selectedProject + '/createnewdefect', await headers, await testBody);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }
    }

    async createNewPlaceHolderForTestCase() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            testBody['newPlaceHolderName'] = await DefectData.NewPlaceHolderName.trim();
            testBody['relativePath'] = await DefectData.SelectedPlaceHolderPath.trim();
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'manualtestcase/project/' + selectedProject + '/addnewtesttree', await headers, await testBody);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            if (await saveFile['isFileSaved']) {
                DefectData.FolderTreeData = await saveFile['testTreeData'];
            }
            return await saveFile['isFileSaved'];
        }
    }

    async isPlaceHolderAlreadyExist() {
        var folderTreeData = await DefectData.FolderTreeData;
        var actualTReeData = await folderTreeData;
        var relativePath = await DefectData.SelectedPlaceHolderPath;
        var folderNameToAdd = await DefectData.NewPlaceHolderName;
        var allChildNodes = await relativePath.split('/');
        for (let i = 0; i < await allChildNodes.length; i++) {
            var keyNameToFind = await allChildNodes[i];
            for (let j = 0; j < await actualTReeData.length; j++) {
                var keyNameData = await actualTReeData[j]['key'];
                if (await keyNameData.toLowerCase().trim() === keyNameToFind.toLocaleLowerCase().trim()) {
                    actualTReeData = await actualTReeData[j]['nodes'];
                    break;
                }
            }
        }
        for (let i = 0; i < await actualTReeData.length; i++) {
            if (await folderNameToAdd.toLowerCase().trim() === await actualTReeData[i]['key'].toLowerCase().trim()) {
                return true;
            }
        }
        return false;
    }

    async getAllTestIDfromPath(relativePath) {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return [{ value: 'QB-1', label: 'QB-1' }, { value: 'QB-2', label: 'QB-2' }];
        }
        else {
            try {
                var testBody = {}
                testBody['componentPath'] = await relativePath;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'manualtestcase/project/' + selectedProject + '/getalltestid', await headers, await testBody);
                var alltestDetails = await serverResponse['data'];
                return await alltestDetails;
            }
            catch (error) {
                return [];
            }
        }
    }

    async getAllDefectFromPath(relativePath) {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return [{ id: 1, defectid: 'DF-1', title: 'My dummy defect', component: 'Landing Page', priority: 'Medium', severity: 'Low', status: 'Open', assignto: 'dummyuser@test.com', cycle: 'Sprint 12.0', testid: '', createdby: 'Pravesh' }];
        }
        else {
            try {
                var testBody = {}
                testBody['componentPath'] = await relativePath;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'defect/project/' + selectedProject + '/getalldefects', await headers, await testBody);
                var alltestDetails = await serverResponse['data'];
                return await alltestDetails;
            }
            catch (error) {
                return [];
            }
        }
    }

    async saveTestComments(testComment) {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            testBody['testComment'] = await testComment;
            var testCasePath = DefectData.UpdatedTestPlaceHolder + '/' + DefectData.UpdatedTestCycle + '/' + DefectData.DefectId;
            testBody['testPath'] = await testCasePath;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'defect/project/' + selectedProject + '/adddefectcomment', await headers, await testBody);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }
    }

    async getDefectIdDetails() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            var testCasePath = DefectData.UpdatedTestPlaceHolder + '/' + DefectData.UpdatedTestCycle + '/' + DefectData.DefectId;
            testBody['testPath'] = await testCasePath;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'defect/project/' + selectedProject + '/getdefectiddetails', await headers, await testBody);
            var defectDetails = await serverResponse['data'];
            return await defectDetails;
        }
    }

    async updateDefectField(history) {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            var testCasePath = DefectData.UpdatedTestPlaceHolder + '/' + DefectData.UpdatedTestCycle + '/' + DefectData.DefectId;
            testBody['testPath'] = await testCasePath;
            testBody['defectName'] = await DefectData.UpdatedDefectTitle;
            testBody['priority'] = await DefectData.UpdatedTestPriority;
            testBody['severity'] = await DefectData.UpdateddefectSeverity;
            testBody['status'] = await DefectData.UpdatedDefectStatus;
            testBody['assignedTo'] = await DefectData.DefectNewAssignee;
            testBody['testId'] = await DefectData.UpdatedTestID;
            testBody['defectSteps'] = await DefectData.UpdatedDefectSteps;
            testBody['history'] = await history;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'defect/project/' + selectedProject + '/updatedefect', await headers, await testBody);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }
    }

    async deleteDefect() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            var testCasePath = DefectData.UpdatedTestPlaceHolder + '/' + DefectData.UpdatedTestCycle + '/' + DefectData.DefectId;
            testBody['testPath'] = await testCasePath;
            testBody['defectId'] = await DefectData.DefectId;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'defect/project/' + selectedProject + '/deletedefect', await headers, await testBody);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileDeleted'];
        }
    }

    async getTestAutomationSteps() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testBody = {}
            var testCasePath = DefectData.UpdatedTestPlaceHolder + '/' + DefectData.UpdatedTestCycle + '/' + DefectData.TestId;
            testBody['testName'] = await DefectData.UpdatedTestName;
            testBody['testSteps'] = await DefectData.UpdatedTestSteps;
            testBody['testPrecondition'] = await DefectData.UpdatedTestPrecondition;
            testBody['testExpectedResult'] = await DefectData.UpdatedExpectedResults;
            testBody['testId'] = await DefectData.TestId;
            testBody['placeHolder'] = await testCasePath;
            //Remove Key
            try {
                await localStorage.removeItem('testId');
                await localStorage.removeItem(await DefectData.TestId);
            }
            catch (error) { }
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(await backendApi + 'manualtestcase/project/' + selectedProject + '/getautomationsteps', await headers, await testBody);
            var testCaseDetails = await serverResponse['data'];
            await localStorage.setItem('testId', await DefectData.TestId);
            await localStorage.setItem(DefectData.TestId, JSON.stringify(await testCaseDetails));
            return await testCaseDetails;
        }
    }

}
export default new DefectGetter;

