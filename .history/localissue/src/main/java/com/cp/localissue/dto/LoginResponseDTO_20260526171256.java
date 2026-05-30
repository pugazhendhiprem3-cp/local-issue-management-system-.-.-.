package com.cp.localissue.dto;

public class LoginResponseDTO {
    private String token;
    private String message;
    private String role;
    private Long userId;
    private String username;

    // Empty Constructor
    public LoginResponseDTO() {}

    // All-Args Constructor
    public LoginResponseDTO(String token, String message, String role) {
        this.token = token;
        this.message = message;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}