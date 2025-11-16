//package com.example.fit_tracker.service;
//
//import com.example.fit_tracker.dto.WorkoutDTO;
//import com.example.fit_tracker.entity.User;
//import com.example.fit_tracker.entity.Workout;
//import com.example.fit_tracker.repository.WorkoutRepository;
//import jakarta.persistence.EntityNotFoundException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class WorkoutServiceImpl implements WorkoutService {
//
//    private final WorkoutRepository workoutRepository;
//    private final UserService userService;
//
//    public WorkoutDTO postWorkout(WorkoutDTO workoutDTO) {
//        User currentUser = userService.getCurrentUser();
//
//        Workout workout = new Workout();
//        workout.setDate(workoutDTO.getDate());
//        workout.setType(workoutDTO.getType());
//        workout.setDuration(workoutDTO.getDuration());
//        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
//        workout.setUser(currentUser); // ПРИВЯЗКА
//
//        return workoutRepository.save(workout).getWorkoutDto();
//    }
//
//    public List<WorkoutDTO> getWorkouts() {
//        User currentUser = userService.getCurrentUser();
//        // Фильтруем по пользователю
//        List<Workout> workouts = workoutRepository.findAllByUser(currentUser);
//
//        return workouts.stream().map(Workout::getWorkoutDto).collect(Collectors.toList());
//    }
//
//    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {
//        User currentUser = userService.getCurrentUser();
//        Workout workout = workoutRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Workout not found"));
//
//        // Проверка владения
//        if (!workout.getUser().getId().equals(currentUser.getId())) {
//            throw new IllegalArgumentException("You are not authorized to update this workout.");
//        }
//
//        workout.setType(workoutDTO.getType());
//        workout.setDate(workoutDTO.getDate());
//        workout.setDuration(workoutDTO.getDuration());
//        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
//
//        return workoutRepository.save(workout).getWorkoutDto();
//    }
//
//    public void deleteWorkout(Long id) {
//        User currentUser = userService.getCurrentUser();
//        Workout workout = workoutRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Workout not found"));
//
//        // Проверка владения
//        if (!workout.getUser().getId().equals(currentUser.getId())) {
//            throw new IllegalArgumentException("You are not authorized to delete this workout.");
//        }
//
//        workoutRepository.delete(workout);
//    }
//
//}




package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.WorkoutDTO;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.entity.Workout;
import com.example.fit_tracker.exception.CustomAccessDeniedException; // <<< ИМПОРТ
import com.example.fit_tracker.repository.WorkoutRepository;
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
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserService userService;
    private final MessageSource messageSource;

    public WorkoutDTO postWorkout(WorkoutDTO workoutDTO) {
        User currentUser = userService.getCurrentUser();

        Workout workout = new Workout();
        workout.setDate(workoutDTO.getDate());
        workout.setType(workoutDTO.getType());
        workout.setDuration(workoutDTO.getDuration());
        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
        workout.setUser(currentUser);

        return workoutRepository.save(workout).getWorkoutDto();
    }

    public List<WorkoutDTO> getWorkouts() {
        User currentUser = userService.getCurrentUser();
        List<Workout> workouts = workoutRepository.findAllByUser(currentUser);

        return workouts.stream().map(Workout::getWorkoutDto).collect(Collectors.toList());
    }

    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.workout.not.found", null, currentLocale);
        String forbiddenUpdateMsg = messageSource.getMessage("auth.forbidden.update", null, currentLocale);

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg));

        // Проверка владения
        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new CustomAccessDeniedException(forbiddenUpdateMsg); // <<< ИСПРАВЛЕНО
        }

        workout.setType(workoutDTO.getType());
        workout.setDate(workoutDTO.getDate());
        workout.setDuration(workoutDTO.getDuration());
        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());

        return workoutRepository.save(workout).getWorkoutDto();
    }

    public String deleteWorkout(Long id) { // <<< ИЗМЕНЕН ВОЗВРАЩАЕМЫЙ ТИП НА String
        User currentUser = userService.getCurrentUser();
        Locale currentLocale = LocaleContextHolder.getLocale();

        String notFoundMsg = messageSource.getMessage("entity.workout.not.found", null, currentLocale);

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(notFoundMsg));

        // Проверка владения
        if (!workout.getUser().getId().equals(currentUser.getId())) {
            String forbiddenDeleteMsg = messageSource.getMessage("auth.forbidden.delete", null, currentLocale);
            throw new CustomAccessDeniedException(forbiddenDeleteMsg); // <<< ИСПРАВЛЕНО
        }

        workoutRepository.delete(workout);

        // Возвращаем локализованное сообщение об успехе
        return messageSource.getMessage("workout.deleted.success", null, currentLocale);
    }
}