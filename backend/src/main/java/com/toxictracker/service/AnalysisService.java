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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalysisService {

    private final ObjectMapper objectMapper;
    private final FollowersSnapshotRepository snapshotRepository;

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
        // Find users who you follow but don't follow you back
        Set<String> notFollowingMeBack = following.stream()
                .filter(u -> !followers.contains(u))
                .collect(Collectors.toSet());

        // Find users who follow you but you don't follow back
        Set<String> iDontFollowBack = followers.stream()
                .filter(u -> !following.contains(u))
                .collect(Collectors.toSet());

        // Get last snapshot to detect unfollowers
        List<FollowersSnapshot> snapshots = snapshotRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        Set<String> newUnfollowers = new HashSet<>();

        if (!snapshots.isEmpty()) {
            Set<String> previousFollowers = snapshots.get(0).getFollowers();
            newUnfollowers = previousFollowers.stream()
                    .filter(u -> !followers.contains(u))
                    .collect(Collectors.toSet());
        }

        // Save new snapshot for future comparison
        FollowersSnapshot snapshot = FollowersSnapshot.builder()
                .user(user)
                .followers(followers)
                .following(following)
                .ipAddress(ipAddress)
                .build();
        snapshotRepository.save(snapshot);

        return AnalysisResponse.builder()
                .followersCount(followers.size())
                .followingCount(following.size())
                .notFollowingMeBack(notFollowingMeBack)
                .iDontFollowBack(iDontFollowBack)
                .newUnfollowers(newUnfollowers)
                .build();
    }

    public Optional<FollowersSnapshot> getLatestSnapshot(AppUser user) {
        List<FollowersSnapshot> snapshots = snapshotRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return snapshots.stream().findFirst();
    }
}
