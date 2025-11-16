package com.example.fit_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class GoalDTO {

    private Long id;

    @NotBlank(message = "{goal.description.notblank}") // <<< ВАЛИДАЦИЯ
    @Size(min = 5, max = 255, message = "{goal.description.size}")
    private String description;

    @NotNull(message = "{goal.startDate.notnull}")
    private Date startDate;

    @NotNull(message = "{goal.endDate.notnull}")
    private Date endDate;

    private boolean achieved;

    private Long targetSteps;
    private Double targetDistance;
}
//    public GoalDTO getGoalDTO(){
//        GoalDTO goalDTO = new GoalDTO();
//
//        goalDTO.setId(id);
//        goalDTO.setDescription(description);
//        goalDTO.setStartDate(startDate);
//        goalDTO.setEndDate(endDate);
//        goalDTO.setAchieved(achieved);
//
//        return goalDTO;
//
//    }
