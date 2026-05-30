package com.cp.localissue.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/serve")
public class FileServeController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "uploads";

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, filename).normalize();
            
            // Security check: prevent directory traversal
            if (!filePath.toAbsolutePath().startsWith(Paths.get(UPLOAD_DIR).toAbsolutePath())) {
                return ResponseEntity.notFound().build();
            }

            File file = filePath.toFile();
            
            // If file doesn't exist, try to find it with spaces converted
            if (!file.exists()) {
                // Try replacing underscores with spaces (common encoding issue)
                String altFilename = filename.replace("_", " ");
                Path altPath = Paths.get(UPLOAD_DIR, altFilename).normalize();
                File altFile = altPath.toFile();
                
                if (altFile.exists()) {
                    file = altFile;
                    filePath = altPath;
                } else {
                    // Try searching for files that start with the UUID part
                    String[] parts = filename.split("_", 2);
                    if (parts.length == 2) {
                        File uploadsFolder = new File(UPLOAD_DIR);
                        if (uploadsFolder.exists() && uploadsFolder.isDirectory()) {
                            File[] files = uploadsFolder.listFiles();
                            if (files != null) {
                                for (File f : files) {
                                    if (f.getName().startsWith(parts[0])) {
                                        file = f;
                                        filePath = f.toPath();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    if (!file.exists()) {
                        return ResponseEntity.notFound().build();
                    }
                }
            }

            // Determine media type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            Resource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
