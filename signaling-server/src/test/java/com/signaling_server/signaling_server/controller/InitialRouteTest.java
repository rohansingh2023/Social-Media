package com.signaling_server.signaling_server.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class InitialRouteTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testInitialRoute() throws Exception {
        mockMvc.perform(get("/api/init"))
                .andExpect(status().isOk());
    }
}
