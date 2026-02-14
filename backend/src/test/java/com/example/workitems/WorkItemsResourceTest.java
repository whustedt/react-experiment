package com.example.workitems;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class WorkItemsResourceTest {

    @Test
    void shouldSearchWorkItems() {
        given()
                .queryParam("page", 0)
                .queryParam("size", 2)
                .queryParam("status", "OPEN")
                .when()
                .get("/api/work-items")
                .then()
                .statusCode(200)
                .body("items", hasSize(2))
                .body("total", greaterThanOrEqualTo(2));
    }

    @Test
    void shouldGetById() {
        given()
                .when()
                .get("/api/work-items/WI-1001")
                .then()
                .statusCode(200)
                .body("id", equalTo("WI-1001"))
                .body("customerName", notNullValue());
    }
}
