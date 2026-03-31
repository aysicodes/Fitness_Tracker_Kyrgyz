package com.example.fit_tracker.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.util.*;

@Service
public class AIService {

    private final String apiUrl = "https://router.huggingface.co/v1/chat/completions";
    @Value("${huggingface.api.token}")
    private String apiToken;
    private final RestTemplate restTemplate = new RestTemplate();
    public String getAIResponse(String userMessage) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "meta-llama/Llama-3.1-70B-Instruct");


        //Training Model to answer in Kyrgyz lang
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", "Сен Ala-Too Fit системасынын акылдуу жардамчысысың. Колдонуучуларга спорт жана ден-соолук боюнча кыргыз тилинде кеңеш бересиң. Кыргызча гана жооп бер!"));
        messages.add(Map.of("role", "user", "content", userMessage));

        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 500);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiToken);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        } catch (Exception e) {
            return "Ката кетти: " + e.getMessage();
        }
        return "Жооп алуу мүмкүн болгон жок.";
    }
}