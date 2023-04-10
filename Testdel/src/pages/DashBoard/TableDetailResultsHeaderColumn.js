export var TableDetailResultsHeaderColumn = [{
	dataField: 'id',
	text: '#',
	headerStyle: { width: '100px' }
}, {
	dataField: 'component',
	text: 'Component',
	headerStyle: { width: '150px' }
}, {
	dataField: 'passCount',
	text: 'Pass Count',
	headerStyle: { width: '110px' },
	style: {
		backgroundColor: '#17E798'
	  }
},
{
	dataField: 'failCount',
	text: 'Fail Count',
	headerStyle: { width: '100px' },
	style: {
		backgroundColor: '#F38295'
	  }
},
{
	dataField: 'executionTime',
	text: 'Execution time',
	headerStyle: { width: '140px' }
}
];