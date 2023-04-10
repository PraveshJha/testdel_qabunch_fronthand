import GetData from "../../../QAautoMATER/funcLib/getData";
import Matcher from "../../../QAautoMATER/funcLib/matcher";
import  {MockData}  from './MockData';
import { textFilter } from 'react-bootstrap-table2-filter';
export var ResponseHttpTableHeader = [{
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
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(MockData.ResponseHeaderData, 'key')
		var isPresent = await Matcher.isValuePresentInArray(await allColumnValue, await newValue);
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
export var UtilityFunctionHeader = [{
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


