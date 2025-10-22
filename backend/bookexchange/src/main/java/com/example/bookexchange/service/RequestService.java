//service/RequestService.java//
package com.example.bookexchange.service;

import com.example.bookexchange.model.Request;
import com.example.bookexchange.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public Optional<Request> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    public Request saveRequest(Request request) {
        return requestRepository.save(request);
    }

    public Optional<Request> updateRequest(Long id, Request updatedRequest) {
        return requestRepository.findById(id).map(existing -> {
            existing.setTitle(updatedRequest.getTitle());
            existing.setLocation(updatedRequest.getLocation());
            existing.setNotes(updatedRequest.getNotes());
            return requestRepository.save(existing);
        });
    }

    public boolean deleteRequest(Long id) {
        if (requestRepository.existsById(id)) {
            requestRepository.deleteById(id);
            return true;
        }
        return false;
    }
}