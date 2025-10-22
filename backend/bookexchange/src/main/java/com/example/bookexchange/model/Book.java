/* model/Book.java */
package com.example.bookexchange.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books") // safe, avoids reserved "book"
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "category")
    private String category;

    @Column(name = "book_condition")  // avoid reserved keyword
    private String condition; // e.g. "good", "fair", "new"

    @Column(name = "book_type")       // avoid reserved keyword
    private String type; // "buy" or "borrow"

    @Column(name = "price")
    private String price;

    @Column(name = "owner")
    private String owner;

    @Column(name = "owner_email")
    private String ownerEmail;

    @Column(name = "owner_phone")
    private String ownerPhone;

    @Column(name = "image_url")       // ensure clean naming
    private String imageURL; // stored path/URL for the uploaded file
}