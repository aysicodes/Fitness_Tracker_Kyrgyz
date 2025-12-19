
package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.ActivityDTO;
import com.example.fit_tracker.entity.Activity;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.exception.CustomAccessDeniedException; // <<< ИМПОРТ
import com.example.fit_tracker.repository.ActivityRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final UserService userService;
    private final MessageSource messageSource;
    private final GoalService goalService; // <<< Для следующего шага: Автоматизация целей

    public ActivityDTO postActivity(ActivityDTO dto) {
        User currentUser = userService.getCurrentUser();

        Activity activity = new Activity();
        activity.setDate(dto.getDate());
        activity.setSteps(dto.getSteps());
        activity.setDistance(dto.getDistance());
        activity.setCaloriesBurned(dto.getCaloriesBurned());
        activity.setUser(currentUser);

        Activity savedActivity = activityRepository.save(activity);

        // --- ДЛЯ БУДУЩЕГО ШАГА: АВТОМАТИЗАЦИЯ ЦЕЛЕЙ ---
        goalService.checkGoalsForUser(currentUser);

        return savedActivity.getActivityDTO();
    }

    public List<ActivityDTO> getActivities() {
        User currentUser = userService.getCurrentUser();
        List<Activity> activities = activityRepository.findAllByUser(currentUser);
        return activities.stream().map(Activity::getActivityDTO).collect(Collectors.toList());
    }

    public ActivityDTO updateActivity(Long id, ActivityDTO dto) {
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.activity.not.found", null, currentLocale);
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg));

        // Проверка владения
        if (!activity.getUser().getId().equals(currentUser.getId())) {
            String forbiddenMsg = messageSource.getMessage("auth.forbidden.update", null, currentLocale);
            throw new CustomAccessDeniedException(forbiddenMsg); // <<< ИСПРАВЛЕНО
        }

        activity.setDate(dto.getDate());
        activity.setSteps(dto.getSteps());
        activity.setDistance(dto.getDistance());
        activity.setCaloriesBurned(dto.getCaloriesBurned());

        Activity updatedActivity = activityRepository.save(activity);
        goalService.checkGoalsForUser(currentUser);

        return updatedActivity.getActivityDTO();
    }

    public String deleteActivity(Long id) { // <<< ИЗМЕНЕН ВОЗВРАЩАЕМЫЙ ТИП НА String
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.activity.not.found", null, currentLocale);
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg));

        // Проверка владения
        if (!activity.getUser().getId().equals(currentUser.getId())) {
            String forbiddenMsg = messageSource.getMessage("auth.forbidden.delete", null, currentLocale);
            throw new CustomAccessDeniedException(forbiddenMsg); // <<< ИСПРАВЛЕНО
        }

        activityRepository.delete(activity);
        goalService.checkGoalsForUser(currentUser);

        // Возвращаем локализованное сообщение об успехе
        return messageSource.getMessage("activity.deleted.success", null, currentLocale);
    }
}