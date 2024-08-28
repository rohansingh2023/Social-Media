package com.signaling_server.signaling_server;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.signaling_server.signaling_server.controller.InitialRouteController;
import com.signaling_server.signaling_server.controller.SignalingController;

@SpringBootTest
class SignalingServerApplicationTests {

	@Autowired
	private SignalingController signalingController;

	@Autowired
	private InitialRouteController initialRouteController;

	@Test
	void contextLoads() throws Exception {
		assertThat(signalingController).isNotNull();
		assertThat(initialRouteController).isNotNull();
	}

}
