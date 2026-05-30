package com.cp.localissue.dto;

import java.time.LocalDateTime;

public class OfficerNoteDTO {
    private Long id;
    private String note;
    private LocalDateTime createdAt;

    // Getters & Setters
    public Long getId() { return id; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setNote(String note) { this.note = note; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}