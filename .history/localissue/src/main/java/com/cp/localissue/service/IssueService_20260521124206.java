package com.cp.localissue.service;

import com.cp.localissue.entity.Issue;
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
}