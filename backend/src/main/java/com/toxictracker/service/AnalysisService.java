package com.toxictracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toxictracker.dto.AnalysisResponse;
import com.toxictracker.exception.AnalysisException;
import com.toxictracker.model.AppUser;
import com.toxictracker.model.FollowersSnapshot;
import com.toxictracker.repository.FollowersSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AnalysisService {

    private final ObjectMapper objectMapper;
    private final FollowersSnapshotRepository snapshotRepository;
    private final com.toxictracker.repository.ActivityLogRepository activityLogRepository;
    private final com.toxictracker.repository.InstagramAccountRepository accountRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    public Set<String> parseInstagramJson(MultipartFile file) {
        try {
            JsonNode root = objectMapper.readTree(file.getInputStream());
            Set<String> usernames = new HashSet<>();

            // Instagram's structure (followers_1.json or following.json)
            // It's usually a list of objects or an object with a sublist
            if (root.isArray()) {
                for (JsonNode node : root) {
                    JsonNode stringListData = node.get("string_list_data");
                    if (stringListData != null && stringListData.isArray()) {
                        for (JsonNode data : stringListData) {
                            usernames.add(data.get("value").asText());
                        }
                    }
                }
            } else if (root.has("relationships_followers")) {
                // Another potential format
                JsonNode list = root.get("relationships_followers");
                for (JsonNode node : list) {
                    usernames.add(node.get("string_list_data").get(0).get("value").asText());
                }
            } else if (root.has("relationships_following")) {
                JsonNode list = root.get("relationships_following");
                for (JsonNode node : list) {
                    usernames.add(node.get("string_list_data").get(0).get("value").asText());
                }
            }

            return usernames;
        } catch (IOException e) {
            throw new AnalysisException("Error parsing Instagram file: " + e.getMessage());
        }
    }

    public AnalysisResponse analyze(AppUser user, Set<String> followers, Set<String> following, String ipAddress) {
        // Find users who you follow but don't follow you back (Traidores)
        Set<String> notFollowingMeBack = following.stream()
                .filter(u -> !followers.contains(u))
                .collect(Collectors.toSet());

        // Find users who follow you but you don't follow back (Fans)
        Set<String> iDontFollowBack = followers.stream()
                .filter(u -> !following.contains(u))
                .collect(Collectors.toSet());

        // Find mutual followers
        Set<String> mutuals = following.stream()
                .filter(followers::contains)
                .collect(Collectors.toSet());

        // Get last snapshot to detect unfollowers
        List<FollowersSnapshot> snapshots = snapshotRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        Set<String> newUnfollowers = new HashSet<>();

        if (!snapshots.isEmpty()) {
            Set<String> previousFollowers = snapshots.get(0).getFollowers().stream()
                    .map(com.toxictracker.model.InstagramAccount::getUsername)
                    .collect(Collectors.toSet());
            newUnfollowers = previousFollowers.stream()
                    .filter(u -> !followers.contains(u))
                    .collect(Collectors.toSet());
        }

        // Metrics calculations
        double toxicScore = following.isEmpty() ? 0 : (notFollowingMeBack.size() * 100.0 / following.size());
        int unionSize = followers.size() + following.size() - mutuals.size();
        double mutualityRate = unionSize == 0 ? 0 : (mutuals.size() * 100.0 / unionSize);

        // Sync accounts and save new snapshot for future comparison
        Set<com.toxictracker.model.InstagramAccount> followerAccounts = syncInstagramAccounts(followers);
        Set<com.toxictracker.model.InstagramAccount> followingAccounts = syncInstagramAccounts(following);

        FollowersSnapshot snapshot = FollowersSnapshot.builder()
                .user(user)
                .followers(followerAccounts)
                .following(followingAccounts)
                .ipAddress(ipAddress)
                .build();
        
        // Enriquecemos con ubicación solo en DB
        enrichWithLocation(snapshot, ipAddress);

        snapshotRepository.save(snapshot);

        // Log Global Activity (Anonymous)
        activityLogRepository.save(com.toxictracker.model.ActivityLog.builder()
                .actionType("ANALYZE")
                .build());

        return AnalysisResponse.builder()
                .followersCount(followers.size())
                .followingCount(following.size())
                .notFollowingMeBack(notFollowingMeBack)
                .iDontFollowBack(iDontFollowBack)
                .newUnfollowers(newUnfollowers)
                .fans(iDontFollowBack) // En este contexto, los que no sigues de vuelta son tus fans
                .toxicScore(Math.round(toxicScore * 10) / 10.0)
                .mutualityRate(Math.round(mutualityRate * 10) / 10.0)
                .build();
    }

    public AnalysisResponse buildResponseFromSnapshot(FollowersSnapshot snapshot) {
        Set<String> followers = snapshot.getFollowers().stream()
                .map(com.toxictracker.model.InstagramAccount::getUsername)
                .collect(Collectors.toSet());
        Set<String> following = snapshot.getFollowing().stream()
                .map(com.toxictracker.model.InstagramAccount::getUsername)
                .collect(Collectors.toSet());

        Set<String> notFollowingMeBack = following.stream()
                .filter(u -> !followers.contains(u))
                .collect(Collectors.toSet());

        Set<String> iDontFollowBack = followers.stream()
                .filter(u -> !following.contains(u))
                .collect(Collectors.toSet());

        Set<String> mutuals = following.stream()
                .filter(followers::contains)
                .collect(Collectors.toSet());

        double toxicScore = following.isEmpty() ? 0 : (notFollowingMeBack.size() * 100.0 / following.size());
        int unionSize = followers.size() + following.size() - mutuals.size();
        double mutualityRate = unionSize == 0 ? 0 : (mutuals.size() * 100.0 / unionSize);

        return AnalysisResponse.builder()
                .followersCount(followers.size())
                .followingCount(following.size())
                .notFollowingMeBack(notFollowingMeBack)
                .iDontFollowBack(iDontFollowBack)
                .newUnfollowers(new HashSet<>()) // No podemos comparar con "nada" si es el snapshot actual
                .fans(iDontFollowBack)
                .toxicScore(Math.round(toxicScore * 10) / 10.0)
                .mutualityRate(Math.round(mutualityRate * 10) / 10.0)
                .build();
    }

    public Optional<FollowersSnapshot> getLatestSnapshot(AppUser user) {
        List<FollowersSnapshot> snapshots = snapshotRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return snapshots.stream().findFirst();
    }

    public List<Map<String, Object>> getHistory(AppUser user) {
        List<FollowersSnapshot> snapshots = snapshotRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return snapshots.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", s.getCreatedAt());

            // Re-calculate toxic score for the history point
            Set<String> followers = s.getFollowers().stream()
                    .map(com.toxictracker.model.InstagramAccount::getUsername)
                    .collect(Collectors.toSet());
            Set<String> following = s.getFollowing().stream()
                    .map(com.toxictracker.model.InstagramAccount::getUsername)
                    .collect(Collectors.toSet());
            long notFollowingBack = following.stream().filter(u -> !followers.contains(u)).count();
            double toxicScore = following.isEmpty() ? 0 : (notFollowingBack * 100.0 / following.size());

            map.put("toxicScore", Math.round(toxicScore * 10) / 10.0);
            return map;
        }).collect(Collectors.toList());
    }

    private Set<com.toxictracker.model.InstagramAccount> syncInstagramAccounts(Set<String> usernames) {
        return usernames.stream().map(username -> 
            accountRepository.findByUsername(username)
                .orElseGet(() -> accountRepository.save(com.toxictracker.model.InstagramAccount.builder()
                    .username(username)
                    .build()))
        ).collect(Collectors.toSet());
    }

    private void enrichWithLocation(FollowersSnapshot snapshot, String ip) {
        if (ip == null || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) return;
        try {
            String url = "http://ip-api.com/json/" + ip;
            Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
            if (resp != null && "success".equals(resp.get("status"))) {
                snapshot.setCity((String) resp.get("city"));
                snapshot.setCountry((String) resp.get("country"));
            }
        } catch (Exception e) {
            log.error("Error al geolocalizar IP {}: {}", ip, e.getMessage());
        }
    }
}
