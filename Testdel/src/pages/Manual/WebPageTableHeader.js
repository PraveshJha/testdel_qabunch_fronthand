import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { textFilter } from 'react-bootstrap-table2-filter';
import { Type } from 'react-bootstrap-table2-editor';
import { TestPlanData } from "./TestPlan/TestPlanData";
import { ConfigData } from "./Configuration/ConfigData";
import  GetData  from "../../QAautoMATER/funcLib/getData";
import Matcher from "../../QAautoMATER/funcLib/matcher";
export var TestCaseTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '50px' }
}, {
	dataField: 'testId',
	text: 'Test Id',
	headerStyle: { width: '80px' },
	filter: textFilter({})
},
{
	dataField: 'testname',
	text: 'Test Name',
	headerStyle: { width: '250px' },
	filter: textFilter({})
},
{
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '150px' },
	filter: textFilter({})
},
{
	dataField: 'priority',
	text: 'Priority',
	filter: textFilter({})
},
{
	dataField: 'type',
	text: 'Type',
	filter: textFilter({})
},
{
	dataField: 'automationtype',
	text: 'Automation Type',
	filter: textFilter({})
},
{
	dataField: 'cycle',
	text: 'Cycle',
	filter: textFilter({})
},
{
	dataField: 'reference',
	text: 'Reference',
	filter: textFilter({})
},
{
	dataField: 'createdby',
	text: 'Created By',
	headerStyle: { width: '120px' },
	filter: textFilter({})
}
];
export var TestCaseCommentHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'comment',
	text: 'Comment',
	headerStyle: { width: '300px' },
},
{
	dataField: 'by',
	text: 'By',
	headerStyle: { width: '150px' },
},
{
	dataField: 'timestamp',
	text: 'TimeStamp',
	headerStyle: { width: '150px' },
},
];
export var TestCaseHistoryHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'history',
	text: 'History',
	headerStyle: { width: '300px' },
},
{
	dataField: 'by',
	text: 'By',
	headerStyle: { width: '150px' },
},
{
	dataField: 'timestamp',
	text: 'TimeStamp',
	headerStyle: { width: '150px' },
},
];
export var DefectTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '50px' }
}, {
	dataField: 'defectid',
	text: 'Id',
	headerStyle: { width: '80px' },
	filter: textFilter({})
},
{
	dataField: 'title',
	text: 'Title',
	headerStyle: { width: '250px' },
	filter: textFilter({})
},
{
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '150px' },
	filter: textFilter({})
},
{
	dataField: 'priority',
	text: 'Priority',
	filter: textFilter({})
},
{
	dataField: 'severity',
	text: 'Severity',
	filter: textFilter({})
},
{
	dataField: 'status',
	text: 'Status',
	filter: textFilter({})
},
{
	dataField: 'assignto',
	text: 'Assign to',
	filter: textFilter({}),
	headerStyle: { width: '120px' },
},
{
	dataField: 'cycle',
	text: 'Cycle',
	filter: textFilter({})
},
{
	dataField: 'testid',
	text: 'Test Id',
	filter: textFilter({})
},
{
	dataField: 'createdby',
	text: 'Created By',
	headerStyle: { width: '120px' },
	filter: textFilter({})
}
];
export var TestPlanTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '50px' },
}, 
{
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '150px' },
	filter: textFilter({}),
	editable:false,
},
{
	dataField: 'testid',
	text: 'Test Id',
	headerStyle: { width: '80px' },
	filter: textFilter({}),
	editable:false,
},
{
	dataField: 'testname',
	text: 'Test Name',
	headerStyle: { width: '250px' },
	filter: textFilter({}),
	editable:false,
},
{
	dataField: 'assignto',
	text: 'Assigned To',
	headerStyle: { width: '150px' },
	filter: textFilter({}),
	editor: {
		type: Type.SELECT,
		getOptions: (setOptions) => {
			setTimeout(() => {
				setOptions(TestPlanData.ListOfUsers);
			}, 0);
		}
	},
},
{
	dataField: 'status',
	text: 'Status',
	headerStyle: { width: '80px' },
	filter: textFilter({}),
	editor: {
		type: Type.SELECT,
		options: [{ label: 'Pending', value: 'Pending' }, { label: 'Pass', value: 'Pass' },{ label: 'Fail', value: 'Fail' }],
	},
	style: (newValue) => {
		if (newValue === 'Fail') {
			return {
				backgroundColor: '#F38295'
			};
		};
		if (newValue === 'Pass') {
			return {
				backgroundColor: '#17E798'
			};
		};
		if (newValue === 'Pending') {
			return {
				backgroundColor: '#ffcc00'
			};
		};
	},
}
];
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
		var allColumnValue = await GetData.jsonArrayGetallKeyValue(await ConfigData.EnvUrlList, 'name')
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