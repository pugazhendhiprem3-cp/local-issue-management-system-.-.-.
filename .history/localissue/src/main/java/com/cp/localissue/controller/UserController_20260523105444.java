package com.cp.localissue.controller;

import com.cp.localissue.dto.LoginRequestDTO;
import com.cp.localissue.dto.LoginResponseDTO;
import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.service.IssueService;
import com.cp.localissue.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {  // ✅ Fix 1: <?> instead of <LoginR>
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password fields are required.");
            }

            // ✅ Fix 2: Pass both email AND role (or password) to match generateToken(String, String)
            String role = "USER";
            String token = jwtUtil.generateToken(request.getEmail(), role);

            return ResponseEntity.ok(new LoginResponseDTO(token, role));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public Authentication getCurrentUser(Authentication authentication) {
        return authentication;
    }

    @GetMapping("/my-issues")
    public List<IssueResponseDTO> getMyIssues() {
        return issueService.getMyIssues();
    }
}