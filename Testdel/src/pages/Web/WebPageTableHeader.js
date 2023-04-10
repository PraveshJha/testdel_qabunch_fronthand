import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { textFilter } from 'react-bootstrap-table2-filter';
import { Type } from 'react-bootstrap-table2-editor';
import { ConfigData } from "./Configuration/ConfigData";
import GetData from "../../QAautoMATER/funcLib/getData";
import Matcher from "../../QAautoMATER/funcLib/matcher";
import { TestData } from "./TestData/TestData";
import { TestScriptData } from "./TestScript/TestScriptData";
import { CustomFunctionData } from "./CustomFunction/CustomFunctionData";
import CustomFunctionGetter from "./CustomFunction/CustomFunctionGetter";
import TestScriptGetter from "./TestScript/TestScriptGetter";
export var EnvironmentURLTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'name',
	text: 'Environment',
	headerStyle: { width: '80px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Environment can not be blank'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Environment should not have special character.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.EnvUrlList, 'name')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Environment can not be duplicate.'
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
export var EmulatorTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
},
{
	dataField: 'device',
	text: 'Device',
	headerStyle: { width: '80px' },
	editor: {
		type: Type.SELECT,
		options: [{ label: 'Mobile', value: 'Mobile' }, { label: 'Tablet', value: 'Tablet' }],
	},
},
{
	dataField: 'name',
	text: 'Screen Name',
	headerStyle: { width: '120px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9- ]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Screen Name can not be blank'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Screen Name should not have special character.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.AllEmulatorTableData, 'name')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Screen Name can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
}
// {
// 	dataField: 'width',
// 	text: 'Width',
// 	headerStyle: { width: '60px' },
// 	validator: async (newValue, row, column, done) => {
// 		var format = /[^0-9]/ig;
// 		if (await newValue.trim() === '') {
// 			return done({
// 				valid: false,
// 				message: 'Width can not be blank'
// 			});
// 		}
// 		else if (format.test(await newValue)) {
// 			return done({
// 				valid: false,
// 				message: 'Width can be Number only.'
// 			});
// 		}
// 		else {
// 			return done();
// 		}
// 	}
// },
// {
// 	dataField: 'height',
// 	text: 'Height',
// 	headerStyle: { width: '60px' },
// 	validator: async (newValue, row, column, done) => {
// 		var format = /[^0-9]/ig;
// 		if (await newValue.trim() === '') {
// 			return done({
// 				valid: false,
// 				message: 'Hieght can not be blank'
// 			});
// 		}
// 		else if (format.test(await newValue)) {
// 			return done({
// 				valid: false,
// 				message: 'Hieght can be Number only.'
// 			});
// 		}
// 		else {
// 			return done();
// 		}
// 	}
// }
];
export var TestToolTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
},
{
	dataField: 'tool',
	text: 'Tool',
	headerStyle: { width: '80px' },
	editor: {
		type: Type.SELECT,
		options: [{ label: 'Jira', value: 'Jira' }, { label: 'TestRail', value: 'TestRail' }, { label: 'Zypher', value: 'Zypher' }],
	},
	validator: async (newValue, row, column, done) => {
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.AllTestManagementToolData, 'tool')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Tool name can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'url',
	text: 'Url',
	headerStyle: { width: '130px' },
	validator: async (newValue, row, column, done) => {
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(ConfigData.AllTestManagementToolData, 'url')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Url can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'username',
	text: 'Username',
	headerStyle: { width: '80px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Width can not be blank'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'password',
	text: 'Password',
	headerStyle: { width: '80px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Hieght can not be blank'
			});
		}
		else {
			return done();
		}
	}
}
];
export var CommonTestDataHeaderTable = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '50px' }
}, {
	dataField: 'key',
	text: 'Data Key',
	headerStyle: { width: '300px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Data key can not be blank.'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Data key only accept alphabets.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestData.AllCommonTestData, 'key')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Data key can not be duplicate.'
			});
		}
		else {
			return done();
		}
	},
	filter: textFilter(
		{
			placeholder: 'Search data key',
		}
	)
},
{
	dataField: 'value',
	text: 'Value',
	headerStyle: { width: '400px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Value can not be blank'
			});
		}
		else {
			return done();
		}
	},
	filter: textFilter(
		{
			placeholder: 'Search data',
		}
	)
}
];
export var ORTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '60px' }
}, {
	dataField: 'name',
	text: 'Name',
	headerStyle: { width: '300px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Name can not be blank.'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Name only accept alphabets.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestData.AllCommonTestData, 'key')
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
	},
	filter: textFilter(
		{
			placeholder: 'Search By Name',
		}
	)
},
{
	dataField: 'locator',
	text: 'Locator',
	headerStyle: { width: '150px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Locator can not be blank'
			});
		}
		else {
			return done();
		}
	},
	editor: {
		type: Type.SELECT,
		options: [{ label: 'Id', value: 'Id' }, { label: 'Name', value: 'Name' }, { label: 'Xpath', value: 'Xpath' }, { label: 'LinkText', value: 'LinkText' }, { label: 'PartialLinkText', value: 'PartialLinkText' }, { label: 'Class', value: 'Class' }, { label: 'Tag', value: 'Tag' }, { label: 'CssSelector', value: 'CssSelector' }],
	},
	filter: textFilter(
		{
			placeholder: 'Search By Locator',
		}
	)
},
{
	dataField: 'locatorproperty',
	text: 'Locator Property',
	headerStyle: { width: '350px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Locator Property can not be blank'
			});
		}
		else {
			return done();
		}
	},
	filter: textFilter(
		{
			placeholder: 'Search By Locator Property',
		}
	)
},
{
	dataField: 'alternatexpath',
	text: 'Alternate Xpath',
	headerStyle: { width: '200px' },
	validator: async (newValue, row, column, done) => {
		return done();
	},
	hidden: true
}
];
export var TestScriptTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '60px' }
}, {
	dataField: 'stepdefinition',
	text: 'Step Definition*',
	headerStyle: { width: '300px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Step Definition can not be blank.'
			});
		}
		else {
			return done();
		}
	},
},
{
	dataField: 'action',
	text: 'Action*',
	headerStyle: { width: '200px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Action can not be blank'
			});
		}
		else {
			return done();
		}
	},
	editor: {
		type: Type.SELECT,
		getOptions: (setOptions) => {
			setTimeout(() => {
				setOptions(CustomFunctionData.AllSeleniumMethod);
			}, 0);
		}
	},
},
{
	dataField: 'element',
	text: 'Web Element',
	headerStyle: { width: '200px' },
	validator: async (newValue, row, column, done) => {
		if (row.stepdefinition.toString().trim() === '' || row.action.toString().trim() === '') {
			return done({
				valid: false,
				message: 'Please add step definition and action'
			});
		}
		else {
			return done();
		}
	},
},
{
	dataField: 'value',
	text: 'Value',
	headerStyle: { width: '200px' },
	validator: async (newValue, row, column, done) => {
		return done();
	},
},
{
	dataField: 'isreporting',
	text: 'IsReportingRequired',
	headerStyle: { width: '200px' },
	validator: async (newValue, row, column, done) => {
		return done();
	},
	editor: {
		type: Type.SELECT,
		options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }],
	}
},
];

export var TestScriptTestDataTableHeader = [
	{}
];
export var DependentCustomFunctionHeader = [
	{
		dataField: 'id',
		text: '#',
		headerStyle: { width: '40px' }
	}, {
		dataField: 'customfunction',
		text: 'Page Function',
		headerStyle: { width: '250px' },
		editor: {
			type: Type.SELECT,
			getOptions: (setOptions) => {
				setTimeout(() => {
					setOptions(TestScriptData.PageFunctionNameListWithLabelandValue);
				}, 0);
			}
		},
		validator: async (newValue, row, column, done) => {
			if (newValue === '') {
				return done({
					valid: false,
					message: 'Page Function can not be blank'
				});
			}
			else {
				var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestScriptData.DependentCustomFunction, 'customfunction')
				var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
				if (isPresent) {
					return done({
						valid: false,
						message: 'Page Function can not be duplicate.'
					});
				}
				else {
					var allAgrsList = await CustomFunctionGetter.getCustomFunctionArguments(newValue);
					if(await allAgrsList.length>0)
					{
						row.parameter= await allAgrsList.toString();
					}
					return done();
				}
			}
		}
	},
	{
		dataField: 'parameter',
		text: 'Parameter',
		headerStyle: { width: '210px' },
	}
	// {
	// 	dataField: 'seq',
	// 	text: 'Seq',
	// 	headerStyle: { width: '40px' },
	// 	validator: async (newValue, row, column, done) => {
	// 		var format = /[^1-9]/ig;
	// 		if (format.test(await newValue)) {
	// 			return done({
	// 				valid: false,
	// 				message: 'Only integer value allowed'
	// 			});
	// 		}
	// 		if (newValue.trim() === '') {
	// 			return done({
	// 				valid: false,
	// 				message: 'Seq can not be null'
	// 			});
	// 		}
	// 		if (row.customfunction.toString().trim() === '') {
	// 			return done({
	// 				valid: false,
	// 				message: 'Please select Custom Function first'
	// 			});
	// 		}
	// 		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestScriptData.DependentCustomFunction, 'seq')
	// 		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
	// 		if (isPresent) {
	// 			return done({
	// 				valid: false,
	// 				message: 'Seq can not be duplicate.'
	// 			});
	// 		}
	// 		var maxSequence = await TestScriptData.DependentCustomFunction.length;
	// 		if (newValue > maxSequence) {
	// 			return done({
	// 				valid: false,
	// 				message: 'As per your data selection Maximum sequence can be ' + maxSequence
	// 			});
	// 		}
	// 		else {
	// 			return done();
	// 		}
	// 	}
	// }
];
export var CustomFunctionDependentHeader = [
	{
		dataField: 'id',
		text: '#',
		headerStyle: { width: '40px' }
	}, {
		dataField: 'customfunction',
		text: 'Page Function',
		headerStyle: { width: '250px' },
		editor: {
			type: Type.SELECT,
			getOptions: (setOptions) => {
				setTimeout(() => {
					setOptions(CustomFunctionData.CustomFunctionListWithLabelandValue);
				}, 0);
			}
		},
		validator: async (newValue, row, column, done) => {
			if (newValue === '') {
				return done({
					valid: false,
					message: 'Custom Function can not be blank'
				});
			}
			else {
				var allColumnValue = await GetData.jsonArrayGetallKeyValue(CustomFunctionData.DependentCustomFunction, 'customfunction')
				var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
				if (isPresent) {
					return done({
						valid: false,
						message: 'Custom Function can not be duplicate.'
					});
				}
				else {
					var allAgrsList = await CustomFunctionGetter.getCustomFunctionArguments(newValue);
					if(await allAgrsList.length>0)
					{
						row.parameter= await allAgrsList.toString();
					}
					return done();
				}
			}
		}
	},
	{
		dataField: 'parameter',
		text: 'Parameter',
		headerStyle: { width: '210px' },
	}
	// {
	// 	dataField: 'seq',
	// 	text: 'Seq',
	// 	headerStyle: { width: '40px' },
	// 	validator: async (newValue, row, column, done) => {
	// 		var format = /[^1-9]/ig;
	// 		if (format.test(await newValue)) {
	// 			return done({
	// 				valid: false,
	// 				message: 'Only integer value allowed'
	// 			});
	// 		}
	// 		if (newValue.trim() === '') {
	// 			return done({
	// 				valid: false,
	// 				message: 'Seq can not be null'
	// 			});
	// 		}
	// 		if (row.customfunction.toString().trim() === '') {
	// 			return done({
	// 				valid: false,
	// 				message: 'Please select Custom Function first'
	// 			});
	// 		}
	// 		var allColumnValue = await GetData.jsonArrayGetallKeyValue(CustomFunctionData.DependentCustomFunction, 'seq')
	// 		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
	// 		if (isPresent) {
	// 			return done({
	// 				valid: false,
	// 				message: 'Seq can not be duplicate.'
	// 			});
	// 		}
	// 		var maxSequence = await CustomFunctionData.ListOfCustomFunction.length;
	// 		if (newValue > maxSequence) {
	// 			return done({
	// 				valid: false,
	// 				message: 'As per your data selection Maximum sequence can be ' + maxSequence
	// 			});
	// 		}
	// 		else {
	// 			return done();
	// 		}
	// 	}
	// }
];

