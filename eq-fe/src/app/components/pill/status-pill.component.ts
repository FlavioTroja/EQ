import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

/** component for a custom pill for the statues */
@Component({
  selector: 'app-status-pill',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="flex max-w-max px-2 py-1.5 gap-1 items-center break-keep cursor-default rounded-full" [ngClass]="statusArray[status].cssClasses">
      <div class="pr-1 flex self-center">
        <mat-icon class="material-symbols-rounded">
          {{ statusArray[status].iconName }}
        </mat-icon>
      </div>
      <div class="whitespace-nowrap text-sm pr-0.5 text-ellipsis overflow-hidden"
           style="max-width: 10rem">
        {{ statusArray[status].text }}
      </div>
    </div>
  `,
  styles: [``]
})
export class StatusPillComponent {
  /** classes applied to the outher element */
  @Input({ required: true }) status: string = "";

  iconName: string;
  text: string;

  constructor() {
    this.iconName = "";
    this.text = "";
  }

  // Manca lo stato DONE
  statusArray: { [key: string]: status } = {
    "ACCEPTED": {
      iconName: "check",
      text: "confermato",
      cssClasses: "accent",
    },
    "PENDING": {
      iconName: "nest_clock_farsight_analog",
      text: "in attesa",
      cssClasses: "warning",
    },
    "REJECTED": {
      iconName: "close",
      text: "rifiutato",
      cssClasses: "error",
    },
    "DONE": {
      iconName: "check",
      text: "completato",
      cssClasses: "green-buttons",
    },
    "bozza": {
      iconName: "edit_note",
      text: "Bozza",
      cssClasses: "draft",
    },
    "preventivo": {
      iconName: "sell",
      text: "Preventivo inviato",
      cssClasses: "accent",
    },
    "semplice": {
      iconName: "sentiment_calm",
      text: "semplice",
      cssClasses: "bg-light-grey",
    },
    "complesso": {
      iconName: "sentiment_worried",
      text: "complesso",
      cssClasses: "bg-light-grey",
    },
  }
}

interface status {
  iconName: string;
  text: string;
  cssClasses: string;
}

