package com.toxictracker.controller;

import com.toxictracker.dto.SyncDataRequest;
import com.toxictracker.model.AppUser;
import com.toxictracker.service.AnalysisService;
import com.toxictracker.model.FollowersSnapshot;
import com.toxictracker.dto.AnalysisResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
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
            org.springframework.security.core.Authentication authentication,
            HttpServletRequest request) {

        try {
            AppUser user = (AppUser) authentication.getPrincipal();

            Set<String> followers = analysisService.parseInstagramJson(followersFile);
            Set<String> following = analysisService.parseInstagramJson(followingFile);

            AnalysisResponse response = analysisService.analyze(user, followers, following, request.getRemoteAddr());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error procesando los archivos: " + e.getMessage());
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncData(
            @RequestBody SyncDataRequest syncData,
            org.springframework.security.core.Authentication authentication,
            HttpServletRequest request) {

        try {
            AppUser user = (AppUser) authentication.getPrincipal();
            
            AnalysisResponse response = analysisService.analyze(
                    user, 
                    syncData.getFollowers(), 
                    syncData.getFollowing(), 
                    request.getRemoteAddr()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sincronizando datos: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatest(org.springframework.security.core.Authentication authentication) {
        try {
            AppUser user = (AppUser) authentication.getPrincipal();
            Optional<FollowersSnapshot> snapshot = analysisService.getLatestSnapshot(user);

            if (snapshot.isPresent()) {
                FollowersSnapshot s = snapshot.get();
                return ResponseEntity.ok(AnalysisResponse.builder()
                        .followersCount(s.getFollowers().size())
                        .followingCount(s.getFollowing().size())
                        .notFollowingMeBack(new java.util.HashSet<>()) // No podemos calcular esto sin followers/following completos aqui
                        .iDontFollowBack(new java.util.HashSet<>())
                        .newUnfollowers(new java.util.HashSet<>())
                        .build());
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al recuperar historial: " + e.getMessage());
        }
    }
}
