import { textFilter } from 'react-bootstrap-table2-filter';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { ExecutionLabData } from './ExecutionLabData';
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
			delay: 1000, // default is 500ms
			className: 'test-classname',
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
	headerStyle: { width: '160px' },
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
}
];
export var ResponseAsserionTableHeader = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '30px' }
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
				ExecutionLabData.IsScreenshotModalOpen = true;
				var screenshotData = 'data:image/png;base64, ' + row.screenshot;
				ExecutionLabData.ImageData = screenshotData;
				ExecutionLabData.StepsDetailsForScreenshot = row.stepdefinition
			}
		}
	},

}
];