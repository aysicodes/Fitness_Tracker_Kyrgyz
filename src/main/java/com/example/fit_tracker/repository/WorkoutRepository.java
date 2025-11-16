package com.example.fit_tracker.repository;

import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {


//    @Query("SELECT SUM(w.duration) FROM Workout w")
//    Integer getTotalDuration();
//
//    @Query("SELECT SUM(w.caloriesBurned) FROM Workout w")
//    Integer getTotalCaloriesBurned();

    @Query("SELECT SUM(w.duration) FROM Workout w WHERE w.user.id = :userId")
    Integer getTotalDurationByUserId(@Param("userId") Long userId);

    // Общие сожженные калории от тренировок
    @Query("SELECT SUM(w.caloriesBurned) FROM Workout w WHERE w.user.id = :userId")
    Integer getTotalCaloriesBurnedByUserId(@Param("userId") Long userId);

    // Калории, сожженные в тренировках за последние 30 дней
    @Query("SELECT SUM(w.caloriesBurned) FROM Workout w WHERE w.user.id = :userId AND w.date >= :startDate")
    Integer getCaloriesBurnedSinceDate(@Param("userId") Long userId, @Param("startDate") Date startDate);
    List<Workout> findAllByUser(User user);
}
