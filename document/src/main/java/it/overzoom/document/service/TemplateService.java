package it.overzoom.document.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TemplateService {

    private static final Path TEMPLATES_DIR = Paths.get("src/main/resources/templates").toAbsolutePath();

    public String saveTemplate(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Il file è vuoto");
        }
        String normalizedFileName = normalizeFileName(file.getOriginalFilename());
        Path destinationFile = TEMPLATES_DIR.resolve(Paths.get(normalizedFileName))
                .normalize().toAbsolutePath();

        if (!destinationFile.startsWith(TEMPLATES_DIR)) {
            throw new IllegalArgumentException("Impossibile salvare il file al di fuori della cartella target");
        }
        file.transferTo(destinationFile);
        return normalizedFileName;
    }

    public String normalizeFileName(String originalName) {
        if (originalName == null) {
            throw new IllegalArgumentException("Il nome del file non può essere nullo");
        }
        int dotIndex = originalName.lastIndexOf(".");
        String namePart = (dotIndex == -1) ? originalName : originalName.substring(0, dotIndex);
        String extension = (dotIndex == -1) ? "" : originalName.substring(dotIndex);

        String normalizedName = namePart.replaceAll("[^a-zA-Z0-9-_]", "");

        String uniqueCode = "_" + UUID.randomUUID().toString().substring(0, 8);

        return normalizedName + uniqueCode + extension;
    }
}
