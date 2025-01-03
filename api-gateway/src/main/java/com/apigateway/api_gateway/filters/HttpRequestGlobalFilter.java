package com.apigateway.api_gateway.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

public class HttpRequestGlobalFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(HttpRequestGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("[HttpRequestGlobalFilter] - Incoming Request: {} {} | Headers: {}", 
                exchange.getRequest().getMethod(),
                "http://" + exchange.getRequest().getURI().getHost() + ":" + exchange.getRequest().getURI().getPort() 
                        + exchange.getRequest().getPath(),
                getHeadersAsString(exchange.getRequest()));
        if (exchange.getRequest().getCookies() != null && !exchange.getRequest().getCookies().isEmpty()) {
            logger.debug("[HttpRequestGlobalFilter] - Cookies: {}", exchange.getRequest().getCookies());
        }
        long startTime = System.currentTimeMillis();
        return chain.filter(exchange).doOnTerminate(() -> {
            long duration = System.currentTimeMillis() - startTime;
            logger.info("[HttpRequestGlobalFilter] - Outgoing Response: {} | Duration: {}ms",
                    exchange.getResponse().getStatusCode(), duration);
        }).doOnError(e -> {
            logger.error("[HttpRequestGlobalFilter] - Error processing request: {}", e.getMessage(), e);
        });
    }

    @Override
    public int getOrder() {
        return -2;
    }

    private String getHeadersAsString(org.springframework.http.server.reactive.ServerHttpRequest request) {
        StringBuilder headers = new StringBuilder();
        request.getHeaders().forEach(
                (key, value) -> headers.append(key).append(": ").append(String.join(", ", value)).append("; "));
        return headers.toString();
    }

}
