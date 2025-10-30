package com.example.bookexchange.controller;

import com.example.bookexchange.model.Request;
import com.example.bookexchange.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests") // ✅ unified with frontend URLs
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class RequestController {

    @Autowired
    private RequestService requestService;

    // 🔹 Get all requests
    @GetMapping
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    // 🔹 Get all requests by user email
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Request>> getRequestsByUser(@PathVariable String email) {
        List<Request> requests = requestService.getRequestsByUser(email);
        return requests.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(requests);
    }

    // 🔹 Get request by ID
    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Optional<Request> request = requestService.getRequestById(id);
        return request.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Create new request
    @PostMapping
    public Request createRequest(@RequestBody Request request) {
        return requestService.saveRequest(request);
    }

    // 🔹 Update request
    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @RequestBody Request updatedRequest) {
        Optional<Request> request = requestService.updateRequest(id, updatedRequest);
        return request.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Delete request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        if (requestService.deleteRequest(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
