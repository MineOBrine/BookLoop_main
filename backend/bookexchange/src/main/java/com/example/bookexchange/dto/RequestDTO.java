//dto/RequestDTO.java//
package com.example.bookexchange.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDTO {
    private Long id;
    private String title;
    private String author;        // optional
    private String location;
    private String notes;
    private String requesterName;
    private String requesterEmail;
    private String requesterPhone;
}