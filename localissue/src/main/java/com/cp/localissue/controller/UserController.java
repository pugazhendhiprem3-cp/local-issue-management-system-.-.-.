package com.cp.localissue.controller;
import com.cp.localissue.dto.LoginRequestDTO;
import com.cp.localissue.dto.LoginResponseDTO;
import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.service.IssueService;
import com.cp.localissue.service.UserService;          // ✅ Add this
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
    private UserService userService;               // ✅ Add this — was missing entirely

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {  // ✅ <?> fixes the LoginR error
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password fields are required.");
            }

            // ✅ Delegate to UserService — handles DB lookup, password check, token generation
            LoginResponseDTO response = userService.login(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Handles "Invalid Email" and "Invalid Password" thrown by UserService
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());

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