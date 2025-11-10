package com.contextblog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class OpenRouterService {
    private static final Logger logger = LoggerFactory.getLogger(OpenRouterService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    @Value("${openai.api.base-url:https://openrouter.ai/api/v1}")
    private String baseUrl;
    
    public OpenRouterService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) TimeUnit.SECONDS.toMillis(5)); // Reduced from 10s to 5s
        factory.setReadTimeout((int) TimeUnit.SECONDS.toMillis(15)); // Reduced from 30s to 15s
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Validate API key configuration at startup
     */
    @PostConstruct
    public void validateApiKey() {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("⚠️  WARNING: OpenRouter API key is not configured or is using default value.");
            logger.warn("⚠️  Please set a valid API key in application.properties: openai.api.key=YOUR_KEY_HERE");
            logger.warn("⚠️  Get your API key from: https://openrouter.ai/keys");
            logger.warn("⚠️  AI features will use fallback responses until a valid key is configured.");
        } else if (!apiKey.startsWith("sk-or-v1-")) {
            logger.warn("⚠️  WARNING: API key format may be incorrect. OpenRouter keys typically start with 'sk-or-v1-'");
            logger.warn("⚠️  Please verify your API key in application.properties");
        } else {
            logger.info("✅ OpenRouter API key configured successfully");
            logger.info("📝 API key starts with: {}", apiKey.substring(0, Math.min(15, apiKey.length())) + "...");
        }
    }
    
    public String generateSummary(String content) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("API key not configured, using fallback summary");
            return content.length() > 200 ? content.substring(0, 200) + "..." : content;
        }
        
        try {
            logger.info("Generating summary using OpenRouter API");
            
            // Prepare request
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "You are a helpful assistant that generates comprehensive summaries of blog posts."));
            messages.add(Map.of("role", "user", "content", "Generate a comprehensive summary (4-6 sentences) of the following blog post. Cover the main points, key ideas, and important details:\n\n" + content));
            
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 300);
            requestBody.put("temperature", 0.7);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "AI Context Blog System");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Make API call
            String url = baseUrl + "/chat/completions";
            logger.info("Calling OpenRouter API: {}", url);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
                    String summary = jsonNode.get("choices").get(0).get("message").get("content").asText();
                    logger.info("Summary generated successfully");
                    return summary.trim();
                } else {
                    logger.error("Invalid response format from OpenRouter: {}", response.getBody());
                    return content.length() > 200 ? content.substring(0, 200) + "..." : content;
                }
            } else {
                logger.error("OpenRouter API returned status: {} with body: {}", response.getStatusCode(), response.getBody());
                return content.length() > 200 ? content.substring(0, 200) + "..." : content;
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            logger.error("HTTP error from OpenRouter: Status={}, Body={}", e.getStatusCode(), e.getResponseBodyAsString());
            return content.length() > 200 ? content.substring(0, 200) + "..." : content;
        } catch (Exception e) {
            logger.error("Error generating summary: {}", e.getMessage(), e);
            e.printStackTrace();
            return content.length() > 200 ? content.substring(0, 200) + "..." : content;
        }
    }
    
    public List<String> generateTags(String title, String content) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("API key not configured, using fallback tag extraction");
            return extractSimpleTags(title, content);
        }
        
        try {
            logger.info("Generating tags using OpenRouter API");
            
            // Prepare request
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "You are a helpful assistant that generates relevant tags for blog posts. Return only a comma-separated list of 3-5 tags, no other text."));
            messages.add(Map.of("role", "user", "content", "Generate 3-5 relevant tags for this blog post:\n\nTitle: " + title + "\n\nContent: " + content.substring(0, Math.min(1000, content.length()))));
            
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 50);
            requestBody.put("temperature", 0.7);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "AI Context Blog System");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Make API call
            String url = baseUrl + "/chat/completions";
            logger.info("Calling OpenRouter API: {}", url);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
                    String tagsResponse = jsonNode.get("choices").get(0).get("message").get("content").asText();
                    logger.info("Tags generated successfully: {}", tagsResponse);
                    
                    return Arrays.stream(tagsResponse.split(","))
                            .map(String::trim)
                            .filter(tag -> !tag.isEmpty())
                            .limit(5)
                            .collect(Collectors.toList());
                } else {
                    logger.error("Invalid response format from OpenRouter: {}", response.getBody());
                    return extractSimpleTags(title, content);
                }
            } else {
                logger.error("OpenRouter API returned status: {} with body: {}", response.getStatusCode(), response.getBody());
                return extractSimpleTags(title, content);
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            logger.error("HTTP error from OpenRouter: Status={}, Body={}", e.getStatusCode(), e.getResponseBodyAsString());
            return extractSimpleTags(title, content);
        } catch (Exception e) {
            logger.error("Error generating tags: {}", e.getMessage(), e);
            e.printStackTrace();
            return extractSimpleTags(title, content);
        }
    }
    
    private List<String> extractSimpleTags(String title, String content) {
        // Simple keyword extraction as fallback
        String combined = (title + " " + content).toLowerCase();
        List<String> commonWords = Arrays.asList("the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can", "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they");
        
        return Arrays.stream(combined.split("\\s+"))
                .filter(word -> word.length() > 4)
                .filter(word -> !commonWords.contains(word))
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
    }
    
    public String generateSuggestion(String text, String context) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("API key not configured, using fallback suggestion");
            return "";
        }
        
        try {
            logger.info("Generating AI suggestion");
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "You are a helpful writing assistant. Provide brief, helpful suggestions to continue or improve the text. Keep suggestions concise (1-2 sentences max)."));
            
            String prompt = "Based on the following text, provide a brief suggestion for what to write next or how to improve it:\n\n";
            if (!context.isEmpty()) {
                prompt += "Context: " + context + "\n\n";
            }
            prompt += "Current text: " + text.substring(Math.max(0, text.length() - 500));
            
            messages.add(Map.of("role", "user", "content", prompt));
            
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 100);
            requestBody.put("temperature", 0.7);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "AI Context Blog System");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            String url = baseUrl + "/chat/completions";
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
                    String suggestion = jsonNode.get("choices").get(0).get("message").get("content").asText();
                    logger.info("Suggestion generated successfully");
                    return suggestion.trim();
                }
            }
            return "";
        } catch (Exception e) {
            logger.error("Error generating suggestion: {}", e.getMessage(), e);
            return "";
        }
    }
    
    public String solveProblem(String question) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("API key not configured, using fallback response");
            return "I'm sorry, but the AI service is not configured. Please check the API key settings.";
        }
        
        try {
            logger.info("Solving problem using OpenRouter API");
            
            // Try different models in order of preference (fastest first)
            String[] modelsToTry = {
                "google/gemini-flash-1.5",  // Fastest Gemini model
                "google/gemini-2.0-flash-exp",
                "openai/gpt-3.5-turbo",     // Fast and reliable
                "google/gemini-pro"        // Slower but more capable
            };
            
            Exception lastException = null;
            for (String model : modelsToTry) {
                try {
                    logger.info("Trying model: {}", model);
                    Map<String, Object> requestBody = new HashMap<>();
                    requestBody.put("model", model);
                    
                    List<Map<String, String>> messages = new ArrayList<>();
                    messages.add(Map.of("role", "system", "content", "You are a helpful AI assistant that provides clear, concise, and accurate answers to user questions. Be friendly and professional."));
                    messages.add(Map.of("role", "user", "content", question));
                    
                    requestBody.put("messages", messages);
                    requestBody.put("max_tokens", 500); // Reduced from 1000 for faster responses
                    requestBody.put("temperature", 0.7);
                    requestBody.put("stream", false); // Ensure non-streaming for faster response
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.set("Authorization", "Bearer " + apiKey);
                    headers.set("HTTP-Referer", "http://localhost:3000");
                    headers.set("X-Title", "AI Context Blog System");
                    
                    HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                    String url = baseUrl + "/chat/completions";
                    
                    logger.info("Calling OpenRouter API: {} with model: {}", url, model);
                    ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
                    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                        JsonNode jsonNode = objectMapper.readTree(response.getBody());
                        if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
                            String answer = jsonNode.get("choices").get(0).get("message").get("content").asText();
                            logger.info("Problem solved successfully using model: {}", model);
                            return answer.trim();
                        } else {
                            logger.warn("Invalid response format from OpenRouter for model {}: {}", model, response.getBody());
                            // Try next model
                            continue;
                        }
                    } else {
                        logger.warn("OpenRouter API returned status {} for model {}: {}", response.getStatusCode(), model, response.getBody());
                        // Try next model
                        continue;
                    }
                } catch (org.springframework.web.client.HttpClientErrorException e) {
                    String errorBody = e.getResponseBodyAsString();
                    logger.warn("HTTP error for model {}: Status={}, Body={}", model, e.getStatusCode(), errorBody);
                    
                    // If it's authentication error, don't try other models
                    if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                        logger.error("❌ Authentication error - API key might be invalid or expired");
                        logger.error("❌ Error details: {}", errorBody);
                        logger.error("❌ Please check your API key in backend/src/main/resources/application.properties");
                        logger.error("❌ Get a new key from: https://openrouter.ai/keys");
                        return "I'm sorry, but there was an authentication error. Please check your API key in the backend configuration (application.properties).\n\n" +
                               "Troubleshooting:\n" +
                               "1. Verify your API key in backend/src/main/resources/application.properties\n" +
                               "2. Get a new key from https://openrouter.ai/keys\n" +
                               "3. Ensure the key starts with 'sk-or-v1-'\n" +
                               "4. Restart the backend server after updating the key\n" +
                               "5. Check backend logs for detailed error messages";
                    }
                    
                    // If it's model not found, try next model
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND || e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        lastException = e;
                        continue; // Try next model
                    }
                    
                    // For other errors, try next model
                    lastException = e;
                    continue;
                } catch (Exception e) {
                    logger.warn("Error with model {}: {}", model, e.getMessage());
                    lastException = e;
                    continue; // Try next model
                }
            }
            
            // If we get here, all models failed
            if (lastException instanceof org.springframework.web.client.HttpClientErrorException) {
                org.springframework.web.client.HttpClientErrorException httpEx = (org.springframework.web.client.HttpClientErrorException) lastException;
                String errorBody = httpEx.getResponseBodyAsString();
                logger.error("All models failed. Last error: Status={}, Body={}", httpEx.getStatusCode(), errorBody);
                
                if (httpEx.getStatusCode() == HttpStatus.BAD_REQUEST) {
                    return "I'm sorry, but there was an error with the request format. Please check the backend logs for details.";
                } else {
                    return "I'm sorry, but all AI models failed. Please check your API key and try again. Error: " + httpEx.getStatusCode();
                }
            } else {
                logger.error("All models failed. Last exception: {}", lastException != null ? lastException.getMessage() : "Unknown");
                return "I'm sorry, but all AI models failed. Please check your API key and network connection.";
            }
        } catch (RestClientException e) {
            Throwable cause = e.getCause();
            if (cause instanceof UnknownHostException) {
                logger.error("Cannot resolve hostname 'openrouter.ai'. Please check your internet connection and DNS settings.");
                return "I'm sorry, but I cannot connect to the AI service. Please check your internet connection and ensure 'openrouter.ai' is accessible. If you're behind a firewall or proxy, please configure it accordingly.";
            } else if (cause instanceof java.net.ConnectException) {
                logger.error("Connection refused to OpenRouter API. Please check your network connection.");
                return "I'm sorry, but I cannot connect to the AI service. Please check your internet connection and try again.";
            } else if (cause instanceof java.net.SocketTimeoutException) {
                logger.error("Connection timeout to OpenRouter API.");
                return "I'm sorry, but the connection to the AI service timed out. Please try again.";
            } else {
                logger.error("Network error connecting to OpenRouter: {}", e.getMessage(), e);
                return "I'm sorry, but there was a network error connecting to the AI service. Please check your internet connection and try again.";
            }
        } catch (Exception e) {
            logger.error("Error solving problem: {}", e.getMessage(), e);
            e.printStackTrace();
            return "I'm sorry, but an unexpected error occurred. Please try again.";
        }
    }
    
    /**
     * Generate news/blog content using OpenRouter API
     * Returns a list of news items with titles, summaries, and categories
     */
    public List<Map<String, String>> generateNews(int count) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("API key not configured, using fallback news");
            return getFallbackNews(count);
        }
        
        try {
            // Get current date for context
            java.time.LocalDate today = java.time.LocalDate.now();
            String dateContext = today.toString();
            
            String prompt = String.format(
                "You are a news aggregator. Provide %d REAL, ACTUAL news headlines from India that happened TODAY (%s) or in the last 24 hours. " +
                "These must be REAL news events, not generic or hypothetical news. " +
                "Include actual news from categories: Politics, Technology, Sports, Entertainment, Business, Education, Health, Science, Crime, Weather, Economy. " +
                "Each news item must be: " +
                "1. A REAL event that actually happened recently in India " +
                "2. Include specific details, names, places, or events " +
                "3. Have a detailed summary (100-150 words) explaining what happened " +
                "Format as JSON array with objects containing: title (specific and real), summary (detailed, 100-150 words), category. " +
                "Return ONLY valid JSON array, no markdown, no code blocks, no explanations. " +
                "Example format: [{\"title\": \"Specific Real News Headline\", \"summary\": \"Detailed explanation...\", \"category\": \"Politics\"}]",
                count, dateContext
            );
            
            String[] models = {
                "google/gemini-2.0-flash-exp",  // Try newest model first
                "google/gemini-flash-1.5",
                "openai/gpt-4o-mini",  // Use GPT-4o-mini instead of 3.5
                "openai/gpt-3.5-turbo",
                "google/gemini-pro"
            };
            
            for (String model : models) {
                try {
                    logger.info("Attempting to fetch real news using model: {}", model);
                    Map<String, Object> requestBody = new HashMap<>();
                    requestBody.put("model", model);
                    requestBody.put("messages", Arrays.asList(
                        Map.of("role", "user", "content", prompt)
                    ));
                    requestBody.put("max_tokens", 2000);  // Increased for more detailed news
                    requestBody.put("temperature", 0.3);  // Lower temperature for more factual, less creative
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.set("Authorization", "Bearer " + apiKey);
                    headers.set("HTTP-Referer", "https://github.com/yourusername/contextblog");
                    headers.set("X-Title", "Context Blog System");
                    
                    HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                    ResponseEntity<JsonNode> response = restTemplate.exchange(
                        baseUrl + "/chat/completions",
                        HttpMethod.POST,
                        request,
                        JsonNode.class
                    );
                    
                    JsonNode responseBody = response.getBody();
                    if (response.getStatusCode() == HttpStatus.OK && responseBody != null) {
                        JsonNode choices = responseBody.get("choices");
                        if (choices != null && choices.isArray() && choices.size() > 0) {
                            String content = choices.get(0).get("message").get("content").asText();
                            // Clean the content (remove markdown code blocks if present)
                            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
                            
                            // Parse JSON array
                            JsonNode newsArray = objectMapper.readTree(content);
                            if (newsArray.isArray()) {
                                List<Map<String, String>> newsList = new ArrayList<>();
                                for (JsonNode item : newsArray) {
                                    Map<String, String> newsItem = new HashMap<>();
                                    newsItem.put("title", item.has("title") ? item.get("title").asText() : "News Title");
                                    newsItem.put("summary", item.has("summary") ? item.get("summary").asText() : "News summary");
                                    newsItem.put("category", item.has("category") ? item.get("category").asText() : "Technology");
                                    newsItem.put("thumbnail", generateImageUrl(newsItem.get("title"), newsItem.get("category")));
                                    newsList.add(newsItem);
                                }
                                logger.info("Successfully generated {} REAL news items using model {}", newsList.size(), model);
                                // Validate that we got real news (not fallback)
                                if (newsList.size() > 0) {
                                    logger.info("First news item: {}", newsList.get(0).get("title"));
                                }
                                return newsList;
                            }
                        }
                    }
                } catch (Exception e) {
                    logger.error("Error with model {}: {}", model, e.getMessage(), e);
                    continue;
                }
            }
            
            // If all models fail, log error and return fallback
            logger.error("All models failed to generate real news. Using fallback news. Check API key and network connection.");
            return getFallbackNews(count);
        } catch (Exception e) {
            logger.error("Error generating news: {}", e.getMessage(), e);
            return getFallbackNews(count);
        }
    }
    
    /**
     * Generate image URL based on title and category
     */
    private String generateImageUrl(String title, String category) {
        // Use Unsplash API with category-based images
        String categoryLower = category.toLowerCase();
        String imageId;
        
        switch (categoryLower) {
            case "technology":
            case "ai/ml":
            case "science":
                imageId = "1677442136019-21780ecad995";
                break;
            case "sports":
            case "cricket":
            case "football":
                imageId = "1579952363873-27f3b1cddf47"; // Sports image
                break;
            case "politics":
            case "business":
                imageId = "1551288049-beb63bb97e33"; // Business/Politics image
                break;
            case "entertainment":
            case "bollywood":
                imageId = "1485846234645-a62644f84728"; // Entertainment image
                break;
            case "health":
            case "education":
                imageId = "1571019613454-1cb2f99b2d8b"; // Health/Education image
                break;
            case "web development":
                imageId = "1633356122544-f134324a6cee";
                break;
            case "programming":
                imageId = "1555066931-4365d14bab8c";
                break;
            case "design":
                imageId = "1561070791-2526d30994b5";
                break;
            default:
                imageId = "1551288049-beb63bb97e33"; // Default India-related image
        }
        
        return String.format("https://images.unsplash.com/photo-%s?w=400&h=300&fit=crop&auto=format", imageId);
    }
    
    /**
     * Analyze and summarize an uploaded image using AI vision models
     * @param imageBase64 Base64 encoded image data (with or without data URL prefix)
     * @return AI-generated summary/description of the image
     */
    public String analyzeImage(String imageBase64) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openai-api-key-here")) {
            logger.warn("API key not configured, using fallback response");
            return "I'm sorry, but the AI service is not configured. Please check the API key settings.";
        }
        
        try {
            logger.info("Analyzing image using OpenRouter API");
            
            // Extract image format and base64 data from data URL
            String base64Data = imageBase64;
            String imageFormat = "jpeg"; // default format
            String dataUrlPrefix = "data:image/jpeg;base64,"; // default prefix
            
            if (imageBase64.contains(",")) {
                int commaIndex = imageBase64.indexOf(",");
                String prefix = imageBase64.substring(0, commaIndex);
                base64Data = imageBase64.substring(commaIndex + 1);
                
                // Extract image format from data URL prefix (e.g., "data:image/png;base64,")
                if (prefix.contains("image/")) {
                    String formatPart = prefix.substring(prefix.indexOf("image/") + 6);
                    if (formatPart.contains(";")) {
                        imageFormat = formatPart.substring(0, formatPart.indexOf(";"));
                    } else {
                        imageFormat = formatPart;
                    }
                }
                dataUrlPrefix = "data:image/" + imageFormat + ";base64,";
            } else {
                // If no data URL prefix, assume it's just base64 data and use default format
                dataUrlPrefix = "data:image/jpeg;base64,";
            }
            
            // Try different vision-capable models in order of preference
            // Using multiple models to improve celebrity identification
            String[] modelsToTry = {
                "openai/gpt-4o",                // Most capable OpenAI vision model - best for celebrity recognition
                "google/gemini-2.0-flash-exp",  // Fast vision model
                "openai/gpt-4o-mini",          // Fast OpenAI vision model
                "google/gemini-pro-vision",     // Gemini Pro with vision capabilities
                "google/gemini-flash-1.5",     // Alternative Gemini model
                "anthropic/claude-3.5-sonnet", // Claude model with vision
                "anthropic/claude-3-opus"       // Most capable Claude model
            };
            
            Exception lastException = null;
            for (String model : modelsToTry) {
                try {
                    logger.info("Trying vision model: {}", model);
                    Map<String, Object> requestBody = new HashMap<>();
                    requestBody.put("model", model);
                    
                    // Build message with image content
                    List<Map<String, Object>> messages = new ArrayList<>();
                    
                    Map<String, Object> userMessage = new HashMap<>();
                    userMessage.put("role", "user");
                    
                    // Create content array with text and image
                    List<Map<String, Object>> content = new ArrayList<>();
                    
                    // Add text prompt
                    Map<String, Object> textContent = new HashMap<>();
                    textContent.put("type", "text");
                    textContent.put("text", "You are an expert at identifying famous people, celebrities, actors, and public figures who are well-known and searchable on Google. Analyze this image carefully. If there is a person visible in the image, you MUST attempt to identify them if they are a known public figure. Look for distinctive facial features, clothing style, and any recognizable characteristics. If you recognize the person as ANY celebrity, actor (including Bollywood actors like Shahrukh Khan, Amitabh Bachchan, Salman Khan, Aamir Khan, etc.), Hollywood actors, singers, politicians, sports personalities, or any public figure who is searchable on Google, you MUST state their full name at the very beginning of your response. Then provide their profession, nationality, and any relevant information about them. After identification, describe the image in detail including clothing, setting, expression, mood, colors, and visual elements. If you cannot identify the person, say 'I cannot identify this person' but still provide a detailed visual description. Remember: If the person is famous and searchable on Google, you should be able to identify them.");
                    content.add(textContent);
                    
                    // Add image content
                    Map<String, Object> imageContent = new HashMap<>();
                    imageContent.put("type", "image_url");
                    Map<String, String> imageUrl = new HashMap<>();
                    imageUrl.put("url", dataUrlPrefix + base64Data);
                    imageContent.put("image_url", imageUrl);
                    content.add(imageContent);
                    
                    userMessage.put("content", content);
                    messages.add(userMessage);
                    
                    requestBody.put("messages", messages);
                    requestBody.put("max_tokens", 1000); // Increased for more detailed responses
                    requestBody.put("temperature", 0.2); // Lower temperature for more factual and accurate identification
                    requestBody.put("stream", false);
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.set("Authorization", "Bearer " + apiKey);
                    headers.set("HTTP-Referer", "http://localhost:3000");
                    headers.set("X-Title", "AI Context Blog System");
                    
                    HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                    String url = baseUrl + "/chat/completions";
                    
                    logger.info("Calling OpenRouter API for image analysis: {} with model: {}", url, model);
                    ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
                    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                        JsonNode jsonNode = objectMapper.readTree(response.getBody());
                        if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
                            String summary = jsonNode.get("choices").get(0).get("message").get("content").asText();
                            logger.info("Image analyzed successfully using model: {}", model);
                            return summary.trim();
                        } else {
                            logger.warn("Invalid response format from OpenRouter for model {}: {}", model, response.getBody());
                            continue;
                        }
                    } else {
                        logger.warn("OpenRouter API returned status {} for model {}: {}", response.getStatusCode(), model, response.getBody());
                        continue;
                    }
                } catch (org.springframework.web.client.HttpClientErrorException e) {
                    String errorBody = e.getResponseBodyAsString();
                    logger.warn("HTTP error for model {}: Status={}, Body={}", model, e.getStatusCode(), errorBody);
                    
                    if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                        logger.error("❌ API key issue for model {}. Error: {}", model, errorBody);
                        logger.error("❌ Please check your API key in backend/src/main/resources/application.properties");
                        logger.error("❌ Get a new key from: https://openrouter.ai/keys");
                        lastException = new RuntimeException("API key is invalid or expired. Please check your OpenRouter API key configuration in application.properties. Get a new key from https://openrouter.ai/keys");
                        break; // Don't try other models if API key is invalid
                    } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        logger.warn("Bad request for model {}. Trying next model. Error: {}", model, errorBody);
                        lastException = e;
                        continue; // Try next model
                    } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                        logger.warn("Model {} not found. Trying next model.", model);
                        lastException = e;
                        continue; // Try next model
                    } else {
                        lastException = e;
                        continue; // Try next model
                    }
                } catch (RestClientException e) {
                    Throwable cause = e.getCause();
                    if (cause instanceof UnknownHostException) {
                        logger.error("Network error: Cannot connect to openrouter.ai. Please check your internet connection and DNS settings.");
                        lastException = new RuntimeException("Cannot connect to AI service. Please check your internet connection.", e);
                        break; // Don't try other models if network is down
                    } else if (cause instanceof java.net.ConnectException) {
                        logger.error("Connection error: Cannot reach openrouter.ai. Please check your firewall/proxy settings.");
                        lastException = new RuntimeException("Cannot connect to AI service. Please check your firewall/proxy settings.", e);
                        break;
                    } else if (cause instanceof java.net.SocketTimeoutException) {
                        logger.warn("Timeout for model {}. Trying next model.", model);
                        lastException = e;
                        continue; // Try next model
                    } else {
                        logger.warn("RestClientException for model {}: {}", model, e.getMessage());
                        lastException = e;
                        continue; // Try next model
                    }
                } catch (Exception e) {
                    logger.error("Unexpected error for model {}: {}", model, e.getMessage(), e);
                    lastException = e;
                    continue; // Try next model
                }
            }
            
            // If all models failed, throw the last exception
            if (lastException != null) {
                throw lastException;
            } else {
                throw new RuntimeException("All vision models failed. Please try again later.");
            }
        } catch (Exception e) {
            logger.error("Error analyzing image: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to analyze image: " + e.getMessage(), e);
        }
    }
    
    /**
     * Fallback news when API is not available - Indian news focus
     */
    private List<Map<String, String>> getFallbackNews(int count) {
        List<Map<String, String>> news = new ArrayList<>();
        String[] titles = {
            "India's Tech Sector Sees Record Growth in 2024",
            "Indian Cricket Team Prepares for World Cup",
            "Startup Ecosystem in India Reaches New Heights",
            "Digital India Initiative Transforms Rural Connectivity",
            "Indian Space Program Achieves Major Milestone",
            "Bollywood Industry Embraces AI in Film Production",
            "Indian Economy Shows Strong Growth Indicators",
            "Healthcare Innovation in India Gains Global Recognition"
        };
        String[] summaries = {
            "India's technology sector continues to expand rapidly, with major investments in AI, cloud computing, and digital infrastructure driving unprecedented growth across the nation.",
            "The Indian cricket team is gearing up for the upcoming World Cup with intensive training sessions and strategic planning to bring home the championship trophy.",
            "India's startup ecosystem continues to flourish, with thousands of new ventures emerging across various sectors, supported by government initiatives and private investments.",
            "The Digital India initiative is making significant progress in connecting rural areas with high-speed internet, transforming lives and creating new opportunities for millions.",
            "India's space program achieves another milestone with successful satellite launches and ambitious missions planned for the future, showcasing the nation's technological prowess.",
            "Bollywood is increasingly adopting AI and advanced technologies in film production, revolutionizing the entertainment industry and creating new possibilities for storytelling.",
            "India's economy demonstrates strong growth indicators with robust GDP expansion, increased foreign investments, and positive outlook for the coming fiscal year.",
            "Healthcare innovation in India is gaining global recognition with breakthrough medical technologies, affordable solutions, and improved access to quality healthcare services."
        };
        String[] categories = {
            "Technology", "Sports", "Business", "Technology",
            "Science", "Entertainment", "Business", "Health"
        };
        String[] imageIds = {
            "1677442136019-21780ecad995",
            "1579952363873-27f3b1cddf47",
            "1551288049-beb63bb97e33",
            "1677442136019-21780ecad995",
            "1677442136019-21780ecad995",
            "1485846234645-a62644f84728",
            "1551288049-beb63bb97e33",
            "1571019613454-1cb2f99b2d8b"
        };
        
        for (int i = 0; i < Math.min(count, titles.length); i++) {
            Map<String, String> item = new HashMap<>();
            item.put("title", titles[i]);
            item.put("summary", summaries[i]);
            item.put("category", categories[i]);
            item.put("thumbnail", String.format("https://images.unsplash.com/photo-%s?w=400&h=300&fit=crop&auto=format", imageIds[i]));
            news.add(item);
        }
        return news;
    }
}

