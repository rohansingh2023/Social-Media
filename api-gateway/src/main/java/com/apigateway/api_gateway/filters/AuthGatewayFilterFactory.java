package com.apigateway.api_gateway.filters;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.publisher.Mono;

@Component
public class AuthGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthGatewayFilterFactory.Config> {

    private static final Logger logger = LoggerFactory.getLogger(AuthGatewayFilterFactory.class);

    private final WebClient.Builder webClientBuilder;

    public AuthGatewayFilterFactory(WebClient.Builder webClientBuilder) {
        super(Config.class);
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String accessToken = exchange.getRequest().getHeaders().getFirst("Authorization");
            logger.info("[AuthFilter] - Found access token: {}", accessToken);
            String refreshToken = getRefreshTokenFromCookies(exchange.getRequest());

            return validateTokens(accessToken, refreshToken)
                    .flatMap(response -> {
                        logger.info("[AuthFilter] - Tokens are valid. Proceeding with request.");
                        return chain.filter(exchange);
                    })
                    .onErrorResume(WebClientResponseException.class, e -> {
                        logger.error("[AuthFilter] - Error calling auth service: {}", e.getMessage());
                        logger.error("[AuthFilter] - Stack trace: ", e);
                        exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        };
    }

    @SuppressWarnings("rawtypes")
    private Mono<Map> validateTokens(String accessToken, String refreshToken) {
        String authServiceUrl = "http://localhost:7007/api/auth/validate";

        return webClientBuilder.baseUrl(authServiceUrl)
                .build()
                .get()
                .header(HttpHeaders.AUTHORIZATION, accessToken)
                .cookie("refresh_token", refreshToken)
                .retrieve()
                .bodyToMono(Map.class);
    }

    private String getRefreshTokenFromCookies(org.springframework.http.server.reactive.ServerHttpRequest request) {
        logger.info("[AuthFilter] - Extracting cookies from request.");
        Map<String, HttpCookie> cookies = request.getCookies().toSingleValueMap();
        String refreshToken = cookies.get("refresh_token") != null ? cookies.get("refresh_token").getValue() : null;
        if (refreshToken != null) {
            logger.info("[AuthFilter] - Found refresh token: {}", refreshToken);
        } else {
            logger.info("[AuthFilter] - No refresh token found in cookies.");
        }
        return refreshToken;
    }

    public static class Config {
        // Any custom config properties can be added here
    }
}
