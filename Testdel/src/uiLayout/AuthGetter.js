import { Config, Users } from '../QAautoMATER/Config';
import restAPI from '../QAautoMATER/funcLib/restAPI';
export class AuthGetter {

    async isUserExistOnServer() {
        if (Config.isDemo) {
            Users.isUserExistOnServer = true;
            Users.accounts = ['Spacecraft'];
            Users.userSelectedAccount = Users.accounts[0];
            Config.SelectedProject = Users.userSelectedAccount;
            Config.Project = Users.accounts;
            return true;
        }
        else {
            try {
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var serverResponse = await restAPI.get(backendApi + 'users/' + Users.userEmail, {});
                var userDetails = await serverResponse['data'];
                if (await userDetails['isUserExistonServer']) {
                    Users.isUserExistOnServer = true;
                    Users.accounts = await userDetails['accounts'];
                    Users.userSelectedAccount = Users.accounts[0];
                    Config.SelectedProject = Users.userSelectedAccount;
                    Config.Project = Users.accounts;
                    Users.expiresOn = await userDetails['expiresOn'];
                    return true;
                }
                else {
                    if(await userDetails['errorMessage'] === undefined)
                    {
                        var backendServiceUrl = Config.backendAPI;
                        if(Config.backendServiceAt ==='remote')
                        {
                            backendServiceUrl = Config.remoteBackendAPI;
                        }
                         userDetails['errorMessage'] = "Your Browser is blocking application which has Self-Signed Certificate , Please open  "+await backendServiceUrl+" url in new tab and Proceed."
                    }
                    Users.isUserExistOnServer = false;
                    Config.ErrorMessage = await userDetails['errorMessage'];
                    return false;
                }
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }
    }

    async authenticateUser() {
        if (await Config.isDemo) {
            Users.isUserAuthenticated = true;
            return true;
        }
        else {
            var backendApi = await Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var userData = { userEmail: Users.userEmail, password: await Users.userPassword, account: await Users.userSelectedAccount }
            var userDetails = await restAPI.post(await backendApi + 'users', {}, await userData);
            userDetails = await userDetails['data'];
            if (await userDetails['isUserAuthenticated']) {
                await localStorage.setItem("UserEmail", await Users.userEmail);
                await localStorage.setItem("Token", 'Bearer ' + await userDetails['token']);
                if (await userDetails['isDemoUser']) {
                    Config.isDemo = true;
                }
                Users.isUserAuthenticated = true;
                Users.userToken = 'Bearer ' + await userDetails['token'];
                Users.firstName = await userDetails['firstName'];
                Users.lastName = await userDetails['lastName'];
                return true;
            }
            else {
                Users.isUserAuthenticated = false;
                return false;
            }
        }
    }
}
export default new AuthGetter();

