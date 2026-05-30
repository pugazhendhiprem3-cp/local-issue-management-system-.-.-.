package com.cp.localissue.repository;
import java.util.List;
import com.cp.localissue.entity.User;
import com.cp.localissue.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByCreatedBy(User user);
}