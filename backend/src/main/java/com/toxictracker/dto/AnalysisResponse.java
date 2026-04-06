package com.toxictracker.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Set;

@Data
@Builder
public class AnalysisResponse {
    private int followersCount;
    private int followingCount;
    private Set<String> notFollowingMeBack; // Users you follow but they don't follow you
    private Set<String> iDontFollowBack;    // Users that follow you but you don't follow back
    private Set<String> newUnfollowers;     // (Logic for this needs a previous snapshot)
}
