//package com.example.fit_tracker.controller;
//
//import com.example.fit_tracker.dto.JwtResponse;
//import com.example.fit_tracker.dto.LoginRequest;
//import com.example.fit_tracker.dto.MessageResponse;
//import com.example.fit_tracker.dto.SignupRequest;
//import com.example.fit_tracker.entity.ERole;
//import com.example.fit_tracker.entity.Role;
//import com.example.fit_tracker.entity.User;
//
//import com.example.fit_tracker.repository.RoleRepository;
//import com.example.fit_tracker.repository.UserRepository;
//import com.example.fit_tracker.security.JwtUtils;
//import com.example.fit_tracker.security.UserDetailsImpl;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@CrossOrigin(origins = "*", maxAge = 3600)
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthenticationManager authenticationManager;
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//    private final PasswordEncoder encoder;
//    private final JwtUtils jwtUtils;
//
//    @PostMapping("/signin")
//    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
//
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        String jwt = jwtUtils.generateJwtToken(authentication);
//
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(item -> item.getAuthority())
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(new JwtResponse(jwt,
//                userDetails.getId(),
//                userDetails.getUsername(),
//                userDetails.getEmail(),
//                roles));
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) { // Используем @RequestBody
//
//        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Username is already taken!"));
//        }
//
//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Email is already in use!"));
//        }
//
//        User user = new User(signUpRequest.getUsername(),
//                signUpRequest.getEmail(),
//                encoder.encode(signUpRequest.getPassword()));
//
//
//        Set<Role> roles = new HashSet<>();
//
//        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//
//        roles.add(userRole);
//
//        user.setRoles(roles);
//
//        userRepository.save(user);
//
//        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
//    }
//}




package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.JwtResponse;
import com.example.fit_tracker.dto.LoginRequest;
import com.example.fit_tracker.dto.MessageResponse;
import com.example.fit_tracker.dto.SignupRequest;
import com.example.fit_tracker.entity.ERole;
import com.example.fit_tracker.entity.Role;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.repository.RoleRepository;
import com.example.fit_tracker.repository.UserRepository;
import com.example.fit_tracker.security.JwtUtils;
import com.example.fit_tracker.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final MessageSource messageSource;

    @Operation(summary = "Аутентификация пользователя и выдача JWT")
    @PostMapping("/signin")
    // ИСПРАВЛЕНО: Указан конкретный тип JwtResponse и добавлена @Valid
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @Operation(summary = "Регистрация нового пользователя")
    @PostMapping("/signup")
    // ИСПРАВЛЕНО: Указан конкретный тип MessageResponse и добавлена @Valid
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        Locale currentLocale = LocaleContextHolder.getLocale();

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            String message = messageSource.getMessage("user.username.taken", null, currentLocale);
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(message));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            String message = messageSource.getMessage("user.email.inuse", null, currentLocale);
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(message));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        roles.add(userRole);

        user.setRoles(roles);

        userRepository.save(user);

        String successMessage = messageSource.getMessage("user.registered.success", null, currentLocale);
        return ResponseEntity.ok(new MessageResponse(successMessage));
    }
}