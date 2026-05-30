package com.cp.localissue.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cp.localissue.entity.User;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}