package com.example.bookexchange.dto;

import java.util.List;

public class RegisterRequest {
    private String name;
    private String username;
    private String email;
    private String phone;
    private String college;
    private String password;
    private List<String> interests;

    public RegisterRequest() {}

    public RegisterRequest(String name, String username, String email, String phone, String college, String password, List<String> interests) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.college = college;
        this.password = password;
        this.interests = interests;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
}
