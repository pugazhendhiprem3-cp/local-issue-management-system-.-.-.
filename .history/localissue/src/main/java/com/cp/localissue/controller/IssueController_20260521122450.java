package com.cp.localissue.controller;

import com.cp.localissue.entity.Issue;
import com.cp.localissue.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        return issueRepository.save(issue);
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }
    
}