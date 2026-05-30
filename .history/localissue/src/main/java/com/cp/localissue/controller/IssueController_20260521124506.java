package com.cp.localissue.controller;

import com.cp.localissue.entity.Issue;
import com.cp.localissue.service.IssueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    // CREATE
    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        return issueService.createIssue(issue);
    }

    // READ
    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Long id) {

        issueService.deleteIssue(id);

        return "Issue Deleted Successfully";
    }
}