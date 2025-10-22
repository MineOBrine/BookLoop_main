//repository/RequestRepository.java//
package com.example.bookexchange.repository;

import com.example.bookexchange.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByRequesterEmail(String requesterEmail); // for Profile page
    List<Request> findByLocationContainingIgnoreCase(String location);
    List<Request> findByTitleContainingIgnoreCase(String title);
}