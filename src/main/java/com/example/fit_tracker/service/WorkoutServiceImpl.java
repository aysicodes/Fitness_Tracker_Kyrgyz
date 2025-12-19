package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.WorkoutDTO;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.entity.Workout;
import com.example.fit_tracker.exception.CustomAccessDeniedException;
import com.example.fit_tracker.repository.WorkoutRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

// Импорт Map.Entry для Map.ofEntries
import static java.util.Map.entry;


@Service
@RequiredArgsConstructor
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserService userService;
    private final MessageSource messageSource;
    private final TranslationService translationService;


    /**
     * Нормализует customType и проверяет, не совпадает ли он с предопределенным typeKey.
     * Обновляет WorkoutDTO перед сохранением.
     */
    private void normalizeAndValidateType(WorkoutDTO workoutDTO) {

        // 1. Нормализация customType
        if (workoutDTO.getCustomType() != null && !workoutDTO.getCustomType().trim().isEmpty()) {

            String customTypeTrimmed = workoutDTO.getCustomType().trim();
            String normalizedTypeLower = customTypeTrimmed.toLowerCase(Locale.ROOT);
            String finalCustomType;

            // Форматирование: Первая буква заглавная
            if (normalizedTypeLower.length() > 0) {
                finalCustomType = normalizedTypeLower.substring(0, 1).toUpperCase(Locale.ROOT)
                        + normalizedTypeLower.substring(1);
            } else {
                finalCustomType = "";
            }

            // 🛑 2. ОБНОВЛЕННАЯ ЛОГИКА НОРМАЛИЗАЦИИ: Поддержка Кыргызского, Русского и Английского
            // Ключ: typeKey (например, "running")
            // Значение: List<String> всех возможных совпадений (ключ + переводы)

            final Map<String, List<String>> multiLingualTypeMap = Map.ofEntries(
                    // Ключ: 'workout.type.running', Значения: ['running', 'Бег', 'Жүгүрүү']
                    entry("workout.type.running", List.of("running", "бег", "жүгүрүү")),
                    entry("workout.type.cycling", List.of("cycling", "велоспорт", "велосипед тебүү"))
//                    entry("running", List.of("running", "Бег", "Жүгүрүү")),
//                    entry("cycling", List.of("cycling", "Велоспорт", "Велосипед тебүү")),
//                    entry("weightlifting", List.of("weightlifting", "Тяжелая атлетика", "Оор атлетика")),
//                    entry("swimming", List.of("swimming", "Плавание", "Сууда сүзүү")),
//                    entry("yoga", List.of("yoga", "Йога", "Йога")), // Слово "Йога" часто совпадает
//                    entry("hiking", List.of("hiking", "Пеший туризм", "Жөө жүрүш")),
//                    entry("calisthenics", List.of("calisthenics", "Калистеника", "Калистеника")),
//                    entry("rowing", List.of("rowing", "Гребля", "Кайык айдоо")),
//                    entry("pilates", List.of("pilates", "Пилатес", "Пилатес"))
                    // Добавьте сюда все остальные типы
            );

            // 🛑 Используем finalCustomType для поиска совпадения
            final String searchString = finalCustomType;

            Optional<String> matchingKey = multiLingualTypeMap.entrySet().stream()
                    .filter(entry ->
                            // Проверяем, совпадает ли ввод с ЛЮБОЙ строкой в списке значений
                            entry.getValue().stream()
                                    // Приводим к нижнему регистру для сравнения с normalizedTypeLower (e.g., "ЖүГүРүү" == "жүгүрүү")
                                    .anyMatch(translation -> translation.equalsIgnoreCase(searchString))
                    )
                    .map(Map.Entry::getKey)
                    .findFirst();


            if (matchingKey.isPresent()) {
                // Если совпадение найдено, используем typeKey
                workoutDTO.setTypeKey(matchingKey.get());
                workoutDTO.setCustomType(null);
            } else {
                // Если совпадения нет, сохраняем нормализованный Custom Type
                workoutDTO.setCustomType(finalCustomType); // Сохраняем красиво отформатированное значение
                workoutDTO.setTypeKey(null);
            }
        }
    }


    private WorkoutDTO toDtoWithLocalization(Workout workout) {
        String displayedType;

        if (workout.getTypeKey() != null && !workout.getTypeKey().trim().isEmpty()) {

            String translation = translationService.getTranslation(workout.getTypeKey());

            // 🛑 УПРОЩЕННАЯ И БОЛЕЕ НАДЕЖНАЯ ЛОГИКА:
            // TranslationService гарантирует, что он вернет либо перевод, либо сам ключ.
            // Если translation пустой/null, значит, либо ключ был null, либо TranslationService вернул пустую строку.
            if (translation != null && !translation.trim().isEmpty()) {
                displayedType = translation;
            } else {
                // Резервный вариант: использовать сам ключ.
                displayedType = workout.getTypeKey();
            }

        } else if (workout.getCustomType() != null && !workout.getCustomType().trim().isEmpty()) {
            // Если есть customType, используем его
            displayedType = workout.getCustomType();
        } else {
            // Только для невалидных записей.
            displayedType = "N/A";
        }

        return WorkoutDTO.fromEntity(workout, displayedType);
    }

    private Workout toEntity(WorkoutDTO dto, User user) {
        Workout workout = new Workout();

        workout.setTypeKey(dto.getTypeKey());
        workout.setCustomType(dto.getCustomType());

        workout.setDate(dto.getDate());
        workout.setDuration(dto.getDuration());
        workout.setCaloriesBurned(dto.getCaloriesBurned());
        workout.setUser(user);
        if (dto.getId() != null) {
            workout.setId(dto.getId());
        }
        return workout;
    }

    @Transactional
    public WorkoutDTO postWorkout(WorkoutDTO workoutDTO) {
        normalizeAndValidateType(workoutDTO);

        User currentUser = userService.getCurrentUser();
        Workout workoutToSave = toEntity(workoutDTO, currentUser);
        Workout savedWorkout = workoutRepository.save(workoutToSave);
        return toDtoWithLocalization(savedWorkout);
    }

    public List<WorkoutDTO> getWorkouts() {
        User currentUser = userService.getCurrentUser();
        return workoutRepository.findAllByUser(currentUser).stream()
                .map(this::toDtoWithLocalization)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {
        normalizeAndValidateType(workoutDTO);

        User currentUser = userService.getCurrentUser();
        final Locale currentLocale = LocaleContextHolder.getLocale();

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(messageSource.getMessage("entity.workout.not.found", null, currentLocale)));

        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new CustomAccessDeniedException(messageSource.getMessage("auth.forbidden.update", null, currentLocale));
        }

        workout.setTypeKey(workoutDTO.getTypeKey());
        workout.setCustomType(workoutDTO.getCustomType());
        workout.setDate(workoutDTO.getDate());
        workout.setDuration(workoutDTO.getDuration());
        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());

        Workout updatedWorkout = workoutRepository.save(workout);
        return toDtoWithLocalization(updatedWorkout);
    }

    @Transactional
    public String deleteWorkout(Long id) {
        User currentUser = userService.getCurrentUser();
        final Locale currentLocale = LocaleContextHolder.getLocale();

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(messageSource.getMessage("entity.workout.not.found", null, currentLocale)));

        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new CustomAccessDeniedException(messageSource.getMessage("auth.forbidden.delete", null, currentLocale));
        }

        workoutRepository.delete(workout);
        return messageSource.getMessage("workout.deleted.success", null, currentLocale);
    }

    @Override
    public List<WorkoutDTO> getWorkoutsByDate(Date date) {
        User currentUser = userService.getCurrentUser();
        final Date finalDate = date;

        LocalDate localDate = finalDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        Date startOfDay = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<Workout> workouts = workoutRepository.findWorkoutsByDateRange(
                currentUser,
                startOfDay,
                endOfDay
        );

        return workouts.stream()
                // 🛑 ИСПРАВЛЕНИЕ: Используем метод сервиса для локализации
                .map(this::toDtoWithLocalization)
                .collect(Collectors.toList());
    }
}