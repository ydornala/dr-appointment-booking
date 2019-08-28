package com.wisestep.app.service.impl;

import com.wisestep.app.service.PatientService;
import com.wisestep.app.domain.Patient;
import com.wisestep.app.repository.PatientRepository;
import com.wisestep.app.repository.search.PatientSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Patient}.
 */
@Service
public class PatientServiceImpl implements PatientService {

    private final Logger log = LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository patientRepository;

    private final PatientSearchRepository patientSearchRepository;

    public PatientServiceImpl(PatientRepository patientRepository, PatientSearchRepository patientSearchRepository) {
        this.patientRepository = patientRepository;
        this.patientSearchRepository = patientSearchRepository;
    }

    /**
     * Save a patient.
     *
     * @param patient the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Patient save(Patient patient) {
        log.debug("Request to save Patient : {}", patient);
        Patient result = patientRepository.save(patient);
        patientSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the patients.
     *
     * @return the list of entities.
     */
    @Override
    public List<Patient> findAll() {
        log.debug("Request to get all Patients");
        return patientRepository.findAll();
    }


    /**
     * Get one patient by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Optional<Patient> findOne(String id) {
        log.debug("Request to get Patient : {}", id);
        return patientRepository.findById(id);
    }

    /**
     * Delete the patient by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete Patient : {}", id);
        patientRepository.deleteById(id);
        patientSearchRepository.deleteById(id);
    }

    /**
     * Search for the patient corresponding to the query.
     *
     * @param query the query of the search.
     * @return the list of entities.
     */
    @Override
    public List<Patient> search(String query) {
        log.debug("Request to search Patients for query {}", query);
        return StreamSupport
            .stream(patientSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
