package com.ridebuddy.ridebuddy_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RidebuddyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RidebuddyBackendApplication.class, args);
	}

}
