package com.example.fit_tracker.service;

import com.example.fit_tracker.entity.TranslationMessage;
import com.example.fit_tracker.repository.TranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TranslationService {

    private final TranslationRepository translationRepository;

    /**
     * Возвращает переведенный текст по ключу для текущей локали пользователя.
     *
     * @param translationKey Ключ, который нужно перевести.
     * @return Переведенный текст или сам ключ, если перевод не найден.
     */
    public String getTranslation(String translationKey) {
        // Получаем текущую локаль, установленную Spring Security или LocaleChangeInterceptor
        Locale locale = LocaleContextHolder.getLocale();
        String langCode = locale.getLanguage(); // Получаем "ky", "ru", "en"

        // 1. Ищем перевод для текущей локали (например, ky)
        return translationRepository.findByTranslationKeyAndLocale(translationKey, langCode)
                .map(TranslationMessage::getTranslationText)
                // 2. Если перевод не найден (Optional.empty), ищем резервный (fallback) перевод (например, en)
                .orElseGet(() -> getFallbackTranslation(translationKey));
    }

    private String getFallbackTranslation(String translationKey) {
        // Резервный язык - Английский (или другой язык по умолчанию)
        String fallbackLocale = "en";

        // 3. Ищем перевод на резервном языке
        return translationRepository.findByTranslationKeyAndLocale(translationKey, fallbackLocale)
                .map(TranslationMessage::getTranslationText)
                // 4. Если даже резервный перевод не найден, возвращаем сам ключ
                .orElse(translationKey);
    }
}
