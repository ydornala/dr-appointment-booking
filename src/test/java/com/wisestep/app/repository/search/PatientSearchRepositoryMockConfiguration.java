package com.wisestep.app.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link PatientSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class PatientSearchRepositoryMockConfiguration {

    @MockBean
    private PatientSearchRepository mockPatientSearchRepository;

}
