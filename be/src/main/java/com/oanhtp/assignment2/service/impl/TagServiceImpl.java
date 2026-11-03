package com.oanhtp.assignment2.service.impl;

import com.oanhtp.assignment2.dto.TagDTO;
import com.oanhtp.assignment2.entity.Tag;
import com.oanhtp.assignment2.exception.ResourceNotFoundException;
import com.oanhtp.assignment2.repository.TagRepository;
import com.oanhtp.assignment2.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TagDTO getTagById(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag with ID " + id + " not found."));
        return mapToDTO(tag);
    }

    @Override
    @Transactional
    public TagDTO createTag(TagDTO tagDTO) {
        Tag tag = Tag.builder()
                .tagName(tagDTO.getTagName().trim())
                .note(tagDTO.getNote() != null ? tagDTO.getNote().trim() : null)
                .build();
        return mapToDTO(tagRepository.save(tag));
    }

    private TagDTO mapToDTO(Tag tag) {
        return TagDTO.builder()
                .tagID(tag.getTagID())
                .tagName(tag.getTagName())
                .note(tag.getNote())
                .build();
    }
}

