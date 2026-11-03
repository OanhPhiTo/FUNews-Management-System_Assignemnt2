package com.oanhtp.assignment2.service;

import com.oanhtp.assignment2.dto.TagDTO;

import java.util.List;

public interface TagService {

    List<TagDTO> getAllTags();

    TagDTO getTagById(Integer id);

    TagDTO createTag(TagDTO tagDTO);
}

