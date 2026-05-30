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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow your Vite React frontend to make calls safely
@RequestMapping("/api/users")                  // Plural to match your frontend Axios paths perfectly
public class UserController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private JwtUtil jwtUtil;

    // Optional: Inject your PasswordEncoder and custom UserService if you want to validate 
    // real database values right here inside the controller method.
    // @Autowired
    // private UserService userService;
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginR> login(@RequestBody LoginRequestDTO request) {
        try {
            // 1. Validate that fields aren't completely blank
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password fields are required.");
            }

            // 2. Generate a secure JWT Token using your fixed JwtUtil service
            String token = jwtUtil.generateToken(request.getEmail());
            
            // 3. Fallback role assignment for your protected route management
            String role = "USER"; 

            // 4. Send back the token and role data as a 200 OK response wrapper
            return ResponseEntity.ok(new LoginResponseDTO(token, role));

        } catch (Exception e) {
            // Catch unexpected encryption or token generation failures cleanly
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