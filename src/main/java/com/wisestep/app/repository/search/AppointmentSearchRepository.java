package com.wisestep.app.repository.search;

import com.wisestep.app.domain.Appointment;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Appointment} entity.
 */
public interface AppointmentSearchRepository extends ElasticsearchRepository<Appointment, String> {
}
