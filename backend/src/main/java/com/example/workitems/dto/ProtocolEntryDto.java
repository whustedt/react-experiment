package com.example.workitems.dto;

import java.time.OffsetDateTime;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class ProtocolEntryDto {
    public String id;
    public OffsetDateTime timestamp;
    public String source;
    public String message;

    public ProtocolEntryDto() {
    }

    public ProtocolEntryDto(String id, OffsetDateTime timestamp, String source, String message) {
        this.id = id;
        this.timestamp = timestamp;
        this.source = source;
        this.message = message;
    }
}
