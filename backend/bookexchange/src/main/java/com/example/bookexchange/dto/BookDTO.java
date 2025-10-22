//dto/BookDTO.java//
package com.example.bookexchange.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String category;
    private String condition;   // "good", "fair", "new"
    private String type;        // "buy" or "borrow"
    private String price;
    private String imageURL;    // URL/path to uploaded file
}