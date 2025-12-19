package com.example.fit_tracker.service;



import com.example.fit_tracker.dto.ActivityDTO;

import java.util.List;

public interface ActivityService {
    ActivityDTO postActivity(ActivityDTO dto);

    List<ActivityDTO> getActivities();

    ActivityDTO updateActivity(Long id, ActivityDTO dto); // Изменен Object на ActivityDTO
    String deleteActivity(Long id);
}
