import { ConfigData } from './ConfigData';
import { Config,Users } from '../../../QAautoMATER/Config';
import GetData from '../../../QAautoMATER/funcLib/getData';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import FileLib from '../../../QAautoMATER/funcLib/fileLib';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class ConfigGetter {

    async uiConfigPageLoadData() {

        var allconfigData = null;
        if (!await Config.isDemo) {
            allconfigData = await this.readConfigurationFile('Web');
            ConfigData.AllConfigData = await allconfigData;
        }
        await this.updateEnvironmentTableData(await allconfigData);
        await this.updateDefaultConfigurationData(await allconfigData);
        await this.updateEmulatorTableData(await allconfigData);
        await this.updateDefaultScreen(await allconfigData);
        await this.updateToolsTableData(await allconfigData);
        await this.setAllCapability(ConfigData.ExecutionServer);

    }
    /////****** Default Configuration Getter *******************************************************

    async updateDefaultConfigurationData(allconfigData) {
        var dataChoice =''
        if (Config.isDemo) {
            ConfigData.EnvironmentList = await ['Dev', 'QA'];
            ConfigData.DefaultSelectedEnvironment = 'Dev';
            ConfigData.DefaultReportTrailCount = await DataGeneratorUtility.getNumberFromRange(40, 70);
            ConfigData.DefaultSaveDaysToReport = await DataGeneratorUtility.getNumberFromRange(20, 30);
            ConfigData.DefaultSaveDaysToDevelopment = await DataGeneratorUtility.getNumberFromRange(10, 30);
        }
        else {
            if (ConfigData.EnvUrlList.length > 0) {
                ConfigData.EnvironmentList = await GetData.jsonArrayGetallKeyValue(await ConfigData.EnvUrlList, 'name');
                dataChoice = await allconfigData['DefaultSelectedEnvironment'];
                if (dataChoice === undefined) {
                    ConfigData.DefaultSelectedEnvironment = ConfigData.EnvironmentList[0];
                    ConfigData.CleanUpEnvironment= await ConfigData.EnvironmentList[0];
                }
                else {
                    ConfigData.DefaultSelectedEnvironment = await dataChoice;
                    ConfigData.CleanUpEnvironment= await dataChoice;
                }
            }
            dataChoice = await allconfigData['DefaultReportTrailCount'];
            if (dataChoice === undefined) {
                ConfigData.DefaultReportTrailCount = 0;
            }
            else {
                ConfigData.DefaultReportTrailCount = Number(await dataChoice);
            }
            dataChoice = await allconfigData['DefaultSaveDaysToReport'];
            if (dataChoice === undefined) {
                ConfigData.DefaultSaveDaysToReport = 0;
            }
            else {
                ConfigData.DefaultSaveDaysToReport = Number(await dataChoice);
            }
            dataChoice = await allconfigData['DefaultSaveDaysToDevelopment'];
            if (dataChoice === undefined) {
                ConfigData.DefaultSaveDaysToDevelopment = 0;
            }
            else {
                ConfigData.DefaultSaveDaysToDevelopment = Number(await dataChoice);
            }

        }
    }

    /////****** Configuration Getter ******************************************************************

    async updateEnvironmentTableData(allconfigData) {
        if (Config.isDemo) {
            ConfigData.EnvUrlList = [{ id: 1, name: 'QA', url: 'https://www.google.com/' }, { id: 2, name: 'Dev', url: 'https://www.selenium.dev/' }]
        }
        else {
            if (await allconfigData['Environment'] === undefined) {
                ConfigData.EnvUrlList = [];
            }
            else {
                ConfigData.EnvUrlList = await allconfigData['Environment'];
            }
        }
    }

    //**** Env Name List *********************************************************

    async updateRowIdAfterDelete(tableData, id) {
        tableData = await tableData.filter(m => m.id !== id);
        for (let i = 0; i < await tableData.length; i++) {
            tableData[i]['id'] = i + 1;;

        }
        return await tableData;
    }

    async readConfigurationFile(testingType = 'Api') {
        if (Config.fileSystemtechniques === 'local') {
            return await FileLib.readFile(selectedProject + '/' + testingType + '/Configuration.json');
        }
        else if (await Config.fileSystemtechniques === 'api') {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = {'Authorization':await Users.userToken,userEmail:await Users.userEmail};
            var serverResponse = await restAPI.get(backendAPI + 'configuration/project/' + selectedProject + '/testingtype/' + testingType,await headers);
            return await serverResponse['data'];
        }
    }

    async updateEmulatorTableData(allconfigData) {
        if (Config.isDemo) {
            ConfigData.AllEmulatorTableData = [{ id: 1, device: 'Mobile', name: 'iPhone 12 Pro', width: '390', height: '944' }, { id: 2, device: 'Tablet', name: 'iPad Air', width: '820', height: '1180' }]
            ConfigData.AllMobileEmulator = ['iPhone 12 Pro', 'Pixel 5'];
            ConfigData.AllTabletEmulator = ['iPad Air', 'iPad Mini'];
        }
        else {
            if (await allconfigData['Emulator'] === undefined) {
                ConfigData.AllEmulatorTableData = [];
                ConfigData.AllMobileEmulator = [];
                ConfigData.AllTabletEmulator = [];
            }
            else {
                var allMobileDevice = [];
                var allTabletDevice = [];
                ConfigData.AllEmulatorTableData = await allconfigData['Emulator'];
                // Set Mobile and Tablet Data
                for (let i = 0; i < await ConfigData.AllEmulatorTableData.length; i++) {
                    var deviceType = await ConfigData.AllEmulatorTableData[i]['device'];
                    switch (deviceType.toString()) {
                        case "Mobile":
                            allMobileDevice.push(await ConfigData.AllEmulatorTableData[i]['name']);
                            break;
                        case "Tablet":
                            allTabletDevice.push(await ConfigData.AllEmulatorTableData[i]['name']);
                            break;
                        default:
                            break;
                    }
                }
                ConfigData.AllMobileEmulator = await allMobileDevice;
                ConfigData.AllTabletEmulator = await allTabletDevice;
            }
        }
    }

    async updateDefaultScreen(allconfigData) {
        if (Config.isDemo) {
            ConfigData.DefaultExecutionPlatform = 'Desktop';
            ConfigData.DefaultBrowser = 'Chrome';
            ConfigData.DefaultMobileEmulator = 'iPhone 12 Pro';
            ConfigData.DefaultTabletEmulator = 'iPad Air';
        }
        else {
            var platform = await allconfigData['DefaultExecutionPlatform'];
            if (platform === undefined) {
                if(ConfigData.AllExecutionPlatform.length>0)
                {
                    ConfigData.DefaultExecutionPlatform = await ConfigData.AllExecutionPlatform[0];
                }
            }
            else {
                ConfigData.DefaultExecutionPlatform = await platform;
            }
            var browser = await allconfigData['DefaultBrowser'];
            if (browser === undefined) {
                if(ConfigData.AllBrowserList.length>0)
                {
                    ConfigData.DefaultBrowser = await ConfigData.AllBrowserList[0];
                }
            }
            else {
                ConfigData.DefaultBrowser = await browser;
            }
            var mobileDevice = await allconfigData['DefaultMobileEmulator'];
            if (mobileDevice === undefined) {
                if(ConfigData.AllMobileEmulator.length>0)
                {
                    ConfigData.DefaultMobileEmulator = await ConfigData.AllMobileEmulator[0];
                }
            }
            else {
                if(ConfigData.AllMobileEmulator.length>0)
                {
                    ConfigData.DefaultMobileEmulator = await mobileDevice;
                }
                
            }
            var tabletDevice = await allconfigData['DefaultTabletEmulator'];
            if (tabletDevice === undefined) {
                if(ConfigData.AllTabletEmulator.length>0)
                {
                    ConfigData.DefaultTabletEmulator = await ConfigData.AllTabletEmulator[0];
                }
            }
            else {
                if(ConfigData.AllTabletEmulator.length>0)
                {
                    ConfigData.DefaultTabletEmulator = await tabletDevice;
                }
                
            }
        }

    }

    async updateToolsTableData(allconfigData)
    {
       if(Config.isDemo)
       {
        ConfigData.AllTestManagementToolData =[{id:1,tool:'Jira',url:'https://jira.qaautomater.com',username:'QAautoMATER',password:'iampasswordKey'}]
       }
       else{
        var toolsData = await allconfigData['Tools'];
        if(toolsData ===undefined)
        {
            ConfigData.AllTestManagementToolData =[]
        }
        else{
            ConfigData.AllTestManagementToolData =await toolsData;
        }
       }
    }

    async isValidUrl(urlString) {
        var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
          '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
        return !!urlPattern.test(urlString);
    }

    async setAllCapability(capFor)
    {
      var allCapsforAllPlatform = await ConfigData.AllConfigData['ExecutionCapabilities'][await capFor];
      if(allCapsforAllPlatform ===undefined)
      {
        var baseCapabilitys = await ConfigData.AllCapabilities;
        baseCapabilitys['Desktop']['Chrome']= await ConfigData.CommonCapability;
        baseCapabilitys['Desktop']['Firefox']= await ConfigData.CommonCapability;
        baseCapabilitys['Desktop']['Edge']= await ConfigData.CommonCapability;
        baseCapabilitys['Desktop']['Safari']= await ConfigData.CommonCapability;
        baseCapabilitys['Mobile']= await ConfigData.CommonCapability;
        baseCapabilitys['Tablet']= await ConfigData.CommonCapability;
        ConfigData.AllCapabilities = await baseCapabilitys;
        ConfigData.ServerUrl='';
      }
      else{
        ConfigData.ServerUrl = await allCapsforAllPlatform['HubUrl'];
        ConfigData.AllCapabilities = await allCapsforAllPlatform['Capabilities'];
      }
    
    }

}
export default new ConfigGetter();

