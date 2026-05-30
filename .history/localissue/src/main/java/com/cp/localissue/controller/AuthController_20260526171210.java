package com.cp.localissue.controller;

import com.cp.localissue.dto.LoginRequestDTO;
import com.cp.localissue.dto.LoginResponseDTO;
import com.cp.localissue.dto.UserRequestDTO;
import com.cp.localissue.dto.UserResponseDTO;
import com.cp.localissue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")           // ✅ Matches Login.jsx → /api/auth/login
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")            // ✅ Full path: /api/auth/signup
    public ResponseEntity<?> signup(@RequestBody UserRequestDTO request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password are required.");
            }
            UserResponseDTO response = userService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Signup failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")             // ✅ Full path: /api/auth/login
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password are required.");
            }
            LoginResponseDTO response = userService.login(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // "Invalid Email" or "Invalid Password" from UserService
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }
}