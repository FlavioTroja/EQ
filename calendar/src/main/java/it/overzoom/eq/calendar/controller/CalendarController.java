package it.overzoom.eq.calendar.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    /**
     * Restituisce la data di oggi in formato ISO (yyyy-MM-dd).
     */
    @GetMapping("/today")
    public LocalDate getToday() {
        return LocalDate.now();
    }

    /**
     * Restituisce l'elenco dei giorni del mese corrente.
     * Esempio di JSON di risposta:
     * [
     * "2025-02-01",
     * "2025-02-02",
     * "2025-02-03",
     * ...
     * ]
     */
    @GetMapping("/month/current")
    public List<LocalDate> getCurrentMonth() {
        LocalDate now = LocalDate.now();
        YearMonth yearMonth = YearMonth.of(now.getYear(), now.getMonthValue());
        return getDaysInMonth(yearMonth);
    }

    /**
     * Restituisce l'elenco dei giorni di un mese specifico, passato come parametro.
     * Per esempio: /api/calendar/month?year=2025&month=2
     *
     * Se `year` e `month` non vengono passati, viene restituito il mese corrente.
     * Esempio di JSON di risposta:
     * [
     * "2025-02-01",
     * "2025-02-02",
     * "2025-02-03",
     * ...
     * ]
     */
    @GetMapping("/month")
    public List<LocalDate> getMonth(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month) {
        LocalDate now = LocalDate.now();

        int effectiveYear = (year != null) ? year : now.getYear();
        int effectiveMonth = (month != null) ? month : now.getMonthValue();

        YearMonth yearMonth = YearMonth.of(effectiveYear, effectiveMonth);

        return getDaysInMonth(yearMonth);
    }

    /**
     * Restituisce l'elenco dei giorni del mese calcolato in base a un offset
     * rispetto a quello attuale.
     * Esempio: /api/calendar/month/offset?value=1 -> Ritorna il mese successivo
     * /api/calendar/month/offset?value=-1 -> Ritorna il mese precedente
     */
    @GetMapping("/month/offset")
    public List<LocalDate> getMonthByOffset(@RequestParam(name = "value", defaultValue = "0") int offset) {
        LocalDate offsetDate = LocalDate.now().plusMonths(offset);
        YearMonth yearMonth = YearMonth.of(offsetDate.getYear(), offsetDate.getMonthValue());

        return getDaysInMonth(yearMonth);
    }

    /**
     * Metodo di utilità per restituire una lista di LocalDate
     * contenente tutti i giorni del mese specificato.
     */
    private List<LocalDate> getDaysInMonth(YearMonth yearMonth) {
        List<LocalDate> days = new ArrayList<>();
        int lengthOfMonth = yearMonth.lengthOfMonth();
        for (int day = 1; day <= lengthOfMonth; day++) {
            days.add(yearMonth.atDay(day));
        }
        return days;
    }
}
