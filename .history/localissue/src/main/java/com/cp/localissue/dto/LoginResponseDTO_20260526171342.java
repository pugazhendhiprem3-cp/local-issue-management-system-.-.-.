package com.cp.localissue.dto;

public class LoginResponseDTO {

    private String token;
    private String message;
    private String role;
    private Long userId;
    private String username;

    // Empty Constructor
    public LoginResponseDTO() {}

    // Full Constructor
    public LoginResponseDTO(
            String token,
            String message,
            String role,
            Long userId,
            String username
    ) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.userId = userId;
        this.username = username;
    }

    // TOKEN
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // MESSAGE
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // ROLE
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // USER ID
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // USERNAME
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}