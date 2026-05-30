package com.cp.localissue.controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.cp.localissue.service.IssueService;
import java.util.List;
import com.cp.localissue.dto.*;
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

}