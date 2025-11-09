# Testing Guide

This guide covers how to add and run tests for the AI Context Blog System.

## 🧪 Testing Strategy

### Backend Testing (Spring Boot)

#### Unit Tests with JUnit 5

1. **Add Test Dependencies** (already in `pom.xml`):
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
   </dependency>
   ```

2. **Create Test Directory Structure**:
   ```
   backend/src/test/java/com/contextblog/
   ├── controller/
   ├── service/
   ├── repository/
   └── security/
   ```

#### Example Unit Tests

**Service Test Example** (`BlogServiceTest.java`):
```java
package com.contextblog.service;

import com.contextblog.model.Blog;
import com.contextblog.model.dto.BlogRequest;
import com.contextblog.repository.BlogRepository;
import com.contextblog.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogServiceTest {
    
    @Mock
    private BlogRepository blogRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private BlogService blogService;
    
    private BlogRequest blogRequest;
    
    @BeforeEach
    void setUp() {
        blogRequest = new BlogRequest();
        blogRequest.setTitle("Test Blog");
        blogRequest.setContent("Test Content");
    }
    
    @Test
    void testCreateBlog() {
        // Given
        Blog savedBlog = new Blog();
        savedBlog.setId(1L);
        savedBlog.setTitle("Test Blog");
        
        when(blogRepository.save(any(Blog.class))).thenReturn(savedBlog);
        
        // When
        Blog result = blogService.createBlog(blogRequest, "testuser");
        
        // Then
        assertNotNull(result);
        assertEquals("Test Blog", result.getTitle());
        verify(blogRepository, times(1)).save(any(Blog.class));
    }
}
```

**Controller Test Example** (`BlogControllerTest.java`):
```java
package com.contextblog.controller;

import com.contextblog.model.Blog;
import com.contextblog.service.BlogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BlogController.class)
class BlogControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private BlogService blogService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testGetAllBlogs() throws Exception {
        // Given
        Blog blog1 = new Blog();
        blog1.setId(1L);
        blog1.setTitle("Blog 1");
        
        Blog blog2 = new Blog();
        blog2.setId(2L);
        blog2.setTitle("Blog 2");
        
        List<Blog> blogs = Arrays.asList(blog1, blog2);
        when(blogService.getAllBlogs()).thenReturn(blogs);
        
        // When & Then
        mockMvc.perform(get("/api/blogs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Blog 1"));
    }
}
```

#### Integration Tests

**Integration Test Example** (`BlogIntegrationTest.java`):
```java
package com.contextblog.integration;

import com.contextblog.model.dto.BlogRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BlogIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testCreateBlogIntegration() throws Exception {
        BlogRequest request = new BlogRequest();
        request.setTitle("Integration Test Blog");
        request.setContent("Integration Test Content");
        
        mockMvc.perform(post("/api/blogs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
```

---

### Frontend Testing (React)

#### Unit Tests with Jest & React Testing Library

1. **Install Testing Dependencies** (already included):
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom
   ```

2. **Create Test Files**:
   ```
   frontend/src/
   ├── components/
   │   └── BlogCard.test.js
   ├── pages/
   │   └── Dashboard.test.js
   └── services/
       └── api.test.js
   ```

#### Example Component Test

**Component Test Example** (`BlogCard.test.js`):
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogCard from './BlogCard';

describe('BlogCard', () => {
  const mockBlog = {
    id: 1,
    title: 'Test Blog',
    summary: 'Test Summary',
    author: { username: 'testuser' },
    tags: ['test', 'blog']
  };

  it('renders blog title', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
  });

  it('renders blog summary', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByText('Test Summary')).toBeInTheDocument();
  });

  it('renders author username', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
});
```

**Page Test Example** (`Dashboard.test.js`):
```javascript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/AI Context Blog/i)).toBeInTheDocument();
  });
});
```

---

## 🚀 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=BlogServiceTest

# Run with coverage
mvn test jacoco:report
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## 📊 Test Coverage

### Backend Coverage

Add JaCoCo for code coverage:
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.8</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### Frontend Coverage

Jest automatically generates coverage reports:
```bash
npm test -- --coverage --watchAll=false
```

---

## ✅ Testing Best Practices

1. **Write tests before fixing bugs** (TDD approach)
2. **Test edge cases** (empty inputs, null values, etc.)
3. **Use descriptive test names** (should_do_something_when_condition)
4. **Keep tests independent** (each test should be standalone)
5. **Mock external dependencies** (APIs, databases)
6. **Aim for 80%+ code coverage**
7. **Test user interactions**, not implementation details
8. **Use integration tests** for critical flows

---

## 📝 Test Checklist

- [ ] Unit tests for services
- [ ] Unit tests for controllers
- [ ] Integration tests for API endpoints
- [ ] Component tests for React components
- [ ] Page tests for React pages
- [ ] Authentication flow tests
- [ ] Error handling tests
- [ ] Edge case tests

---

## 🔧 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Run tests
        run: cd backend && mvn test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run tests
        run: cd frontend && npm test -- --watchAll=false
```

---

**Happy Testing! 🧪**

