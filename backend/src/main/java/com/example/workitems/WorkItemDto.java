package com.example.workitems;

import java.time.OffsetDateTime;

public record WorkItemDto(
        String id,
        String customerName,
        String contractNo,
        String type,
        WorkItemStatus status,
        String priority,
        OffsetDateTime receivedAt,
        String assignedTo) {
}
