package com.example.fit_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import java.util.Arrays;
import java.util.Locale;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  
//    @Bean
//    public AcceptHeaderLocaleResolver localeResolver() {
//        AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
//
//  
//        resolver.setDefaultLocale(new Locale("ky"));
//
//        resolver.setSupportedLocales(Arrays.asList(
//                new Locale("en"),
//                new Locale("ru"),
//                new Locale("ky") // Кыргызский язык
//        ));
//
//        return resolver;
//    }

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**") 
//                .allowedOrigins("http://localhost:5175", "http://127.0.0.1:5175") // Порт фронтенда!
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }
}
