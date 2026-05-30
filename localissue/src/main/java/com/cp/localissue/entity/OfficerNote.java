package com.cp.localissue.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class OfficerNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String note;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Issue getIssue() { return issue; }

    public void setId(Long id) { this.id = id; }
    public void setNote(String note) { this.note = note; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setIssue(Issue issue) { this.issue = issue; }
}