package com.cp.localissue.service;
import com.cp.localissue.dto.LoginRequestDTO;
import com.cp.localissue.dto.LoginResponseDTO;
import com.cp.localissue.dto.UserRequestDTO;
import com.cp.localissue.dto.UserResponseDTO;
import com.cp.localissue.entity.User;
import com.cp.localissue.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cp.localissue.security.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
private JwtUtil jwtUtil;

    public UserResponseDTO signup(UserRequestDTO dto) {

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(
        passwordEncoder.encode(dto.getPassword()));
        user.setPassword(
        passwordEncoder.encode(dto.getPassword()));
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

    public LoginResponseDTO login(LoginRequestDTO dto) {

    User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() ->
                    new RuntimeException("Invalid Email"));

    boolean passwordMatches =
            passwordEncoder.matches(
                    dto.getPassword(),
                    user.getPassword());

    if (!passwordMatches) {
        throw new RuntimeException("Invalid Password");
    }

    LoginResponseDTO response =
            new LoginResponseDTO();

    response.setMessage("Login Successful");
    response.setRole(user.getRole());

    return response;
}
}