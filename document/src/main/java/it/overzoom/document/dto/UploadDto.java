package it.overzoom.document.dto;

public class UploadDto {

    private String filename;

    public UploadDto(String filename) {
        this.filename = filename;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
