import React from 'react';
import PropTypes from '../../../utils/propTypes';

import { Card, CardText, CardTitle } from 'reactstrap';
import Typography from '../../../uiLayout/Typography';

const TextWidget = ({
  title,
  number,
  color,
  ...restProps
}) => {
  return (
    <Card body {...restProps}>
      <div className="d-flex justify-content-between">
        <CardText tag="div">
          <Typography className="mb-0">
            <strong>{title}</strong>
          </Typography>
        </CardText>
        <CardTitle className={`text-${color}`}>{number}</CardTitle>
      </div>
    </Card>
  );
};

TextWidget.propTypes = {
  title: PropTypes.string.isRequired,
  number: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark',
    'black',
  ]),
};

TextWidget.defaultProps = {
  title: '',
  number: 0,
  color: 'black',
};

export default TextWidget;
