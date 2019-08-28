import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './appointment.reducer';
import { IAppointment } from 'app/shared/model/appointment.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAppointmentProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IAppointmentState {
  search: string;
}

export class Appointment extends React.Component<IAppointmentProps, IAppointmentState> {
  state: IAppointmentState = {
    search: ''
  };

  componentDidMount() {
    this.props.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  clear = () => {
    this.setState({ search: '' }, () => {
      this.props.getEntities();
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  render() {
    const { appointmentList, match } = this.props;
    return (
      <div>
        <h2 id="appointment-heading">
          Appointments
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Appointment
          </Link>
        </h2>
        <Row>
          <Col sm="12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder="Search" />
                  <Button className="input-group-addon">
                    <FontAwesomeIcon icon="search" />
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          {appointmentList && appointmentList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Fixed Date</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Patient</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {appointmentList.map((appointment, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <TextFormat type="date" value={appointment.fixedDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>{appointment.symptoms}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <TextFormat type="date" value={appointment.startTime} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={appointment.endTime} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      {appointment.patient ? <Link to={`patient/${appointment.patient.id}`}>{appointment.patient.fullname}</Link> : ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${appointment.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${appointment.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${appointment.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Appointments found</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ appointment }: IRootState) => ({
  appointmentList: appointment.entities
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointment);
