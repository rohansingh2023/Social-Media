package com.signaling_server.signaling_server.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InitialRouteController {

    @RequestMapping("/api/init")
    public String InitRoute() {
        return "Initial Route for testing";
    }
}
