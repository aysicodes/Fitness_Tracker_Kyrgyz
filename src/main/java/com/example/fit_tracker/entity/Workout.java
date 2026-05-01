// com.example.fit_tracker.entity/Workout.java

package com.example.fit_tracker.entity;

import com.example.fit_tracker.dto.WorkoutDTO; // 🛑 Необходим импорт DTO
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Entity
@Data
@Table(name = "workout")
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ИЗМЕНЕНИЕ: type заменен на typeKey для локализации
    @Column(name = "type_key", nullable = true)
    private String typeKey;

    @Column(name = "custom_type", nullable = true)
    private String customType;

    private Date date;

    private int duration;

    @Column(name = "calories_burned")
    private int caloriesBurned;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public WorkoutDTO getWorkoutDTO() {
        WorkoutDTO workoutDTO = new WorkoutDTO();

        workoutDTO.setId(this.id);
        workoutDTO.setDate(this.date);
        workoutDTO.setDuration(this.duration);
        workoutDTO.setCaloriesBurned(this.caloriesBurned);

        workoutDTO.setTypeKey(this.typeKey);
        workoutDTO.setCustomType(this.customType);

        String typeDisplay = (this.typeKey != null && !this.typeKey.isEmpty()) ? this.typeKey :
                (this.customType != null && !this.customType.isEmpty()) ? this.customType :
                        "N/A";

        workoutDTO.setType(typeDisplay);

        return workoutDTO;
    }
}