package com.example.fit_tracker.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Arrays;
import java.util.Locale;

@Configuration
public class I18nConfig {

    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        // Указываем базовое имя файлов: messages.properties, messages_ru.properties и т...
        source.setBasenames("messages");
        source.setDefaultEncoding("UTF-8");
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }

    // 2. Создание LocaleResolver для чтения локали из заголовка Accept-Language
    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();

        // Устанавливаем язык по умолчанию
        localeResolver.setDefaultLocale(new Locale("ky"));

        // Обязательно указываем список поддерживаемых локалей, чтобы Spring знал, что читать
        localeResolver.setSupportedLocales(Arrays.asList(new Locale("ky"), new Locale("ru"), new Locale("en")));

        return localeResolver;
    }
}