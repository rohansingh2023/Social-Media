package com.signaling_server.signaling_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SignalingServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SignalingServerApplication.class, args);
	}

	// @RequestMapping("/")
	// public String InitialRoute() {
	// return "WebRTC with Spring Boot Ready!";
	// }
}
