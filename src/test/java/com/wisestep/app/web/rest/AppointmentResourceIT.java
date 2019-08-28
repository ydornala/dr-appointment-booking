package com.wisestep.app.web.rest;

import com.wisestep.app.WisestepApp;
import com.wisestep.app.domain.Appointment;
import com.wisestep.app.repository.AppointmentRepository;
import com.wisestep.app.repository.search.AppointmentSearchRepository;
import com.wisestep.app.service.AppointmentService;
import com.wisestep.app.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.Validator;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static com.wisestep.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wisestep.app.domain.enumeration.Status;
/**
 * Integration tests for the {@link AppointmentResource} REST controller.
 */
@SpringBootTest(classes = WisestepApp.class)
public class AppointmentResourceIT {

    private static final Instant DEFAULT_FIXED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FIXED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_FIXED_DATE = Instant.ofEpochMilli(-1L);

    private static final String DEFAULT_SYMPTOMS = "AAAAAAAAAA";
    private static final String UPDATED_SYMPTOMS = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.PENDING;
    private static final Status UPDATED_STATUS = Status.IN_PROGRESS;

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_START_TIME = Instant.ofEpochMilli(-1L);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_END_TIME = Instant.ofEpochMilli(-1L);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    /**
     * This repository is mocked in the com.wisestep.app.repository.search test package.
     *
     * @see com.wisestep.app.repository.search.AppointmentSearchRepositoryMockConfiguration
     */
    @Autowired
    private AppointmentSearchRepository mockAppointmentSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restAppointmentMockMvc;

    private Appointment appointment;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AppointmentResource appointmentResource = new AppointmentResource(appointmentService);
        this.restAppointmentMockMvc = MockMvcBuilders.standaloneSetup(appointmentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Appointment createEntity() {
        Appointment appointment = new Appointment()
            .fixedDate(DEFAULT_FIXED_DATE)
            .symptoms(DEFAULT_SYMPTOMS)
            .status(DEFAULT_STATUS)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME);
        return appointment;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Appointment createUpdatedEntity() {
        Appointment appointment = new Appointment()
            .fixedDate(UPDATED_FIXED_DATE)
            .symptoms(UPDATED_SYMPTOMS)
            .status(UPDATED_STATUS)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);
        return appointment;
    }

    @BeforeEach
    public void initTest() {
        appointmentRepository.deleteAll();
        appointment = createEntity();
    }

    @Test
    public void createAppointment() throws Exception {
        int databaseSizeBeforeCreate = appointmentRepository.findAll().size();

        // Create the Appointment
        restAppointmentMockMvc.perform(post("/api/appointments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(appointment)))
            .andExpect(status().isCreated());

        // Validate the Appointment in the database
        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeCreate + 1);
        Appointment testAppointment = appointmentList.get(appointmentList.size() - 1);
        assertThat(testAppointment.getFixedDate()).isEqualTo(DEFAULT_FIXED_DATE);
        assertThat(testAppointment.getSymptoms()).isEqualTo(DEFAULT_SYMPTOMS);
        assertThat(testAppointment.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testAppointment.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testAppointment.getEndTime()).isEqualTo(DEFAULT_END_TIME);

        // Validate the Appointment in Elasticsearch
        verify(mockAppointmentSearchRepository, times(1)).save(testAppointment);
    }

    @Test
    public void createAppointmentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = appointmentRepository.findAll().size();

        // Create the Appointment with an existing ID
        appointment.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppointmentMockMvc.perform(post("/api/appointments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(appointment)))
            .andExpect(status().isBadRequest());

        // Validate the Appointment in the database
        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeCreate);

        // Validate the Appointment in Elasticsearch
        verify(mockAppointmentSearchRepository, times(0)).save(appointment);
    }


    @Test
    public void checkFixedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = appointmentRepository.findAll().size();
        // set the field null
        appointment.setFixedDate(null);

        // Create the Appointment, which fails.

        restAppointmentMockMvc.perform(post("/api/appointments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(appointment)))
            .andExpect(status().isBadRequest());

        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = appointmentRepository.findAll().size();
        // set the field null
        appointment.setStatus(null);

        // Create the Appointment, which fails.

        restAppointmentMockMvc.perform(post("/api/appointments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(appointment)))
            .andExpect(status().isBadRequest());

        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllAppointments() throws Exception {
        // Initialize the database
        appointmentRepository.save(appointment);

        // Get all the appointmentList
        restAppointmentMockMvc.perform(get("/api/appointments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appointment.getId())))
            .andExpect(jsonPath("$.[*].fixedDate").value(hasItem(DEFAULT_FIXED_DATE.toString())))
            .andExpect(jsonPath("$.[*].symptoms").value(hasItem(DEFAULT_SYMPTOMS.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }
    
    @Test
    public void getAppointment() throws Exception {
        // Initialize the database
        appointmentRepository.save(appointment);

        // Get the appointment
        restAppointmentMockMvc.perform(get("/api/appointments/{id}", appointment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(appointment.getId()))
            .andExpect(jsonPath("$.fixedDate").value(DEFAULT_FIXED_DATE.toString()))
            .andExpect(jsonPath("$.symptoms").value(DEFAULT_SYMPTOMS.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()));
    }

    @Test
    public void getNonExistingAppointment() throws Exception {
        // Get the appointment
        restAppointmentMockMvc.perform(get("/api/appointments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateAppointment() throws Exception {
        // Initialize the database
        appointmentService.save(appointment);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockAppointmentSearchRepository);

        int databaseSizeBeforeUpdate = appointmentRepository.findAll().size();

        // Update the appointment
        Appointment updatedAppointment = appointmentRepository.findById(appointment.getId()).get();
        updatedAppointment
            .fixedDate(UPDATED_FIXED_DATE)
            .symptoms(UPDATED_SYMPTOMS)
            .status(UPDATED_STATUS)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);

        restAppointmentMockMvc.perform(put("/api/appointments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAppointment)))
            .andExpect(status().isOk());

        // Validate the Appointment in the database
        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeUpdate);
        Appointment testAppointment = appointmentList.get(appointmentList.size() - 1);
        assertThat(testAppointment.getFixedDate()).isEqualTo(UPDATED_FIXED_DATE);
        assertThat(testAppointment.getSymptoms()).isEqualTo(UPDATED_SYMPTOMS);
        assertThat(testAppointment.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testAppointment.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testAppointment.getEndTime()).isEqualTo(UPDATED_END_TIME);

        // Validate the Appointment in Elasticsearch
        verify(mockAppointmentSearchRepository, times(1)).save(testAppointment);
    }

    @Test
    public void updateNonExistingAppointment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentRepository.findAll().size();

        // Create the Appointment

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentMockMvc.perform(put("/api/appointments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(appointment)))
            .andExpect(status().isBadRequest());

        // Validate the Appointment in the database
        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Appointment in Elasticsearch
        verify(mockAppointmentSearchRepository, times(0)).save(appointment);
    }

    @Test
    public void deleteAppointment() throws Exception {
        // Initialize the database
        appointmentService.save(appointment);

        int databaseSizeBeforeDelete = appointmentRepository.findAll().size();

        // Delete the appointment
        restAppointmentMockMvc.perform(delete("/api/appointments/{id}", appointment.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Appointment> appointmentList = appointmentRepository.findAll();
        assertThat(appointmentList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Appointment in Elasticsearch
        verify(mockAppointmentSearchRepository, times(1)).deleteById(appointment.getId());
    }

    @Test
    public void searchAppointment() throws Exception {
        // Initialize the database
        appointmentService.save(appointment);
        when(mockAppointmentSearchRepository.search(queryStringQuery("id:" + appointment.getId())))
            .thenReturn(Collections.singletonList(appointment));
        // Search the appointment
        restAppointmentMockMvc.perform(get("/api/_search/appointments?query=id:" + appointment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appointment.getId())))
            .andExpect(jsonPath("$.[*].fixedDate").value(hasItem(DEFAULT_FIXED_DATE.toString())))
            .andExpect(jsonPath("$.[*].symptoms").value(hasItem(DEFAULT_SYMPTOMS)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Appointment.class);
        Appointment appointment1 = new Appointment();
        appointment1.setId("id1");
        Appointment appointment2 = new Appointment();
        appointment2.setId(appointment1.getId());
        assertThat(appointment1).isEqualTo(appointment2);
        appointment2.setId("id2");
        assertThat(appointment1).isNotEqualTo(appointment2);
        appointment1.setId(null);
        assertThat(appointment1).isNotEqualTo(appointment2);
    }
}
