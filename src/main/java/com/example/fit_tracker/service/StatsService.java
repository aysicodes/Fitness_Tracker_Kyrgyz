package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.ActivityByDayDTO;
import com.example.fit_tracker.dto.StatsDTO;

import java.util.List;

public interface StatsService {

    StatsDTO getStats();
    List<ActivityByDayDTO> getDailyActivityLast30Days();
}
