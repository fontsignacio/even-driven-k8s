package com.user_service.user_service.services;

import com.user_service.user_service.model.User;
import com.user_service.user_service.repository.UserRepository;
import com.user_service.user_service.event.UserCreatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;


    public UserService(UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }


    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        try {
            UserCreatedEvent event = new UserCreatedEvent(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), LocalDateTime.now().toString());
            kafkaTemplate.send("user-created-topic", objectMapper.writeValueAsString(event));
            System.out.println("User created event sent for user: " + savedUser.getUsername());
        } catch (Exception e) {
            System.err.println("Error sending user created event: " + e.getMessage());
        }
        return savedUser;
    }


    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
