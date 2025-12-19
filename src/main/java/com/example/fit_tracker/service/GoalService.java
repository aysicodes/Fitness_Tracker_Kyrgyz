package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.GoalDTO;
import com.example.fit_tracker.entity.User;

import java.util.List;

public interface GoalService {

    GoalDTO postGoal(GoalDTO dto);
    List<GoalDTO> getGoals();

    GoalDTO updateStatus(Long id);

    Object updateGoal(Long id, GoalDTO dto);

    String deleteGoal(Long id);

    // <<< НОВЫЙ МЕТОД ДЛЯ АВТОМАТИЗАЦИИ ЦЕЛЕЙ
    void checkGoalsForUser(User user);
}
