package it.overzoom.document.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import it.overzoom.document.dto.UploadDTO;
import it.overzoom.document.service.PdfService;
import it.overzoom.document.service.TemplateService;

@RestController
@RequestMapping("/api/document")
public class TemplateController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private TemplateService templateService;

    @PostMapping(value = "/{template}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_PDF_VALUE)
    public byte[] generateReport(@PathVariable(value = "template") String template,
            @RequestBody Map<String, Object> model) throws Exception {
        return pdfService.generatePdf(template, model);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadDTO> upload(@RequestParam("file") MultipartFile file)
            throws IOException, IllegalArgumentException {
        String normalizedFileName = templateService.saveTemplate(file);
        return ResponseEntity.ok(new UploadDTO(normalizedFileName));
    }
}
