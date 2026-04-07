package com.toxictracker.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${FIREBASE_CONFIG_JSON:}")
    private String firebaseConfigJson;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseOptions options;

                if (firebaseConfigJson != null && !firebaseConfigJson.isEmpty()) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(
                                    new ByteArrayInputStream(firebaseConfigJson.getBytes(StandardCharsets.UTF_8))))
                            .build();
                    log.info("Firebase Admin SDK inicializado con JSON de entorno.");
                } else {
                    // Fallback a credenciales por defecto (útil si se corre en GCP)
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                    log.info("Firebase Admin SDK inicializado con Application Default Credentials.");
                }

                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            log.error("Error al inicializar Firebase Admin SDK: {}", e.getMessage());
        }
    }
}
