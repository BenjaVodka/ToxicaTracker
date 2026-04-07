package com.toxictracker.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Set;

@Data
@Builder
public class AnalysisResponse {
    private int followersCount;
    private int followingCount;
    private Set<String> notFollowingMeBack; 
    private Set<String> iDontFollowBack;    
    private Set<String> newUnfollowers;     
    private Set<String> fans;               
    private double toxicScore;             
    private double mutualityRate;           
}
