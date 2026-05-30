package com.cp.localissue.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Automatically finds the absolute path of your project root folder
        String rootDir = System.getProperty("user.dir");
        String uploadPath = "file:" + rootDir + File.separator + "uploads" + File.separator;

        // Print it out to the console on startup so you can verify exactly where it points!
        System.out.println("DEBUG: Static images are being served from -> " + uploadPath);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}