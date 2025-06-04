package it.overzoom.registry.model;

public class KeyValue {
    private String key;
    private Float value;

    public KeyValue() {
    }

    public KeyValue(String key, Float value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Float getValue() {
        return value;
    }

    public void setValue(Float value) {
        this.value = value;
    }
}
