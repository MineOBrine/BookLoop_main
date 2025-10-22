//dto/UserDTO.java//
package com.example.bookexchange.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String phone;
    private String college;
    private List<String> interests;
}