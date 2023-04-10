import React from 'react';
import PropTypes from '../../utils/propTypes';
const DropDownOptions = ({
  ...restProps
}) => {
  var alldropdownItem = {...restProps}['options'];
  var allItem =[];
  for(let i=0;i<alldropdownItem.length;i++)
  {
    allItem.push(<option key = {i} value = {alldropdownItem[i]}>{alldropdownItem[i]}</option>)
  }
  return allItem;
};

DropDownOptions.propTypes = {
  options: PropTypes.array,
};

DropDownOptions.defaultProps = {
  options: [],
};

export default DropDownOptions;
