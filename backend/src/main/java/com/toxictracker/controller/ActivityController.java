package com.toxictracker.controller;

import com.toxictracker.model.ActivityLog;
import com.toxictracker.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogRepository activityLogRepository;

    @GetMapping("/latest")
    public ResponseEntity<List<ActivityLog>> getLatestActivity() {
        return ResponseEntity.ok(activityLogRepository.findTop15ByOrderByCreatedAtDesc());
    }

    @PostMapping("/log-share")
    public ResponseEntity<?> logShare() {
        ActivityLog log = ActivityLog.builder()
                .actionType("SHARE")
                .build();
        activityLogRepository.save(log);
        return ResponseEntity.ok().build();
    }
}
