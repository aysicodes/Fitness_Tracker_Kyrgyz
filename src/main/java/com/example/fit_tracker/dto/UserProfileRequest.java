package com.example.fit_tracker.dto;

import lombok.Data;

@Data
public class UserProfileRequest {

    private String firstName;

    private String lastName;

    private Integer age;

    private String gender;

    private Double weight;
    private Double height;
}