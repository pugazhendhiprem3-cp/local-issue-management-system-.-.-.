package com.cp.localissue.controller;
import com.cp.localissue.dto.IssueResponseDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.cp.localissue.service.IssueService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private IssueService issueService;

    @GetMapping("/me")
    public Authentication getCurrentUser(
            Authentication authentication
    ) {

        return authentication;
    }

    @GetMapping("/my-issues")
public List<IssueResponseDTO> getMyIssues() {

    return issueService.getMyIssues();
}

@PostMapping("/login")
// 🟢 Use <?> so Spring allows any custom DTO inside the body
public ResponseEntity<?> login(@RequestBody com.cp.localissue.dto.LoginRequestDTO loginRequest) {
    
    // ... your token generation logic ...
    String token = jwtUtil.generateToken(loginRequest.getEmail());
    String role = "USER"; 

    // 🟢 This will now compile perfectly!
    return ResponseEntity.ok(new com.cp.localissue.dto.LoginResponseDTO(token, role));
}
}