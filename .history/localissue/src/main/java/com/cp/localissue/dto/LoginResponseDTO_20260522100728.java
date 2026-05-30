package com.cp.localissue.dto;

public class LoginResponseDTO {

    private String message;

    private String role;

    private String token;

    // GETTERS

    public String getMessage() {
        return message;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;  
    }

    // SETTERS

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setToken(String token) {
    this.token = token;
        }
}