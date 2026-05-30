package com.cp.localissue.controller;

import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.service.IssueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/issues")
public class AdminIssueController {

    @Autowired
    private IssueService issueService;

    @PutMapping("/{id}/status")
    public IssueResponseDTO updateIssueStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return issueService.updateIssueStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Long id) {

        issueService.deleteIssue(id);

        return "Issue Deleted Successfully";
    }
}