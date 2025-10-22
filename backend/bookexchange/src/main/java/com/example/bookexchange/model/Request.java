/* model/Request.java */
package com.example.bookexchange.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "requests") // safe (avoid singular "request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** title of the requested book */
    @Column(name = "book_title")
    private String title;

    /** optional author field (frontend Request.jsx includes author) */
    @Column(name = "book_author")
    private String author;

    /** requester's location (frontend uses user's college by default) */
    @Column(name = "request_location")
    private String location;

    /** free-text notes */
    @Column(name = "notes", length = 1500)
    private String notes;

    /** who requested (name or username) */
    @Column(name = "requester_name")
    private String requesterName;

    /** contact email and phone of requester — front-end sends these (requesterEmail, requesterPhone) */
    @Column(name = "requester_email")
    private String requesterEmail;

    @Column(name = "requester_phone")
    private String requesterPhone;
}