package com.authem.auth.config;

import com.authem.auth.model.Role;
import com.authem.auth.model.User;
import com.authem.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminSetupConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner updateAdminUser() {
        return args -> {
            String adminEmail = "rananitish37@gmail.com";

            // Find existing user or build a brand new one if DB is empty
            User adminUser = userRepository.findByEmail(adminEmail)
                    .orElseGet(() -> User.builder()
                            .firstName("Nitish")
                            .lastName("Rana")
                            .email(adminEmail)
                            .phoneNo("+1234567890")
                            .build());

            // Always enforce role, password, and enabled status
            adminUser.setRole(Role.ROLE_ADMIN);
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setEnabled(true);

            userRepository.save(adminUser);
            System.out.println("✅ Successfully initialized " + adminEmail + " as ROLE_ADMIN with password 'admin'");
        };
    }
}