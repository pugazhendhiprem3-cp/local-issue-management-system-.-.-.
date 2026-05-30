package com.cp.localissue.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("image") MultipartFile file) {

        try {

            // Create uploads folder if not exists
            File uploadDir = new File(UPLOAD_DIR);

            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Unique filename
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Save file
            File destination = new File(UPLOAD_DIR + filename);

            file.transferTo(destination);

            // Return image path
            return ResponseEntity.ok("/uploads/" + filename);

        }
        catch (IOException e) {

            e.printStackTrace();
            return ResponseEntity.internalServerError()
            .body("Image upload failed: " + e.getMessage());
}
    }
}