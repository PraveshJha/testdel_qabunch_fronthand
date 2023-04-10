import { getColor } from 'utils/colors';
import genericHelper from '../funcLibraries/GenericHelper.js';
export default
{
   GetPieChart(summaryPass,summaryFail) {
    return {
      datasets: [
        {
          data: [summaryPass, summaryFail],
          backgroundColor: [
            getColor('success'),
            getColor('danger'),
          ],
        },
      ],
      labels: ['PASS', 'FAIL'],
    };
  },

  GetLineChart(Component=[],summaryPass={},summaryFail={}) {
    return {
      labels: Component,
      datasets: [
        {
          label: 'PASS',
          backgroundColor: getColor('success'),
          borderColor: getColor('success'),
          borderWidth: 1,
          data: [
            ...summaryPass,
          ],
        },
        {
          label: 'FAIL',
          backgroundColor: getColor('danger'),
          borderColor: getColor('danger'),
          borderWidth: 1,
          data: [
            ...summaryFail,
          ],
        },
      ],
    };
    
  },
  GetDoughnutChart_Dynamic(Input) {
    try{
    var label = Input['label'];
    var data = Input['data'];
    var color = Input['color'];
    return {
      datasets: [
      {
        data: genericHelper.getListItem(data,'data'),
        backgroundColor: genericHelper.getListItem(color,'color')
      },
      ],
      labels: genericHelper.getListItem(label,'label'),
    };
   }
   catch(error)
   {}
  },
   GetBarChart(xaxisLabel,passData,failData) {
    return {
      labels: xaxisLabel,
      datasets: [
        {
          label: 'PASS',
          backgroundColor: getColor('success'),
          borderColor: getColor('success'),
          borderWidth: 1,
          type: 'bar',
          fill: true,
          data: passData,
        },
        {
          label: 'FAIL',
          backgroundColor: getColor('danger'),
          borderColor: getColor('danger'),
          borderWidth: 1,
          type: 'bar',
          fill: true,
          data: failData,
        },
      ],
    };
  },
  genLineChart(Component,summaryPass){
    return {
      labels: Component,
      datasets: [
        {
          label: 'Execution Time',
          backgroundColor: getColor('primary'),
          borderColor: getColor('primary'),
          borderWidth: 1,
          data: summaryPass,
          fill: false
        }
      ],
    };
  },
   genLineDataforModuleFail(Component=[],summaryPass={},summaryFail={}){
    return {
      labels: Component,
      datasets: [
        {
          label: 'PASS',
          backgroundColor: getColor('success'),
          borderColor: getColor('success'),
          borderWidth: 1,
          data: summaryPass,
          fill: false
        },
        {
          label: 'FAIL',
          backgroundColor: getColor('danger'),
          borderColor: getColor('danger'),
          borderWidth: 1,
          data: summaryFail,
          fill: false
        },
      ],
    };
  },
   genTimeDuration(Component=[],summaryPass={}){
     try{
    return {
      labels: Component,
      datasets: [
        {
          label: 'Execution Time in minutes',
          backgroundColor: getColor('primary'),
          borderColor: getColor('primary'),
          borderWidth: 1,
          data: summaryPass,
          fill: false
        }
      ],
    };
  }
  catch(error)
  {}
  },
  GetBarChartCustomLabelandColor(xaxisLabel,passData,failData,lable1,lable2,col1,col2) {
    return {
      labels: xaxisLabel,
      datasets: [
        {
          label: lable1,
          backgroundColor: col1,
          borderColor: col1,
          borderWidth: 1,
          type: 'bar',
          fill: true,
          data: passData,
        },
        {
          label: lable2,
          backgroundColor: col2,
          borderColor: col2,
          borderWidth: 1,
          type: 'bar',
          fill: true,
          data: failData,
        },
      ],
    };
  },
  
}

