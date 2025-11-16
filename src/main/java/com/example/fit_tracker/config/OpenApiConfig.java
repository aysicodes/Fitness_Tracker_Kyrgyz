package com.example.fit_tracker.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Fit Tracker API (Diploma Project)",
                version = "1.0",
                description = "Документация REST API для фитнес-трекера. Проект содержит модули для аутентификации, управления активностями, тренировками и целями.",
                contact = @Contact(
                        name = "Aizirek Ibraimova",
                        email = "aizirek580@example.com"
                ),
                license = @License(
                        name = "Лицензия",
                        url = "http://www.example.com/license"
                )
        )
)
// Настройка для кнопки "Authorize" в Swagger UI
@SecurityScheme(
        name = "BearerAuth", // Имя, которое будет использоваться в контроллерах
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
    // Класс пустой, аннотации делают всю работу
}