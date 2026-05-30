package com.cp.localissue.service;

import com.cp.localissue.entity.User;
import com.cp.localissue.entity.Issue;
import com.cp.localissue.dto.IssueRequestDTO;
import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.repository.IssueRepository;
import com.cp.localissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class IssueService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    // 🟢 Root folder path on your computer disk where uploads are written
    private final String UPLOAD_DIR = "uploads/";

    // CREATE
    public IssueResponseDTO createIssue(IssueRequestDTO dto) {

        Issue issue = new Issue();
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setLocation(dto.getLocation());
        issue.setCategory(dto.getCategory());
        issue.setStatus("PENDING"); // Set default status explicitly

        // 🟢 1. HANDLE FILE UPLOAD LOGIC DIRECTLY FROM MULTIPART STREAM
        MultipartFile imageFile = dto.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // Ensure directory folder exists
                File uploadFolder = new File(UPLOAD_DIR);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();
                }
                // Generate unique filename to eliminate naming duplicates
                String uniqueFileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
                Path targetPath = Paths.get(UPLOAD_DIR + uniqueFileName);

                // Copy input stream bytes straight onto the disk
                Files.copy(imageFile.getInputStream(), targetPath);

                // Set relative URL path pointing to resource endpoint for retrieval later
                issue.setImageUrl("/uploads/" + uniqueFileName);

            } catch (IOException e) {
                throw new RuntimeException("Failed to write profile upload file image to disk storage directory", e);
            }
        }

        // 🟢 GET AUTHENTICATED USER FROM JWT
Object principal = SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal();

String email;

if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
    email = userDetails.getUsername();
} else {
    email = principal.toString();
}

System.out.println("Authenticated User Email: " + email);

// 🟢 FETCH USER FROM DATABASE
User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

issue.setCreatedBy(user);

        Issue savedIssue = issueRepository.save(issue);

        // Convert Saved Issue back into Response Layout
        IssueResponseDTO response = new IssueResponseDTO();
        response.setId(savedIssue.getId());
        response.setTitle(savedIssue.getTitle());
        response.setDescription(savedIssue.getDescription());
        response.setLocation(savedIssue.getLocation());
        response.setCategory(savedIssue.getCategory());
        response.setStatus(savedIssue.getStatus());
        response.setCreatedAt(savedIssue.getCreatedAt());
        response.setImageUrl(savedIssue.getImageUrl());

        if (savedIssue.getCreatedBy() != null) {
            response.setCreatedByName(savedIssue.getCreatedBy().getName());
        } 
        else {
            response.setCreatedByName("Anonymous");
        }

        return response;
    }

    public List<IssueResponseDTO> getMyIssues() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Issue> issues = issueRepository.findByCreatedBy(user);
        List<IssueResponseDTO> responseList = new ArrayList<>();

        for (Issue issue : issues) {
            IssueResponseDTO dto = new IssueResponseDTO();
            dto.setId(issue.getId());
            dto.setTitle(issue.getTitle());
            dto.setDescription(issue.getDescription());
            dto.setLocation(issue.getLocation());
            dto.setCategory(issue.getCategory());
            dto.setStatus(issue.getStatus());
            dto.setImageUrl(issue.getImageUrl());
            dto.setCreatedAt(issue.getCreatedAt());

            if (issue.getCreatedBy() != null) {
                dto.setCreatedByName(issue.getCreatedBy().getName());
            } else {
                dto.setCreatedByName("Anonymous");
            }

            responseList.add(dto);
        }
        return responseList;
    }

    // READ
    public List<IssueResponseDTO> getAllIssues() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(issue -> {
            IssueResponseDTO response = new IssueResponseDTO();
            response.setId(issue.getId());
            response.setTitle(issue.getTitle());
            response.setDescription(issue.getDescription());
            response.setLocation(issue.getLocation());
            response.setCategory(issue.getCategory());
            response.setStatus(issue.getStatus());
            response.setCreatedAt(issue.getCreatedAt());
           response.setImageUrl(issue.getImageUrl());

            if (issue.getCreatedBy() != null) {
                response.setCreatedByName(issue.getCreatedBy().getName());
            } else {
            response.setCreatedByName("Anonymous");
            }

return response;
            return response;
        }).toList();
    }

    // DELETE
    // Change deleteIssue and updateIssueStatus to use Objects.requireNonNull:

public void deleteIssue(Long id) {
    issueRepository.deleteById(java.util.Objects.requireNonNull(id)); // ✅ fixes null safety warning
}

public Issue updateIssueStatus(Long id, String status) {
    Issue issue = issueRepository.findById(java.util.Objects.requireNonNull(id)) // ✅ same fix
            .orElseThrow(() -> new RuntimeException("Issue Not Found"));
    issue.setStatus(status);
    return issueRepository.save(issue);
}
}