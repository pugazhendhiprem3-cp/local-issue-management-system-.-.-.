package com.cp.localissue.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Automatically determines the absolute path of your root backend folder
        String rootDir = System.getProperty("user.dir");
        String uploadPath = "file:" + rootDir + File.separator + "uploads" + File.separator;

        // This print statement helps you confirm the folder location in your console terminal on startup!
        System.out.println("DEBUG: Images are being served from -> " + uploadPath);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}