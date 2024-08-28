package com.signaling_server.signaling_server.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.signaling_server.signaling_server.model.SignalMessage;

@Controller
public class SignalingController {

    @MessageMapping("/signal")
    @SendTo("/topic/messages")
    public SignalMessage send(SignalMessage message) throws Exception {
        return new SignalMessage(HtmlUtils.htmlEscape(message.getContent()));
    }
}
