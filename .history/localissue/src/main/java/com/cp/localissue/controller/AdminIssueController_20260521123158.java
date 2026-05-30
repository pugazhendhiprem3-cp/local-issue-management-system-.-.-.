package com.cp.localissue.controller;

import com.cp.localissue.entity.Issue;
import com.cp.localissue.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/issues")
public class AdminIssueController {

    @Autowired
    private IssueRepository issueRepository;

    @PutMapping("/{id}/status")
    public Issue updateIssueStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Optional<Issue> optionalIssue = issueRepository.findById(id);

        if (optionalIssue.isPresent()) {

            Issue issue = optionalIssue.get();

            issue.setStatus(status);

            return issueRepository.save(issue);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Long id) {

        issueRepository.deleteById(id);

        return "Issue Deleted Successfully";
    }
}