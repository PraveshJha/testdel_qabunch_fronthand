import { textFilter } from 'react-bootstrap-table2-filter';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { DashBoardData } from '../../DashBoard/DashboardData';
export var ExecutionTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '50px' }
}, {
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '110px' },
	filter: textFilter(
		{
			placeholder: 'Search',
			caseSensitive: false,
		})
}, {
	dataField: 'testid',
	text: 'Test Id',
	headerStyle: { width: '80px' },
	filter: textFilter(
		{
			delay: 1000, // default is 500ms
			className: 'test-classname',
			placeholder: 'Search',
		})
},
{
	dataField: 'testname',
	text: 'Test name',
	headerStyle: { width: '150px' },
	filter: textFilter(
		{
			delay: 1000, // default is 500ms
			className: 'test-classname',
			placeholder: 'Search',
		})
},
{
	dataField: 'status',
	text: 'Status',
	headerStyle: { width: '80px' },
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
	},
	filter: textFilter(
		{
			className: 'test-classname',
			placeholder: 'Status',
	})
}
];
export var ResponseAsserionTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
}, {
	dataField: 'expression',
	text: 'Expression',
	headerStyle: { width: '140px' },
},
{
	dataField: 'function',
	text: 'Function',
	headerStyle: { width: '100px' },
},
{
	dataField: 'expected',
	text: 'Expected',
	headerStyle: { width: '100px' },
},
{
	dataField: 'actual',
	text: 'Actual',
	headerStyle: { width: '100px' },
}
];
export var ExecutionTableHeaderWithoutStatus = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '50px' }
}, {
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '110px' },
	filter: textFilter(
		{
			placeholder: 'Search',
			caseSensitive: false,
		})
}, {
	dataField: 'testid',
	text: 'Test Id',
	headerStyle: { width: '80px' },
	filter: textFilter(
		{
			delay: 1000, // default is 500ms
			className: 'test-classname',
			placeholder: 'Search',
		})
},
{
	dataField: 'testname',
	text: 'Test name',
	headerStyle: { width: '150px' },
	filter: textFilter(
		{
			delay: 1000, // default is 500ms
			className: 'test-classname',
			placeholder: 'Search',
		})
}
];
export var UITestResultsTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' },
}, {
	dataField: 'stepdefinition',
	text: 'Step Definition',
	headerStyle: { width: '200px' },
	editable:false,
},
{
	dataField: 'action',
	text: 'Action',
	headerStyle: { width: '100px' },
	editable:false,
},
{
	dataField: 'testdata',
	text: 'Test Data/Error',
	headerStyle: { width: '200px' },
	editable:false,
},
{
	dataField: 'status',
	text: 'Status',
	headerStyle: { width: '60px' },
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
	},
	editable:false,
},
{
	dataField: 'screenshot',
	text: 'Screenshot',
	headerStyle: { width: '100px' },
	formatter: (cell) => {
		var imageData = 'data:image/png;base64, ' + cell;
		return <img alt ='screenshot' width="100" height="50" src={imageData}></img>;
	},
	events: {
		onClick: (e, column, columnIndex, row, rowIndex) => {
			if (row.screenshot !== '') {
				DashBoardData.IsScreenshotModalOpen = true;
				var screenshotData = 'data:image/png;base64, ' + row.screenshot;
				DashBoardData.ImageData = screenshotData;
				DashBoardData.StepsDetailsForScreenshot = row.stepdefinition
			}
		}
	},
}
];