package com.example.workitems;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class WorkItemResourceTest {

    @Test
    void shouldSearchWorkItems() {
        given().queryParam("page", 0).queryParam("size", 2).queryParam("status", "OPEN")
                .when().get("/api/work-items")
                .then().statusCode(200)
                .body("items", hasSize(2))
                .body("total", equalTo(2));
    }

    @Test
    void shouldGetWorkItemById() {
        given().when().get("/api/work-items/WI-1001")
                .then().statusCode(200)
                .body("id", equalTo("WI-1001"));
    }
}
