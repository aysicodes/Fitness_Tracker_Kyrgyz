package com.example.fit_tracker.repository;

import com.example.fit_tracker.entity.TranslationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TranslationRepository extends JpaRepository<TranslationMessage, Long> {

    /**
     * Ищет перевод по ключу и коду локали.
     * @param translationKey Ключ (например, 'workout.type.running')
     * @param locale Код языка (например, 'ky')
     * @return Объект TranslationMessage или Optional.empty()
     */
    Optional<TranslationMessage> findByTranslationKeyAndLocale(String translationKey, String locale);
}
