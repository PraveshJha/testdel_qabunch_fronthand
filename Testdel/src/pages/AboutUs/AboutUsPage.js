import Page from '../Page';
import React from 'react';
import Typography from '../../uiLayout/Typography';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  CardImg,
  CardTitle,
  CardText,
} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import qaautomaterimage1 from "../../image/qaautomaterimage1.jpg"
import qaautomaterimage2 from "../../image/qaautomaterimage2.jpg"
import qaautomaterimage3 from "../../image/qaautomaterimage3.jpg"
import qaautomaterimage4 from "../../image/qaautomaterimage4.jpg"
import { AboutUsData } from './AboutUsData'
const items = [
  {
    src: qaautomaterimage1,
    //altText: 'Highlights',
    //caption: 'In pursuit of perfection'
  },
  {
    src: qaautomaterimage2,
    //altText: 'Highlights',
    //caption: 'Highlights'
  }
];

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }
  async componentWillMount() {
    window.scrollTo(0, 0);

  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    return (
      <Page
        className="About us"
      //title="Congratulations on being part of the QAautoMATER team!"

      >
        <Row>
          <Col md={6} sm={6} xs={12} className="mb-3">
            <Card>
              <CardImg top src={qaautomaterimage4} />
              <CardBody>
                <CardTitle>One stop solution</CardTitle>
                <CardText>
                {AboutUsData.oneStopSolutionText}
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} sm={6} xs={12} className="mb-3">
            <Card>
              <CardImg top src={qaautomaterimage3} />
              <CardBody>
                <CardTitle>Tool Comparison</CardTitle>
                <CardText>
                {AboutUsData.toolCostText}
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col>
          <Card>
            <CardHeader>Latest Update</CardHeader>
            <div className="p-3 bg-info my-2 rounded"
             style={{
              background: 'black'
            }}
            >
            <CardBody>
              <Typography type="h6">
              {AboutUsData.latestupdatetext}
              </Typography>
            </CardBody>
            </div>
          </Card>
        </Col>
        </Row>
      </Page>
    );
  }
}
export default DashboardPage;
