package com.cp.localissue.service;

import com.cp.localissue.dto.UserRequestDTO;
import com.cp.localissue.dto.UserResponseDTO;
import com.cp.localissue.entity.User;
import com.cp.localissue.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDTO signup(UserRequestDTO dto) {

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(
        passwordEncoder.encode(dto.getPassword()));
        user.setPassword(dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber());

        User savedUser = userRepository.save(user);

        UserResponseDTO response = new UserResponseDTO();

        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());
        response.setRole(savedUser.getRole());

        return response;
    }
}