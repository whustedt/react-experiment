package com.example.workitems.dto;

import java.time.OffsetDateTime;
import java.util.List;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class DocumentDto {
    public String id;
    public String fileName;
    public String mimeType;
    public long sizeInBytes;
    public List<String> indexKeywords;
    public OffsetDateTime uploadedAt;
    public String uploadedBy;

    public DocumentDto() {
    }

    public DocumentDto(String id, String fileName, String mimeType, long sizeInBytes, List<String> indexKeywords,
            OffsetDateTime uploadedAt, String uploadedBy) {
        this.id = id;
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.sizeInBytes = sizeInBytes;
        this.indexKeywords = indexKeywords;
        this.uploadedAt = uploadedAt;
        this.uploadedBy = uploadedBy;
    }
}
