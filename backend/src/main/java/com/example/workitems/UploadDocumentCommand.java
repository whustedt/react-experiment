package com.example.workitems;

import java.util.List;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class UploadDocumentCommand {
    public String fileName;
    public String mimeType;
    public long sizeInBytes;
    public List<String> indexKeywords;
    public String uploadedBy;
}
