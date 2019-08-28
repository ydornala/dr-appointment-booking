import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './appointment.reducer';
import { IAppointment } from 'app/shared/model/appointment.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAppointmentDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class AppointmentDetail extends React.Component<IAppointmentDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { appointmentEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Appointment [<b>{appointmentEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="fixedDate">Fixed Date</span>
            </dt>
            <dd>
              <TextFormat value={appointmentEntity.fixedDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="symptoms">Symptoms</span>
            </dt>
            <dd>{appointmentEntity.symptoms}</dd>
            <dt>
              <span id="status">Status</span>
            </dt>
            <dd>{appointmentEntity.status}</dd>
            <dt>
              <span id="startTime">Start Time</span>
            </dt>
            <dd>
              <TextFormat value={appointmentEntity.startTime} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="endTime">End Time</span>
            </dt>
            <dd>
              <TextFormat value={appointmentEntity.endTime} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>Patient</dt>
            <dd>{appointmentEntity.patient ? appointmentEntity.patient.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/appointment" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/appointment/${appointmentEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ appointment }: IRootState) => ({
  appointmentEntity: appointment.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentDetail);
