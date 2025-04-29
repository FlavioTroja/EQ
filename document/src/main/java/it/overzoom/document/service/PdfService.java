package it.overzoom.document.service;

import java.io.ByteArrayOutputStream;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Service
public class PdfService {

    @Autowired
    private SpringTemplateEngine templateEngine;

    public byte[] generatePdf(String templateName, Map<String, Object> data) throws Exception {
        Context context = new Context();
        context.setVariables(data);

        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
        templateResolver.setCacheable(false);

        String htmlContent = templateEngine.process(templateName, context);

        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlContent);
        renderer.layout();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            renderer.createPDF(baos);
            return baos.toByteArray();
        }
    }
}
