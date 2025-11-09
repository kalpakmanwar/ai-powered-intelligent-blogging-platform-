package com.contextblog.model.dto;

import com.contextblog.model.Blog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeResponse {
    private String summary;
    private List<String> tags;
    private List<Blog> relatedBlogs;
}

