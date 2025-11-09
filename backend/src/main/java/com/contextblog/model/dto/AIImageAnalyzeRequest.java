package com.contextblog.model.dto;

import jakarta.validation.constraints.NotBlank;

public record AIImageAnalyzeRequest(
    @NotBlank(message = "Image data is required")
    String imageBase64
) {}

