package com.contextblog.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String content;
}
