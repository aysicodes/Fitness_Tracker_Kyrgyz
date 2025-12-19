package com.example.fit_tracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "translation_messages", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"translation_key", "locale"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TranslationMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ключ перевода, на который ссылаются другие таблицы (например, 'workout.type.running')
    @Column(name = "translation_key", nullable = false, length = 100)
    private String translationKey;

    // Код языка (например, 'ky', 'ru', 'en')
    @Column(name = "locale", nullable = false, length = 5)
    private String locale;

    // Фактический переведенный текст
    @Column(name = "translation_text", nullable = false, columnDefinition = "TEXT")
    private String translationText;

    // Конструктор для удобства в сервисе
    public TranslationMessage(String translationKey, String locale, String translationText) {
        this.translationKey = translationKey;
        this.locale = locale;
        this.translationText = translationText;
    }
}