package com.toxictracker.controller;

import com.toxictracker.model.AppUser;
import com.toxictracker.service.AnalysisService;
import com.toxictracker.dto.AnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadData(
            @RequestParam("followers") MultipartFile followersFile,
            @RequestParam("following") MultipartFile followingFile,
            org.springframework.security.core.Authentication authentication) {

        try {
            AppUser user = (AppUser) authentication.getPrincipal();

            Set<String> followers = analysisService.parseInstagramJson(followersFile);
            Set<String> following = analysisService.parseInstagramJson(followingFile);

            AnalysisResponse response = analysisService.analyze(user, followers, following);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error procesando los archivos: " + e.getMessage());
        }
    }
}
