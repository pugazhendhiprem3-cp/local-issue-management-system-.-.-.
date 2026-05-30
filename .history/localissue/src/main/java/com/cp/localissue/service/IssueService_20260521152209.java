package com.cp.localissue.service;

import com.cp.localissue.entity.Issue;
import com.cp.localissue.dto.IssueRequestDTO;
import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    // CREATE
    public IssueResponseDTO createIssue(IssueRequestDTO dto) {

    Issue issue = new Issue();

    issue.setTitle(dto.getTitle());
    issue.setDescription(dto.getDescription());
    issue.setLocation(dto.getLocation());
    issue.setCategory(dto.getCategory());
    issue.setImageUrl(dto.getImageUrl());

    Issue savedIssue = issueRepository.save(issue);

    IssueResponseDTO response = new IssueResponseDTO();

    response.setId(savedIssue.getId());
    response.setTitle(savedIssue.getTitle());
    response.setDescription(savedIssue.getDescription());
    response.setLocation(savedIssue.getLocation());
    response.setCategory(savedIssue.getCategory());
    response.setStatus(savedIssue.getStatus());
    response.setCreatedAt(savedIssue.getCreatedAt());
    response.setImageUrl(savedIssue.getImageUrl());

    return response;
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

        return response;

    }).toList();
}

    // DELETE
    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    public Issue updateIssueStatus(Long id, String status) {

    Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Issue Not Found"));

    issue.setStatus(status);

    return issueRepository.save(issue);
}
}