package com.cp.localissue.service;

import com.cp.localissue.entity.OfficerNote;
import com.cp.localissue.entity.User;
import com.cp.localissue.entity.Issue;
import com.cp.localissue.dto.IssueRequestDTO;
import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.dto.OfficerNoteDTO;
import com.cp.localissue.repository.IssueRepository;
import com.cp.localissue.repository.OfficerNoteRepository;
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
    private OfficerNoteRepository officerNoteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    private final String UPLOAD_DIR = "uploads/";

    // ====== HELPER: map notes list to DTOs ======
    private List<OfficerNoteDTO> mapNotes(Issue issue) {
        return issue.getOfficerNotes().stream().map(n -> {
            OfficerNoteDTO dto = new OfficerNoteDTO();
            dto.setId(n.getId());
            dto.setNote(n.getNote());
            dto.setCreatedAt(n.getCreatedAt());
            return dto;
        }).toList();
    }

    // ====== HELPER: build IssueResponseDTO from Issue ======
    private IssueResponseDTO toResponseDTO(Issue issue) {
        IssueResponseDTO response = new IssueResponseDTO();
        response.setId(issue.getId());
        response.setTitle(issue.getTitle());
        response.setDescription(issue.getDescription());
        response.setLocation(issue.getLocation());
        response.setCategory(issue.getCategory());
        response.setStatus(issue.getStatus());
        response.setCreatedAt(issue.getCreatedAt());
        response.setImageUrl(issue.getImageUrl());
        response.setOfficerNotes(mapNotes(issue));

        if (issue.getCreatedBy() != null) {
            response.setCreatedByName(issue.getCreatedBy().getName());
        } else {
            response.setCreatedByName("Anonymous");
        }

        return response;
    }

    // ====== CREATE ======
    public IssueResponseDTO createIssue(IssueRequestDTO dto) {

        Issue issue = new Issue();
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setLocation(dto.getLocation());
        issue.setCategory(dto.getCategory());
        issue.setStatus("PENDING");

        MultipartFile imageFile = dto.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                File uploadFolder = new File(UPLOAD_DIR);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();
                }
                String uniqueFileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
                Path targetPath = Paths.get(UPLOAD_DIR + uniqueFileName);
                Files.copy(imageFile.getInputStream(), targetPath);
                issue.setImageUrl("/uploads/" + uniqueFileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to write image to disk", e);
            }
        }

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

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        issue.setCreatedBy(user);

        Issue savedIssue = issueRepository.save(issue);

        return toResponseDTO(savedIssue);
    }

    // ====== GET MY ISSUES ======
    public List<IssueResponseDTO> getMyIssues() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Issue> issues = issueRepository.findByCreatedBy(user);

        List<IssueResponseDTO> responseList = new ArrayList<>();
        for (Issue issue : issues) {
            responseList.add(toResponseDTO(issue));
        }

        return responseList;
    }

    // ====== GET ALL ISSUES ======
    public List<IssueResponseDTO> getAllIssues() {
        return issueRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // ====== DELETE ======
    public void deleteIssue(Long id) {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        boolean isOwner =
                issue.getCreatedBy() != null &&
                issue.getCreatedBy().getId().equals(currentUser.getId());

        boolean isAdmin = currentUser.getRole().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized");
        }

        issueRepository.delete(issue);
    }

    // ====== UPDATE ISSUE ======
    public IssueResponseDTO updateIssue(Long id, IssueRequestDTO dto) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setLocation(dto.getLocation());
        issue.setCategory(dto.getCategory());

        Issue updatedIssue = issueRepository.save(issue);

        return toResponseDTO(updatedIssue);
    }

    // ====== UPDATE STATUS ======
    public IssueResponseDTO updateIssueStatus(Long id, String status) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setStatus(status);

        return toResponseDTO(issueRepository.save(issue));
    }

    // ====== ADD OFFICER NOTE (appends, never overwrites) ======
    public IssueResponseDTO updateOfficerNote(Long id, String note) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        OfficerNote officerNote = new OfficerNote();
        officerNote.setNote(note);
        officerNote.setIssue(issue);
        officerNoteRepository.save(officerNote);

        // Reload fresh from DB to get updated notes list
        Issue refreshed = issueRepository.findById(id).get();
        return toResponseDTO(refreshed);
    }
}