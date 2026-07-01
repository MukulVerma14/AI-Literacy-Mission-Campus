CREATE TABLE ailmc_assessments
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    mentee_id       BIGINT NOT NULL,
    type            VARCHAR(255) NULL,
    score DOUBLE NULL,
    mentor_feedback TEXT NULL,
    graded_at       datetime NULL,
    CONSTRAINT pk_ailmc_assessments PRIMARY KEY (id)
);

CREATE TABLE ailmc_attendance
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    session_id BIGINT NOT NULL,
    mentee_id  BIGINT NOT NULL,
    is_present BIT(1) NULL,
    marked_at  datetime NULL,
    CONSTRAINT pk_ailmc_attendance PRIMARY KEY (id)
);

CREATE TABLE ailmc_certifications
(
    id                 BIGINT AUTO_INCREMENT NOT NULL,
    mentee_id          BIGINT NOT NULL,
    capstone_completed BIT(1) NULL,
    mentor_rating      INT NULL,
    processing_fee_amount DOUBLE NULL,
    fee_status         VARCHAR(255) NULL,
    issued_at          datetime NULL,
    paid_at            datetime NULL,
    CONSTRAINT pk_ailmc_certifications PRIMARY KEY (id)
);

CREATE TABLE ailmc_cohorts
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    cohort_name      VARCHAR(255) NULL,
    city             VARCHAR(255) NULL,
    schedule_options VARCHAR(255) NULL,
    max_size         INT NULL,
    status           VARCHAR(255) NULL,
    mentor_id        BIGINT NOT NULL,
    CONSTRAINT pk_ailmc_cohorts PRIMARY KEY (id)
);

CREATE TABLE ailmc_mentees
(
    id                   BIGINT AUTO_INCREMENT NOT NULL,
    user_id              BIGINT NOT NULL,
    current_job_function VARCHAR(255) NULL,
    occupation           VARCHAR(255) NULL,
    city                 VARCHAR(255) NULL,
    target_skill         VARCHAR(255) NULL,
    ai_goal              VARCHAR(255) NULL,
    cohort_id            BIGINT NULL,
    CONSTRAINT pk_ailmc_mentees PRIMARY KEY (id)
);

CREATE TABLE ailmc_mentors
(
    id                BIGINT AUTO_INCREMENT NOT NULL,
    user_id           BIGINT NOT NULL,
    college_name      VARCHAR(255) NULL,
    tech_stack        VARCHAR(255) NULL,
    city              VARCHAR(255) NULL,
    preferred_domains VARCHAR(255) NULL,
    linkedin_url      VARCHAR(255) NULL,
    CONSTRAINT pk_ailmc_mentors PRIMARY KEY (id)
);

CREATE TABLE ailmc_progress_logs
(
    id                        BIGINT AUTO_INCREMENT NOT NULL,
    mentee_id                 BIGINT NOT NULL,
    track_type                VARCHAR(255) NULL,
    hours_completed           INT NULL,
    topic_covered             VARCHAR(255) NULL,
    learning_outcome_notes    TEXT NULL,
    productivity_impact_notes TEXT NULL,
    logged_at                 datetime NULL,
    CONSTRAINT pk_ailmc_progress_logs PRIMARY KEY (id)
);

CREATE TABLE ailmc_sessions
(
    id           BIGINT AUTO_INCREMENT NOT NULL,
    cohort_id    BIGINT NOT NULL,
    day_number   INT NULL,
    topic        VARCHAR(255) NULL,
    scheduled_at datetime NULL,
    mode         VARCHAR(255) NULL,
    CONSTRAINT pk_ailmc_sessions PRIMARY KEY (id)
);

CREATE TABLE users
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    `role`     VARCHAR(255) NOT NULL,
    created_at datetime NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE ailmc_certifications
    ADD CONSTRAINT uc_ailmc_certifications_mentee UNIQUE (mentee_id);

ALTER TABLE ailmc_mentees
    ADD CONSTRAINT uc_ailmc_mentees_user UNIQUE (user_id);

ALTER TABLE ailmc_mentors
    ADD CONSTRAINT uc_ailmc_mentors_user UNIQUE (user_id);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE ailmc_assessments
    ADD CONSTRAINT FK_AILMC_ASSESSMENTS_ON_MENTEE FOREIGN KEY (mentee_id) REFERENCES ailmc_mentees (id);

ALTER TABLE ailmc_attendance
    ADD CONSTRAINT FK_AILMC_ATTENDANCE_ON_MENTEE FOREIGN KEY (mentee_id) REFERENCES ailmc_mentees (id);

ALTER TABLE ailmc_attendance
    ADD CONSTRAINT FK_AILMC_ATTENDANCE_ON_SESSION FOREIGN KEY (session_id) REFERENCES ailmc_sessions (id);

ALTER TABLE ailmc_certifications
    ADD CONSTRAINT FK_AILMC_CERTIFICATIONS_ON_MENTEE FOREIGN KEY (mentee_id) REFERENCES ailmc_mentees (id);

ALTER TABLE ailmc_cohorts
    ADD CONSTRAINT FK_AILMC_COHORTS_ON_MENTOR FOREIGN KEY (mentor_id) REFERENCES ailmc_mentors (id);

ALTER TABLE ailmc_mentees
    ADD CONSTRAINT FK_AILMC_MENTEES_ON_COHORT FOREIGN KEY (cohort_id) REFERENCES ailmc_cohorts (id);

ALTER TABLE ailmc_mentees
    ADD CONSTRAINT FK_AILMC_MENTEES_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE ailmc_mentors
    ADD CONSTRAINT FK_AILMC_MENTORS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE ailmc_progress_logs
    ADD CONSTRAINT FK_AILMC_PROGRESS_LOGS_ON_MENTEE FOREIGN KEY (mentee_id) REFERENCES ailmc_mentees (id);

ALTER TABLE ailmc_sessions
    ADD CONSTRAINT FK_AILMC_SESSIONS_ON_COHORT FOREIGN KEY (cohort_id) REFERENCES ailmc_cohorts (id);

