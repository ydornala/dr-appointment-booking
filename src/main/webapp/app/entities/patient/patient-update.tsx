import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './patient.reducer';
import { IPatient } from 'app/shared/model/patient.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPatientUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPatientUpdateState {
  isNew: boolean;
}

export class PatientUpdate extends React.Component<IPatientUpdateProps, IPatientUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { patientEntity } = this.props;
      const entity = {
        ...patientEntity,
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
    this.props.history.push('/entity/patient');
  };

  render() {
    const { patientEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="wisestepApp.patient.home.createOrEditLabel">Create or edit a Patient</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : patientEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="patient-id">ID</Label>
                    <AvInput id="patient-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="fullnameLabel" for="patient-fullname">
                    Fullname
                  </Label>
                  <AvField
                    id="patient-fullname"
                    type="text"
                    name="fullname"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      minLength: { value: 3, errorMessage: 'This field is required to be at least 3 characters.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="genderLabel" for="patient-gender">
                    Gender
                  </Label>
                  <AvInput
                    id="patient-gender"
                    type="select"
                    className="form-control"
                    name="gender"
                    value={(!isNew && patientEntity.gender) || 'MALE'}
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHERS">OTHERS</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="phoneLabel" for="patient-phone">
                    Phone
                  </Label>
                  <AvField
                    id="patient-phone"
                    type="text"
                    name="phone"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="addressLabel" for="patient-address">
                    Address
                  </Label>
                  <AvField
                    id="patient-address"
                    type="text"
                    name="address"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="emailLabel" for="patient-email">
                    Email
                  </Label>
                  <AvField id="patient-email" type="text" name="email" />
                </AvGroup>
                <AvGroup>
                  <Label id="birthdateLabel" for="patient-birthdate">
                    Birthdate
                  </Label>
                  <AvField
                    id="patient-birthdate"
                    type="date"
                    className="form-control"
                    name="birthdate"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/patient" replace color="info">
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
  patientEntity: storeState.patient.entity,
  loading: storeState.patient.loading,
  updating: storeState.patient.updating,
  updateSuccess: storeState.patient.updateSuccess
});

const mapDispatchToProps = {
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
)(PatientUpdate);
