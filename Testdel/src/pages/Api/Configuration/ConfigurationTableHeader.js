import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { ConfigData } from "./ConfigData";
import GetData from "../../../QAautoMATER/funcLib/getData";
import Matcher from "../../../QAautoMATER/funcLib/matcher";

export var HttpHeaderTable = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'key',
	text: 'Key',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Header key can not be blank'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Header key should not have special character.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.HttpHeaderData, 'key')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Header key can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
}, {
	dataField: 'value',
	text: 'Value',
	headerStyle: { width: '150px' },
}

];

export var AutherizationTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'key',
	text: 'Key',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Autherization key can not be blank'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Autherization key should not have special character.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.AutherizationTableData, 'username')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Autherization key can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
}, {
	dataField: 'username',
	text: 'UserName',
	headerStyle: { width: '150px' }
},
{
	dataField: 'password',
	text: 'Password',
	headerStyle: { width: '150px' },
}

];

export var EnvironmentTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'name',
	text: 'Name',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Name can not be blank'
			});
		}
		var format = /[^A-Za-z0-9-]/ig;
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Name should not have special character.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.EnvNameList, 'name')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Name can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
}

];

export var ComponentURLTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'name',
	text: 'Component',
	headerStyle: { width: '80px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Component can not be blank'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Component should not have special character.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.EnvUrlList, 'name')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Component can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'url',
	text: 'URL',
	headerStyle: { width: '120px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'URL can not be blank'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.EnvUrlList, 'url')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'URL can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
}
];