package com.apigateway.api_gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import com.apigateway.api_gateway.filters.HttpRequestGlobalFilter;

@Configuration
public class LoggingGlobalFiltersConfigurations {

    @Bean
    public GlobalFilter requestFilter() {
        return new HttpRequestGlobalFilter();
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
