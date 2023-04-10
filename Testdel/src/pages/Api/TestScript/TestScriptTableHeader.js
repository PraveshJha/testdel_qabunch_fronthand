import GetData from "../../../QAautoMATER/funcLib/getData";
import Matcher from "../../../QAautoMATER/funcLib/matcher";
import { TestScriptData } from "./TestScriptData";
import { AssertionFunction } from './AssertionFunction'
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Type } from 'react-bootstrap-table2-editor';
import TestScriptGetter from "./TestScriptGetter";
import { textFilter } from 'react-bootstrap-table2-filter';
export var RequestVariableTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'variable',
	text: 'Variable',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Variable name can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Variable name should not have special character and number.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestScriptData.AllRequestVariables, 'variable')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'Variable name can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'key',
	text: 'Request Key',
	headerStyle: { width: '140px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-[]]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Request key can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Request Key should not have special character.'
			});
		}
		let isCorrectValue = await newValue.toLowerCase().startsWith("requestbody") || await newValue.toLowerCase().startsWith("requestheader");
		if (!await isCorrectValue) {
			return done({
				valid: false,
				message: 'Request Key should be started from [RequestBody,RequestHeader]'
			});
		}
		else {
			return done();
		}
	}
}
];

export var AsserionTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'expression',
	text: 'Expression',
	headerStyle: { width: '140px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-[]]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Expression can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Expression should not have special character.'
			});
		}
		let isCorrectValue = await newValue.toLowerCase().startsWith("responsebody") || await newValue.toLowerCase().startsWith("responseheader") || await newValue.toLowerCase().startsWith("responsecode");
		if (!await isCorrectValue) {
			return done({
				valid: false,
				message: 'Expression should be started from [ResponseBody,ResponseHeader,ResponseCode]'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'function',
	text: 'Function',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Function can not be empty'
			});
		}
		else {
			return done();
		}
	},
	editor: {
		type: Type.SELECT,
		options: AssertionFunction,
	},
},
{
	dataField: 'expected',
	text: 'Expected',
	headerStyle: { width: '100px' },
}
];

export var RequestParamTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'key',
	text: 'Key',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'key name can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'key name should not have special character and number.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestScriptData.AllRequestParamData, 'key')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'key name can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'value',
	text: 'Value',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'value can not be empty'
			});
		}
		else {
			return done();
		}
	}
}
];
export var RequestHttpTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'key',
	text: 'Key',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'key name can not be empty'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestScriptData.AllHttpHeaderData, 'key')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'key name can not be duplicate.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'value',
	text: 'Value',
	headerStyle: { width: '140px' },
	validator: async (newValue, row, column, done) => {
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'value can not be empty'
			});
		}
		else {
			return done();
		}
	}
}
];

export var DependentApiTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '40px' }
}, {
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '70px' },
	editor: {
		type: Type.SELECT,
		getOptions: (setOptions) => {
			setTimeout(() => {
				setOptions(TestScriptData.DependendtComponentList);
			}, 0);
		}
	},
	validator: async (newValue, row, column, done) => {
		if (await newValue === '') {
			TestScriptData.DependentTestIdList = [];
			TestScriptData.DependentApiDataTable[row.id - 1]['testid'] = '';
			return done({
				valid: false,
				message: 'Component name can not be blank'
			});
		}
		else {
			var oldValue = TestScriptData.DependentApiDataTable[row.id - 1]['component'];
			if (await oldValue !== await newValue) {
				TestScriptData.DependentApiDataTable[row.id - 1]['testid'] = '';
				await TestScriptGetter.getDependentTestIdList(newValue);
			}
			return done();
		}
	}
},
{
	dataField: 'testid',
	text: 'TestId',
	headerStyle: { width: '130px' },
	editor: {
		type: Type.SELECT,
		getOptions: (setOptions) => {
			setTimeout(() => {
				setOptions(TestScriptData.DependentTestIdList);
			}, 50);
		}
	},
	validator: async (newValue, row, column, done) => {
		if (TestScriptData.TestId !== '') {
			if (await newValue.toLowerCase().includes(TestScriptData.TestId.toLocaleLowerCase() + '@')) {
				return done({
					valid: false,
					message: 'Same TestId can not be depend for each other'
				});
			}
			else {
				return done();
			}
		}
		else{
			return done({
				valid: false,
				message: 'Parent test id can not be null.'
			});
		}
	}
},
{
	dataField: 'variable',
	text: 'Variable Name',
	headerStyle: { width: '70px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Name can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Name should not have special character.'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'key',
	text: 'Response Key',
	headerStyle: { width: '120px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-[]]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Key can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Key should not have special character.'
			});
		}
		let isCorrectValue = await newValue.toLowerCase().startsWith("responseheader") || await newValue.toLowerCase().startsWith("responsebody");
		if (!await isCorrectValue) {
			return done({
				valid: false,
				message: 'Key name should be start [ResponseBody,ResponseHeader]'
			});
		}
		else {
			return done();
		}
	}
},
{
	dataField: 'seq',
	text: 'Seq',
	headerStyle: { width: '50px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^1-9]/ig;
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'Seq should be greater than 1'
			});
		}
		if (newValue.trim() === '') {
			return done({
				valid: false,
				message: 'Only integer value allowed'
			});
		}
		if (row.testid.toString().trim() === '') {
			return done({
				valid: false,
				message: 'Please select TestId first'
			});
		}
		var maxSequence = await TestScriptGetter.getMaxSequence();
		if (newValue > maxSequence) {
			return done({
				valid: false,
				message: 'As per your data selection Maximum sequence can be ' + maxSequence
			});
		}
		else {
			return done();
		}
	}
}
];

export var DependentResponseKeyTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'key',
	text: 'Key',
	headerStyle: { width: '100px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'key name can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'key name should not have special character and number.'
			});
		}
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(TestScriptData.DependentResponseKeyData, 'key')
		var isPresent = await Matcher.isValuePresentInArray(allColumnValue, await newValue);
		if (isPresent) {
			return done({
				valid: false,
				message: 'key name can not be duplicate.'
			});
		}
		else {
			TestScriptData.DependentResponseKeyData.push(row)
			return done();
		}
	}
},
{
	dataField: 'value',
	text: 'Value',
	headerStyle: { width: '120px' },
	validator: async (newValue, row, column, done) => {
		var format = /[^A-Za-z0-9-[]]/ig;
		if (await newValue.trim() === '') {
			return done({
				valid: false,
				message: 'value can not be empty'
			});
		}
		if (format.test(await newValue)) {
			return done({
				valid: false,
				message: 'value should not have special character.'
			});
		}
		let isCorrectValue = await newValue.toLowerCase().startsWith("responseheader") || await newValue.toLowerCase().startsWith("responsebody");
		if (!await isCorrectValue) {
			return done({
				valid: false,
				message: 'Accepted value should be started [ResponseBody,ResponseHeader]'
			});
		}
		else {
			return done();
		}
	}
}
];
export var StringDataHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '40px' }
}, {
	dataField: 'key',
	text: 'Data Key',
	editable: false,
	filter: textFilter(
		{
			className: 'test-classname',
			placeholder: 'Search',
		})
},
{
	dataField: 'custom',
	text: 'Parameter',
},
];
