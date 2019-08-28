package com.wisestep.app.domain;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.wisestep.app.domain.enumeration.Gender;

/**
 * A Patient.
 */
@Document(collection = "patient")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "patient")
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private String id;

    @NotNull
    @Size(min = 3)
    @Field("fullname")
    private String fullname;

    @NotNull
    @Field("gender")
    private Gender gender;

    @NotNull
    @Field("phone")
    private String phone;

    @NotNull
    @Field("address")
    private String address;

    @Field("email")
    private String email;

    @NotNull
    @Field("birthdate")
    private LocalDate birthdate;

    @DBRef
    @Field("appoinments")
    private Set<Appointment> appoinments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public Patient fullname(String fullname) {
        this.fullname = fullname;
        return this;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Gender getGender() {
        return gender;
    }

    public Patient gender(Gender gender) {
        this.gender = gender;
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public Patient phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public Patient address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public Patient email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public Patient birthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
        return this;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public Set<Appointment> getAppoinments() {
        return appoinments;
    }

    public Patient appoinments(Set<Appointment> appointments) {
        this.appoinments = appointments;
        return this;
    }

    public Patient addAppoinments(Appointment appointment) {
        this.appoinments.add(appointment);
        appointment.setPatient(this);
        return this;
    }

    public Patient removeAppoinments(Appointment appointment) {
        this.appoinments.remove(appointment);
        appointment.setPatient(null);
        return this;
    }

    public void setAppoinments(Set<Appointment> appointments) {
        this.appoinments = appointments;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", fullname='" + getFullname() + "'" +
            ", gender='" + getGender() + "'" +
            ", phone='" + getPhone() + "'" +
            ", address='" + getAddress() + "'" +
            ", email='" + getEmail() + "'" +
            ", birthdate='" + getBirthdate() + "'" +
            "}";
    }
}
