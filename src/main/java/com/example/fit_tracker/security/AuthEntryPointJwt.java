//package com.example.fit_tracker.security;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.AuthenticationEntryPoint;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//
//@Component
//public class AuthEntryPointJwt implements AuthenticationEntryPoint {
//
//    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
//
//    @Override
//    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
//            throws IOException {
//        logger.error("Unauthorized error: {}", authException.getMessage());
//        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
//    }
//}


package com.example.fit_tracker.security;

import com.example.fit_tracker.exception.ErrorDetails; // Используем ваш класс для тела ответа
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Locale;

@Component
@RequiredArgsConstructor // Добавляем конструктор для инъекции
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
    private final MessageSource messageSource; // <<< ИНЪЕКЦИЯ MessageSource

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {

        logger.error("Unauthorized error: {}", authException.getMessage());

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 статус

        // 1. Получаем текущую локаль
        Locale currentLocale = LocaleContextHolder.getLocale();

        // 2. Локализуем общее сообщение об ошибке аутентификации
        String localizedMessage = messageSource.getMessage(
                "auth.bad.credentials", // Ключ для "Неверный логин или пароль"
                null,
                "Authentication Failed: Invalid username or password", // Сообщение по умолчанию
                currentLocale
        );

        // 3. Формируем тело ответа
        ErrorDetails errorDetails = new ErrorDetails("UNAUTHORIZED", localizedMessage);

        // 4. Записываем JSON в тело ответа
        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), errorDetails);
    }
}