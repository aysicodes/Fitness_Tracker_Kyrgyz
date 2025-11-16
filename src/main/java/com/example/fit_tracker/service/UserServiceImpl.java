//package com.example.fit_tracker.service;
//
//
//import com.example.fit_tracker.dto.UserProfileRequest;
//import com.example.fit_tracker.entity.User;
//import com.example.fit_tracker.repository.UserRepository;
//import jakarta.persistence.EntityNotFoundException;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class UserServiceImpl implements UserService {
//
//    private final UserRepository userRepository;
//
//    @Override
//    public User getCurrentUser() {
//        // Получаем имя пользователя из контекста Spring Security
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        // Ищем пользователя в базе данных
//        return userRepository.findByUsername(username)
//                .orElseThrow(() -> new EntityNotFoundException("User not found in security context or database."));
//    }
//
//    @Override
//    public User updateProfile(User user, UserProfileRequest profileRequest) {
//        // Логика обновления: проверяем, какие поля пришли и обновляем
//        if (profileRequest.getFirstName() != null) {
//            user.setFirstName(profileRequest.getFirstName());
//        }
//        if (profileRequest.getLastName() != null) {
//            user.setLastName(profileRequest.getLastName());
//        }
//        if (profileRequest.getAge() != null) {
//            user.setAge(profileRequest.getAge());
//        }
//        if (profileRequest.getGender() != null) {
//            user.setGender(profileRequest.getGender());
//        }
//        if (profileRequest.getWeight() != null) {
//            user.setWeight(profileRequest.getWeight());
//        }
//        if (profileRequest.getHeight() != null) {
//            user.setHeight(profileRequest.getHeight());
//        }
//
//        // Сохраняем обновленную сущность и возвращаем ее
//        return userRepository.save(user);
//    }
//}
//




package com.example.fit_tracker.service;


import com.example.fit_tracker.dto.UserProfileRequest;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource; // <<< Добавлено
import org.springframework.context.i18n.LocaleContextHolder; // <<< Добавлено
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale; // <<< Добавлено
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final MessageSource messageSource; // <<< Добавлено
//    private final PasswordResetTokenRepository tokenRepository;
//    private final PasswordEncoder passwordEncoder;
    ////    private final EmailService emailService;

    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("auth.user.not.found", null, currentLocale);

        // Ищем пользователя в базе данных
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg)); // <<< Локализовано
    }

    @Override
    public User updateProfile(User user, UserProfileRequest profileRequest) {
        // Логика обновления: проверяем, какие поля пришли и обновляем
        if (profileRequest.getFirstName() != null) {
            user.setFirstName(profileRequest.getFirstName());
        }
        if (profileRequest.getLastName() != null) {
            user.setLastName(profileRequest.getLastName());
        }
        if (profileRequest.getAge() != null) {
            user.setAge(profileRequest.getAge());
        }
        if (profileRequest.getGender() != null) {
            user.setGender(profileRequest.getGender());
        }
        if (profileRequest.getWeight() != null) {
            user.setWeight(profileRequest.getWeight());
        }
        if (profileRequest.getHeight() != null) {
            user.setHeight(profileRequest.getHeight());
        }

        // Сохраняем обновленную сущность и возвращаем ее
        return userRepository.save(user);
    }
}
