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
    public Issue createIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    // READ
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
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