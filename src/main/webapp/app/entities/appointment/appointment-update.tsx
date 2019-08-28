import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IPatient } from 'app/shared/model/patient.model';
import { getEntities as getPatients } from 'app/entities/patient/patient.reducer';
import { getEntity, updateEntity, createEntity, reset } from './appointment.reducer';
import { IAppointment } from 'app/shared/model/appointment.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAppointmentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IAppointmentUpdateState {
  isNew: boolean;
  patientId: string;
}

export class AppointmentUpdate extends React.Component<IAppointmentUpdateProps, IAppointmentUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      patientId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getPatients();
  }

  saveEntity = (event, errors, values) => {
    values.fixedDate = convertDateTimeToServer(values.fixedDate);
    values.startTime = convertDateTimeToServer(values.startTime);
    values.endTime = convertDateTimeToServer(values.endTime);

    if (errors.length === 0) {
      const { appointmentEntity } = this.props;
      const entity = {
        ...appointmentEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/appointment');
  };

  render() {
    const { appointmentEntity, patients, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="wisestepApp.appointment.home.createOrEditLabel">Create or edit a Appointment</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : appointmentEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="appointment-id">ID</Label>
                    <AvInput id="appointment-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="fixedDateLabel" for="appointment-fixedDate">
                    Fixed Date
                  </Label>
                  <AvInput
                    id="appointment-fixedDate"
                    type="datetime-local"
                    className="form-control"
                    name="fixedDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.appointmentEntity.fixedDate)}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="symptomsLabel" for="appointment-symptoms">
                    Symptoms
                  </Label>
                  <AvField id="appointment-symptoms" type="text" name="symptoms" />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="appointment-status">
                    Status
                  </Label>
                  <AvInput
                    id="appointment-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && appointmentEntity.status) || 'PENDING'}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="startTimeLabel" for="appointment-startTime">
                    Start Time
                  </Label>
                  <AvInput
                    id="appointment-startTime"
                    type="datetime-local"
                    className="form-control"
                    name="startTime"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.appointmentEntity.startTime)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="endTimeLabel" for="appointment-endTime">
                    End Time
                  </Label>
                  <AvInput
                    id="appointment-endTime"
                    type="datetime-local"
                    className="form-control"
                    name="endTime"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.appointmentEntity.endTime)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="appointment-patient">Patient</Label>
                  <AvInput id="appointment-patient" type="select" className="form-control" name="patient.id">
                    <option value="" key="0" />
                    {patients
                      ? patients.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/appointment" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  patients: storeState.patient.entities,
  appointmentEntity: storeState.appointment.entity,
  loading: storeState.appointment.loading,
  updating: storeState.appointment.updating,
  updateSuccess: storeState.appointment.updateSuccess
});

const mapDispatchToProps = {
  getPatients,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentUpdate);
