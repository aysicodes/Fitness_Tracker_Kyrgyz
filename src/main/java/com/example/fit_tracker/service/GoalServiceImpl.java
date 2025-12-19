
package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.GoalDTO;
import com.example.fit_tracker.entity.Goal;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.exception.CustomAccessDeniedException;
import com.example.fit_tracker.repository.ActivityRepository;
import com.example.fit_tracker.repository.GoalRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final ActivityRepository activityRepository;
    private final UserService userService;
    private final MessageSource messageSource;

    @Override
    @Transactional // Гарантирует, что вся операция либо пройдет, либо откатится
    public void checkGoalsForUser(User user) {
        // 1. Находим все АКТИВНЫЕ (недостигнутые) цели пользователя
        List<Goal> activeGoals = goalRepository.findAllByUserAndAchievedFalse(user);

        if (activeGoals.isEmpty()) {
            return;
        }

        // 2. Получаем текущую накопленную статистику пользователя (допустим, за все время)
        Long totalSteps = activityRepository.getTotalStepsByUserId(user.getId());
        Double totalDistance = activityRepository.getTotalDistanceByUserId(user.getId());

//        Long currentSteps = totalSteps != null ? totalSteps : 0L;
//        Double currentDistance = totalDistance != null ? totalDistance : 0.0;

        // 3. Перебираем цели и проверяем
        for (Goal goal : activeGoals) {
            boolean achieved = false;

            if (goal.getTargetSteps() != null && totalSteps != null && totalSteps >= goal.getTargetSteps()) {
                achieved = true;
            }
            // Дополнительная проверка, если у вас есть цель по дистанции
            else if (goal.getTargetDistance() != null && totalDistance != null && totalDistance >= goal.getTargetDistance()) {
                achieved = true;
            }

            // Если цель достигнута, обновляем статус
            if (achieved) {
                goal.setAchieved(true);
                goalRepository.save(goal);
                // Тут можно было бы отправить уведомление пользователю
            }
        }
    }

    public GoalDTO postGoal(GoalDTO dto) {
        User currentUser = userService.getCurrentUser();

        Goal goal = new Goal();
        goal.setDescription(dto.getDescription());
        goal.setStartDate(dto.getStartDate());
        goal.setEndDate(dto.getEndDate());

        goal.setTargetSteps(dto.getTargetSteps());
        goal.setTargetDistance(dto.getTargetDistance());

        goal.setAchieved(false); // Новая цель всегда начинается как недостигнутая
        goal.setUser(currentUser);

        return goalRepository.save(goal).getGoalDTO();
    }


    public List<GoalDTO> getGoals() {
        User currentUser = userService.getCurrentUser();
        List<Goal> goals = goalRepository.findAllByUser(currentUser);
        return goals.stream().map(Goal::getGoalDTO).collect(Collectors.toList());
    }

    public GoalDTO updateStatus(Long id) {
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.goal.not.found", null, currentLocale);
        String forbiddenUpdateMsg = messageSource.getMessage("auth.forbidden.update", null, currentLocale);

        Optional<Goal> optionalGoal = goalRepository.findById(id);

        if (optionalGoal.isPresent()) {
            Goal exitingGoal = optionalGoal.get();

            // Проверка владения
            if (!exitingGoal.getUser().getId().equals(currentUser.getId())) {
                throw new CustomAccessDeniedException(forbiddenUpdateMsg); // <<< ИСПРАВЛЕНО
            }

            exitingGoal.setAchieved(true);
            return goalRepository.save(exitingGoal).getGoalDTO();
        }
        throw new EntityNotFoundException(notFoundMsg);
    }

    public GoalDTO updateGoal(Long id, GoalDTO dto) {
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.goal.not.found", null, currentLocale);
        String forbiddenUpdateMsg = messageSource.getMessage("auth.forbidden.update", null, currentLocale);

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg));

        // Проверка владения
        if (!goal.getUser().getId().equals(currentUser.getId())) {
            throw new CustomAccessDeniedException(forbiddenUpdateMsg); // <<< ИСПРАВЛЕНО
        }

        goal.setDescription(dto.getDescription());
        goal.setStartDate(dto.getStartDate());
        goal.setEndDate(dto.getEndDate());

        goal.setTargetSteps(dto.getTargetSteps());
        goal.setTargetDistance(dto.getTargetDistance());

        goal.setAchieved(dto.isAchieved());

        return goalRepository.save(goal).getGoalDTO();
    }

    public String deleteGoal(Long id) {
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.goal.not.found", null, currentLocale);
        String forbiddenDeleteMsg = messageSource.getMessage("auth.forbidden.delete", null, currentLocale);

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg));

        // Проверка владения
        if (!goal.getUser().getId().equals(currentUser.getId())) {
            throw new CustomAccessDeniedException(forbiddenDeleteMsg); // <<< ИСПРАВЛЕНО
        }

        goalRepository.delete(goal);
        return messageSource.getMessage("goal.deleted.success", null, currentLocale);
    }
}