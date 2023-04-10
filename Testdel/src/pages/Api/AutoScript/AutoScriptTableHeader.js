import { textFilter } from 'react-bootstrap-table2-filter';
export var NewAPITableHeader = [{
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
},
{
	dataField: 'testname',
	text: 'Test name',
	headerStyle: { width: '150px' },
}
];


