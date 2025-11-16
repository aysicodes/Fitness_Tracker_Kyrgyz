package com.example.fit_tracker.entity;


import com.example.fit_tracker.dto.GoalDTO;
import jakarta.persistence.*;
import lombok.Data;


import java.util.Date;

@Entity
@Data
@Table(name = "goal")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private Date startDate;

    private Date endDate;

    private boolean achieved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // user_id - внешний ключ
    private User user;

    private Long targetSteps;       // Цель по шагам (например, 100000)
    private Double targetDistance; // Цель по дистанции (например, 50.0 км)

    public GoalDTO getGoalDTO() {
        GoalDTO dto = new GoalDTO();

        dto.setId(this.id);
        dto.setDescription(this.description);
        dto.setStartDate(this.startDate);
        dto.setEndDate(this.endDate);
        dto.setAchieved(this.achieved);

        dto.setTargetSteps(this.targetSteps);
        dto.setTargetDistance(this.targetDistance);

        return dto;
        //goalDTO;
    }


}
