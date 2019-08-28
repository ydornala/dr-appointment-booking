package com.wisestep.app.service.impl;

import com.wisestep.app.service.AppointmentService;
import com.wisestep.app.domain.Appointment;
import com.wisestep.app.repository.AppointmentRepository;
import com.wisestep.app.repository.search.AppointmentSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Appointment}.
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final Logger log = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;

    private final AppointmentSearchRepository appointmentSearchRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, AppointmentSearchRepository appointmentSearchRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentSearchRepository = appointmentSearchRepository;
    }

    /**
     * Save a appointment.
     *
     * @param appointment the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Appointment save(Appointment appointment) {
        log.debug("Request to save Appointment : {}", appointment);
        Appointment result = appointmentRepository.save(appointment);
        appointmentSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the appointments.
     *
     * @return the list of entities.
     */
    @Override
    public List<Appointment> findAll() {
        log.debug("Request to get all Appointments");
        return appointmentRepository.findAll();
    }


    /**
     * Get one appointment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Optional<Appointment> findOne(String id) {
        log.debug("Request to get Appointment : {}", id);
        return appointmentRepository.findById(id);
    }

    /**
     * Delete the appointment by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete Appointment : {}", id);
        appointmentRepository.deleteById(id);
        appointmentSearchRepository.deleteById(id);
    }

    /**
     * Search for the appointment corresponding to the query.
     *
     * @param query the query of the search.
     * @return the list of entities.
     */
    @Override
    public List<Appointment> search(String query) {
        log.debug("Request to search Appointments for query {}", query);
        return StreamSupport
            .stream(appointmentSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
