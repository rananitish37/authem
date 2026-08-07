package com.authem.auth.dto.response;

import com.authem.auth.model.Role;

import java.time.LocalDateTime;

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
