package com.wisestep.app.service;

import com.wisestep.app.domain.Patient;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Patient}.
 */
public interface PatientService {

    /**
     * Save a patient.
     *
     * @param patient the entity to save.
     * @return the persisted entity.
     */
    Patient save(Patient patient);

    /**
     * Get all the patients.
     *
     * @return the list of entities.
     */
    List<Patient> findAll();


    /**
     * Get the "id" patient.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Patient> findOne(String id);

    /**
     * Delete the "id" patient.
     *
     * @param id the id of the entity.
     */
    void delete(String id);

    /**
     * Search for the patient corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @return the list of entities.
     */
    List<Patient> search(String query);
}
