import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './patient.reducer';
import { IPatient } from 'app/shared/model/patient.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPatientDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class PatientDetail extends React.Component<IPatientDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { patientEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Patient [<b>{patientEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="fullname">Fullname</span>
            </dt>
            <dd>{patientEntity.fullname}</dd>
            <dt>
              <span id="gender">Gender</span>
            </dt>
            <dd>{patientEntity.gender}</dd>
            <dt>
              <span id="phone">Phone</span>
            </dt>
            <dd>{patientEntity.phone}</dd>
            <dt>
              <span id="address">Address</span>
            </dt>
            <dd>{patientEntity.address}</dd>
            <dt>
              <span id="email">Email</span>
            </dt>
            <dd>{patientEntity.email}</dd>
            <dt>
              <span id="birthdate">Birthdate</span>
            </dt>
            <dd>
              <TextFormat value={patientEntity.birthdate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
          </dl>
          <Button tag={Link} to="/entity/patient" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/patient/${patientEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ patient }: IRootState) => ({
  patientEntity: patient.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientDetail);
