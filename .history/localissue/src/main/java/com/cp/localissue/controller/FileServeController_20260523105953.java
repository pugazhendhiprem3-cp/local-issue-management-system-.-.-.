package com.cp.localissue.controller;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;

@RestController
@RequestMapping("/serve")
public class FileServeController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "uploads";

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            // First try exact match
            File file = new File(UPLOAD_DIR, filename);
            
            if (file.exists() && file.isFile()) {
                return serveFileResource(file);
            }

            // If not found, try to find file by UUID prefix
            String[] parts = filename.split("_", 2);
            if (parts.length >= 1) {
                String uuidPrefix = parts[0];
                
                File uploadsDir = new File(UPLOAD_DIR);
                if (uploadsDir.exists() && uploadsDir.isDirectory()) {
                    File[] files = uploadsDir.listFiles();
                    if (files != null) {
                        for (File f : files) {
                            if (f.isFile() && f.getName().startsWith(uuidPrefix)) {
                                return serveFileResource(f);
                            }
                        }
                    }
                }
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private ResponseEntity<Resource> serveFileResource(File file) throws Exception {
        // Determine media type
        String contentType = Files.probeContentType(file.toPath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        Resource resource = new FileSystemResource(file);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
