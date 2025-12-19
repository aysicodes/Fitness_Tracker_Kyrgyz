package com.example.fit_tracker.repository;

import com.example.fit_tracker.entity.Goal;
import com.example.fit_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {


//    @Query("SELECT COUNT(g) FROM Goal g WHERE g.achieved = true")
//    Long countAchievedGoals();
//
//    @Query("SELECT COUNT(g) FROM Goal g WHERE g.achieved = false")
//    Long countNotAchievedGoals();

    Long countByUserIdAndAchievedTrue(Long userId);

    // 🛑 Считает цели, где User.id = :userId И achieved = false
    Long countByUserIdAndAchievedFalse(Long userId);

    List<Goal> findAllByUser(User user);

    List<Goal> findAllByUserAndAchievedFalse(User user);
}
