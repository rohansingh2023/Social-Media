package com.signaling_server.signaling_server.model;

public class SignalMessage {

    private String content;

    public SignalMessage() {
    }

    public SignalMessage(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
