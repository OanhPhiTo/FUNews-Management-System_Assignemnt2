package com.oanhtp.assignment2.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagDTO {
    private Integer tagID;

    @NotBlank(message = "Tag name is required")
    private String tagName;

    private String note;
}

