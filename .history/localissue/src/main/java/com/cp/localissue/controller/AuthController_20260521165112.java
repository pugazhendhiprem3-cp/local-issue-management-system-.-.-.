package com.cp.localissue.controller;

import com.cp.localissue.dto.UserRequestDTO;
import com.cp.localissue.dto.UserResponseDTO;
import com.cp.localissue.service.UserService;
import com.cp.localissue.dto.LoginRequestDTO;
import com.cp.localissue.dto.LoginResponseDTO;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public UserResponseDTO signup(
            @Valid @RequestBody UserRequestDTO dto) {

        return userService.signup(dto);
    }
    @PostMapping("/login")
    public LoginResponseDTO login(
        @Valid @RequestBody LoginRequestDTO dto) {

    return userService.login(dto);
}
}
