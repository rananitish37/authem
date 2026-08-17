package com.authem.auth.dto.response;

import com.authem.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data                  // 👈 Generates getters and setters required for Jackson JSON serialization
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
}
