package com.contextblog.controller;

import com.contextblog.model.dto.AIImageAnalyzeRequest;
import com.contextblog.model.dto.AIImageAnalyzeResponse;
import com.contextblog.model.dto.AISolveRequest;
import com.contextblog.model.dto.AISolveResponse;
import com.contextblog.service.OpenRouterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AI Controller
 * 
 * Handles AI-related endpoints including:
 * - Problem solving (chat-based AI assistance)
 * - Image analysis (vision-based AI analysis)
 * 
 * All endpoints require authentication.
 * 
 * @author Your Name
 * @version 1.0
 */
@RestController
@RequestMapping("/api/ai")
public class AIController {
    
    @Autowired
    private OpenRouterService openRouterService;
    
    /**
     * Solve a problem using AI
     * 
     * @param request The problem/question to solve
     * @param authentication Current authenticated user
     * @return AI-generated solution
     */
    @PostMapping("/solve")
    public ResponseEntity<?> solveProblem(@Valid @RequestBody AISolveRequest request, Authentication authentication) {
        try {
            String answer = openRouterService.solveProblem(request.getQuestion());
            AISolveResponse response = new AISolveResponse(answer, "google/gemini-2.0-flash-exp");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to solve problem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Analyze an image using AI vision models
     * 
     * Supports multiple vision models (GPT-4o, Gemini, Claude) for better accuracy.
     * Automatically detects image format and handles various image types.
     * 
     * @param request Image data in base64 format
     * @param authentication Current authenticated user
     * @return AI-generated image summary/analysis
     */
    @PostMapping("/analyze-image")
    public ResponseEntity<?> analyzeImage(@Valid @RequestBody AIImageAnalyzeRequest request, Authentication authentication) {
        try {
            String summary = openRouterService.analyzeImage(request.imageBase64());
            AIImageAnalyzeResponse response = new AIImageAnalyzeResponse(summary, "google/gemini-2.0-flash-exp");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to analyze image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

