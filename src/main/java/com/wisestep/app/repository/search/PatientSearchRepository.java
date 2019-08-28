package com.wisestep.app.repository.search;

import com.wisestep.app.domain.Patient;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Patient} entity.
 */
public interface PatientSearchRepository extends ElasticsearchRepository<Patient, String> {
}
