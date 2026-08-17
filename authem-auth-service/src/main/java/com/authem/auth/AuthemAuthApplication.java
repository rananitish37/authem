package com.authem.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.authem")
@EnableJpaRepositories(basePackages = "com.authem")
@EntityScan(basePackages = "com.authem")
public class AuthemAuthApplication {


	public static void main(String[] args) {
		SpringApplication.run(AuthemAuthApplication.class, args);
	}

}
