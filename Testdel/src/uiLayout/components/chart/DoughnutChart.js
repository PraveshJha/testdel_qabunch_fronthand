import React from 'react';
import PropTypes from '../../../utils/propTypes';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility'
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);
const DoughnutChart  = ({
  ...restProps
})  => {
  var labels = {...restProps}['labels'];
  var incomingdata = {...restProps}['data'];
  var color = {...restProps}['color'];
  var listOfColor =[];
  if(color ===undefined || color.length ===0)
  {
    for (let i = 0; i < incomingdata.length; i++) {
      const promiseResolver = Promise.resolve(DataGeneratorUtility.gerHexaColorCode());
      promiseResolver.then((value) => {
        listOfColor.push(value)
      });
    }
  }
  else{
    listOfColor=  color;
  }
  
  var options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
      },
      datalabels: {
        color: 'white',
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
    },
  };
  var data = {
    labels: labels,
    datasets: [
      {
        data: incomingdata,
        backgroundColor: listOfColor,
        borderColor: listOfColor,
        borderWidth: 2,
        cutout:'80%',
        borderRadius:10
      },
    ],
  };
  return <Doughnut data={data} options={options}/>;
};

DoughnutChart.propTypes = {
  labels: PropTypes.array,
  data: PropTypes.array,
  color :PropTypes.array,
};

DoughnutChart.defaultProps = {
  labels: [],
  data:[],
  color :[],
};

export default DoughnutChart;
