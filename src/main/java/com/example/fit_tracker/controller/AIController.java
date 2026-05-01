package com.example.fit_tracker.controller;

import com.example.fit_tracker.service.AIService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // Позволяет React подключаться к бэкенду
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> payload) {
        // Получаем сообщение из JSON типа {"message": "текст"}
        String userMessage = payload.get("message");
        return aiService.getAIResponse(userMessage);
    }
}