package com.cp.localissue.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class IssueResponseDTO {

    private Long id;

    private String title;

    private String description;

    private String location;

    private String category;

    private String status;

    private LocalDateTime createdAt;

    private String imageUrl;

    private String createdByName;

    private List<OfficerNoteDTO> officerNotes = new ArrayList<>();

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public String getCategory() {
        return category;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getImageUrl() 
    {
        return imageUrl;
    }

    public String getCreatedByName() {
    return createdByName;
}

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setImageUrl(String imageUrl) 
    {
        this.imageUrl = imageUrl;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public List<OfficerNoteDTO> getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(List<OfficerNoteDTO> officerNotes) { this.officerNotes = officerNotes; }}
}