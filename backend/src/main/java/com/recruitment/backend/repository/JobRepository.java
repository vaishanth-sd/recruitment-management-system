
package com.recruitment.backend.repository;

import com.recruitment.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
