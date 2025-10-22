/* model/User.java */
package com.example.bookexchange.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users") // "users" is safe, "user" would not be
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // explicit
    private Long id;

    /** Visible name (Full name) */
    @Column(name = "full_name")
    private String name;

    /** username used in frontend uploads/login — optional */
    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "college")
    private String college;

    /** store hashed password in real app; frontend currently sends plain password */
    @Column(name = "password")
    private String password;

    /**
     * Simple list of interests (Science, Technology, etc.)
     * Stored in separate table USERS_INTERESTS (JPA ElementCollection)
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "interest")
    @Builder.Default
    private List<String> interests = new ArrayList<>();
}