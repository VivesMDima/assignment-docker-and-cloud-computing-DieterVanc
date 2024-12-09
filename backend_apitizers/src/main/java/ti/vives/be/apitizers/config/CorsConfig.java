package ti.vives.be.apitizers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*"); // Allows all origins
        config.addAllowedHeader("*"); // Allows all headers
        config.addAllowedMethod("*"); // Allows all HTTP methods
        config.setAllowCredentials(true); // Allows cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Apply configuration to all paths
        return new CorsFilter(source);
    }
}
