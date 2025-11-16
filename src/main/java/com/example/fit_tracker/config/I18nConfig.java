package com.example.fit_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import java.util.Locale;

@Configuration
public class I18nConfig {

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();

        // Устанавливаем русский как дефолтную локаль, если заголовок не предоставлен
        localeResolver.setDefaultLocale(new Locale("ky"));

        // Можете добавить список поддерживаемых локалей для строгости, но для начала достаточно default
        return localeResolver;
    }
}