package com.example.workitems;

import java.time.OffsetDateTime;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class WorkItemActionCommand {
    public WorkItemActionType action;
    public String assignee;
    public OffsetDateTime reminderAt;
    public String note;
}
