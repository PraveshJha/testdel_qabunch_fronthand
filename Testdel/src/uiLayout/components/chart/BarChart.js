import React from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import PropTypes from '../../../utils/propTypes';
import Chart from 'chart.js/auto';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
Chart.register(ChartDataLabels);
const BarChart =  ({
  ...restProps
}) => {
  var labelvisible = false;
  var labels = {...restProps}['labels'];
  var incomingdata = {...restProps}['data'];
  var color = {...restProps}['color'];
  var label = {...restProps}['label'];
  var listOfDataSets =[];
  for(let i=0;i< incomingdata.length;i++)
  {
    var onebyOneDataSet={};
    onebyOneDataSet['label'] = '';
    onebyOneDataSet['data'] = incomingdata[i];
    onebyOneDataSet['borderColor']= '#000000';
    onebyOneDataSet['borderWidth']= 2;
    listOfDataSets.push( onebyOneDataSet)
  }
  if(label.length > 0)
  {
    labelvisible=true;
    for (let i = 0; i <  listOfDataSets.length; i++) {
      listOfDataSets[i]['label'] =  label[i];
    }
  }
  if( color ===undefined ||  color.length ===0)
  {
    for (let i = 0; i <  listOfDataSets.length; i++) {
      const promiseResolver = Promise.resolve(DataGeneratorUtility.gerHexaColorCode());
      promiseResolver.then((value) => {
        listOfDataSets[i]['borderColor'] = value;
      });
    }
  }
  else{
    for (let i = 0; i < listOfDataSets.length; i++) {
      listOfDataSets[i]['borderColor'] = color[i];
    }
  }
  var data = {
    labels: labels,
    datasets: listOfDataSets,
  };
  var options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: labelvisible,
      }
    },
    datalabels: {
      color: 'black',
      labels: {
        title: {
          font: {
            weight: 'bold'
          }
        },
      },
      formatter: function(value, context) {                  
        return value;
      }
    }
  };
  return <Bar options={options} data={data} />;

};

BarChart.propTypes = {
  labels: PropTypes.array,
  data: PropTypes.array,
  color: PropTypes.array,
  label: PropTypes.array,
};

BarChart.defaultProps = {
  labels: [],
  data:[],
  color :[],
  label:[],
};


export default BarChart;
