package com.example.civic_backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OpenApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Swagger UI HTML endpoint should be accessible and return HTML")
    void testSwaggerUiHtml() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_HTML))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("CivicAdvocate")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("swagger-ui")));
    }

    @Test
    @DisplayName("Swagger UI redirect from /swagger-ui to /swagger-ui.html")
    void testSwaggerUiRedirect() throws Exception {
        mockMvc.perform(get("/swagger-ui"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "/swagger-ui.html"));
    }

    @Test
    @DisplayName("OpenAPI 3.0.3 specification JSON endpoint should return valid schema definition")
    void testOpenApiDocsJson() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.openapi").value("3.0.3"))
                .andExpect(jsonPath("$.info.title").exists())
                .andExpect(jsonPath("$.paths['/api/v1/tickets']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/tickets/{id}']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/tickets/{id}/timeline']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/tickets/{id}/resolve']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/simulation/tickets/{id}/advance']").exists())
                .andExpect(jsonPath("$.components.schemas.IngestResponse").exists())
                .andExpect(jsonPath("$.components.schemas.AdvanceResponse").exists());
    }

    @Test
    @DisplayName("Static resource handler should serve uploaded files from /uploads/**")
    void testUploadsStaticResource() throws Exception {
        mockMvc.perform(get("/uploads/pothole_badangpet.jpg"))
                .andExpect(status().isOk());
    }
}
