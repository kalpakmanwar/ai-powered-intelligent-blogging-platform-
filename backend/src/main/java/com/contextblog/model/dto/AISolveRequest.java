package com.contextblog.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AISolveRequest {
    @NotBlank(message = "Question is required")
    private String question;
}

