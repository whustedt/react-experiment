package com.example.workitems;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class WorkItemResourceTest {

    @Test
    void shouldShowMyBasket() {
        given().queryParam("basket", "MY")
                .when().get("/api/work-items")
                .then().statusCode(200)
                .body("items", hasSize(2))
                .body("total", equalTo(2));
    }

    @Test
    void shouldSearchAcrossAllTasks() {
        given().queryParam("basket", "TEAM")
                .queryParam("q", "S-2001")
                .when().get("/api/work-items")
                .then().statusCode(200)
                .body("total", greaterThan(0));
    }

    @Test
    void shouldGetContextForDomainObject() {
        given().queryParam("objectType", "CLAIM")
                .queryParam("objectId", "S-2001")
                .when().get("/api/work-items/context")
                .then().statusCode(200)
                .body("objectId", equalTo("S-2001"))
                .body("documents", hasSize(2));
    }

    @Test
    void shouldUploadIndexedDocument() {
        given()
                .contentType("application/json")
                .body("""
                        {
                          "fileName": "Pruefbericht.pdf",
                          "mimeType": "application/pdf",
                          "sizeInBytes": 12345,
                          "indexKeywords": ["Pruefung", "Schaden"],
                          "uploadedBy": "Alice"
                        }
                        """)
                .when().post("/api/work-items/context/CLAIM/S-2001/documents")
                .then().statusCode(200)
                .body("fileName", equalTo("Pruefbericht.pdf"));
    }
}
