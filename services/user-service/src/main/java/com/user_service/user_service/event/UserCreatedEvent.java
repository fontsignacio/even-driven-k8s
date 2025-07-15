package com.user_service.user_service.event;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreatedEvent {
    private Long userId;
    private String username;
    private String email;
    private String timestamp; // Para fines de demostración
}

