export const Config = {
	"Project": [],
	"SelectedProject": '',
	"isDemo": false,
	"ErrorMessage": '',
	"backendAPI": 'https://localhost:3001/',
	"remoteBackendAPI": 'https://20.235.248.112:3001/', // http://20.235.248.112:3001/ or https://qaautomaterapi.vercel.app/
	"backendServiceAt": "remote", //local or remote
	"fileSystemtechniques": "api", //local or api,
	"isManualComponentDisplayed":true,
};
export const Users = {
	"userEmail": localStorage.getItem('UserEmail'),
	"isUserAuthenticated": false,
	"isUserEmailValid": false,
	"isUserExistOnServer": false,
	"accounts": [],
	"userSelectedAccount": '',
	"userPassword": '',
	"isUserPasswordValid": false,
	"userToken": localStorage.getItem('Token'),
	"isSuperAdmin" : false,
	"firstName":'',
	"lastName":'',
	"image":'',
	"expiresOn":'',
};