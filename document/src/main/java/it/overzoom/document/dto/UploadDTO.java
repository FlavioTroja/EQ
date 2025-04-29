package it.overzoom.document.dto;

public class UploadDTO {

    private String filename;

    public UploadDTO(String filename) {
        this.filename = filename;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
