package com.wisestep.app.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

import com.wisestep.app.domain.enumeration.Status;

/**
 * A Appointment.
 */
@Document(collection = "appointment")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "appointment")
public class Appointment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private String id;

    @NotNull
    @Field("fixed_date")
    private Instant fixedDate;

    @Field("symptoms")
    private String symptoms;

    @NotNull
    @Field("status")
    private Status status;

    @Field("start_time")
    private Instant startTime;

    @Field("end_time")
    private Instant endTime;

    @DBRef
    @Field("patient")
    @JsonIgnoreProperties("appointments")
    private Patient patient;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getFixedDate() {
        return fixedDate;
    }

    public Appointment fixedDate(Instant fixedDate) {
        this.fixedDate = fixedDate;
        return this;
    }

    public void setFixedDate(Instant fixedDate) {
        this.fixedDate = fixedDate;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public Appointment symptoms(String symptoms) {
        this.symptoms = symptoms;
        return this;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public Status getStatus() {
        return status;
    }

    public Appointment status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Appointment startTime(Instant startTime) {
        this.startTime = startTime;
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public Appointment endTime(Instant endTime) {
        this.endTime = endTime;
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Patient getPatient() {
        return patient;
    }

    public Appointment patient(Patient patient) {
        this.patient = patient;
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Appointment)) {
            return false;
        }
        return id != null && id.equals(((Appointment) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Appointment{" +
            "id=" + getId() +
            ", fixedDate='" + getFixedDate() + "'" +
            ", symptoms='" + getSymptoms() + "'" +
            ", status='" + getStatus() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
