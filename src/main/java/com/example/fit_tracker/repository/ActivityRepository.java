package com.example.fit_tracker.repository;

import com.example.fit_tracker.entity.Activity;
import com.example.fit_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface ActivityRepository extends JpaRepository<Activity,Long> {


//    @Query( "SELECT SUM(a.steps) FROM Activity a")
//    Integer getTotalSteps();
//
//    @Query("SELECT SUM(a.distance) FROM Activity a")
//    Double getTotalDistance();
//
//    @Query("SELECT SUM(a.caloriesBurned) FROM Activity a")
//    Integer getTotalActivityCalories();

    @Query("SELECT SUM(a.steps) FROM Activity a WHERE a.user.id = :userId")
    Long getTotalStepsByUserId(@Param("userId") Long userId); // <<< Исправлено на Long
    // Общая дистанция пользователя за все время
    @Query("SELECT SUM(a.distance) FROM Activity a WHERE a.user.id = :userId")
    Double getTotalDistanceByUserId(@Param("userId") Long userId);

    // Общие сожженные калории от активности за все время
    @Query("SELECT SUM(a.caloriesBurned) FROM Activity a WHERE a.user.id = :userId")
    Integer getTotalActivityCaloriesByUserId(@Param("userId") Long userId);

    // Шаги за последние 30 дней
    @Query("SELECT SUM(a.steps) FROM Activity a WHERE a.user.id = :userId AND a.date >= :startDate")
    Long getStepsSinceDate(@Param("userId") Long userId, @Param("startDate") Date startDate); // <<< Исправлено на Long
    // Средняя дистанция за последние 30 дней
    @Query("SELECT AVG(a.distance) FROM Activity a WHERE a.user.id = :userId AND a.date >= :startDate")
    Double getAverageDistanceSinceDate(@Param("userId") Long userId, @Param("startDate") Date startDate);

    List<Activity> findAllByUser(User user);

}
