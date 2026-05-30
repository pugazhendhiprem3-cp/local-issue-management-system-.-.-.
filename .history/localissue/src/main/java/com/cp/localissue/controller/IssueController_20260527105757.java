package com.cp.localissue.controller;

import com.cp.localissue.dto.IssueRequestDTO;
import com.cp.localissue.dto.IssueResponseDTO;
import com.cp.localissue.entity.Issue;
import com.cp.localissue.dto.StatusUpdateDTO;
import com.cp.localissue.service.IssueService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    // CREATE
   @PostMapping(consumes = "multipart/form-data")
    public IssueResponseDTO createIssue(
        @ModelAttribute IssueRequestDTO dto) {

    return issueService.createIssue(dto);
}

    // READ
    @GetMapping
    public List<IssueResponseDTO> getAllIssues() {
        return issueService.getAllIssues();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Long id) {

        issueService.deleteIssue(id);

        return "Issue Deleted Successfully";
    }

    @PatchMapping("/{id}/status")
    public Issue updateIssueStatus(
        @PathVariable Long id,
        @ModelAttribute StatusUpdateDTO dto
    )   
    {

    return issueService.updateIssueStatus(
            id,
            dto.getStatus()
    );
    }

    @PatchMapping("/{id}/note")
public Issue updateOfficerNote(

        @PathVariable Long id,

        @RequestBody java.util.Map<String, String> body
) {

    String note = body.get("officerNote");

    return issueService.updateOfficerNote(
            id,
            note
    );
}

    @PutMapping("/{id}")
    public IssueResponseDTO updateIssue(
            @PathVariable Long id,
            @RequestBody IssueRequestDTO dto
    ) {

        return issueService.updateIssue(id, dto);
    }
}