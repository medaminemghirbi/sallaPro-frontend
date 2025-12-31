import { Component, OnDestroy, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import allLocales from '@fullcalendar/core/locales-all';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnDestroy {
  calendarVisible = true;
  consultations: any;
  currentUser: any;
  calendarOptions!: CalendarOptions;
  bookedSlots: string[] = [];
  isLoading = false;
  private langChangeSubscription?: Subscription;

  // Month and Year selector
  currentDate = new Date();
  months: string[] = [];
  selectedMonth: number = this.currentDate.getMonth();
  selectedYear: number = this.currentDate.getFullYear();
  availableYears: number[] = [];

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  constructor(
    private doctorService: DoctorService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.loadMonthNames();
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();

    const hiddenDays = this.currentUser.working_weekends ? [] : [0, 7];

    // Generate available years (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from(
      { length: 11 },
      (_, i) => currentYear - 5 + i
    );

    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'timeGridDay',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,listWeek',
      },
      allDaySlot: false,
      selectable: true,
      nowIndicator: true,
      editable: false,
      dayMaxEvents: true,
      height: '700px',
      slotDuration: '01:00:00',
      slotLabelInterval: '01:00:00',
      slotMinTime: '09:00:00',
      slotMaxTime: '24:00:00',
      hiddenDays: hiddenDays,
      locales: allLocales, // <-- add all locales
      locale: this.translate.currentLang || this.currentUser.language || 'fr', // dynamically set based on current language

      // Define single continuous time slot
      businessHours: [
        {
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '09:00',
          endTime: '24:00',
        },
      ],

      selectAllow: (selectInfo) => {
        const hour = selectInfo.start.getHours();
        return hour >= 9 && hour < 24;
      },

      events: [],

      eventColor: '#007bff',
      eventTextColor: '#ffffff',
      eventBorderColor: '#0056b3',
      eventDisplay: 'block',

      dateClick: (arg) => this.handleDateClick(arg),

      eventDidMount: (info) => {
        info.el.setAttribute('title', `${info.event.title}`);
        info.el.classList.add('custom-event');
      },
    };

    this.loadConsultations();

    // Subscribe to language changes and update calendar locale and month names
    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event) => {
        this.calendarOptions.locale = event.lang;
        this.loadMonthNames(); // Reload month names with new language
        // Force calendar to re-render with new locale
        this.calendarVisible = false;
        setTimeout(() => {
          this.calendarVisible = true;
        }, 0);
      }
    );
  }

  loadMonthNames(): void {
    const monthKeys = [
      'CALENDAR.MONTHS.JANUARY',
      'CALENDAR.MONTHS.FEBRUARY',
      'CALENDAR.MONTHS.MARCH',
      'CALENDAR.MONTHS.APRIL',
      'CALENDAR.MONTHS.MAY',
      'CALENDAR.MONTHS.JUNE',
      'CALENDAR.MONTHS.JULY',
      'CALENDAR.MONTHS.AUGUST',
      'CALENDAR.MONTHS.SEPTEMBER',
      'CALENDAR.MONTHS.OCTOBER',
      'CALENDAR.MONTHS.NOVEMBER',
      'CALENDAR.MONTHS.DECEMBER',
    ];

    this.translate.get(monthKeys).subscribe((translations) => {
      this.months = monthKeys.map((key) => translations[key]);
    });
  }

  loadConsultations(): void {
    this.doctorService.fetchDoctorConsultations(this.currentUser.id).subscribe(
      (consultations) => {
        this.isLoading = true;

        const events = consultations.map((c) => ({
          title: `=> Consultation with Mr ${c.patient.firstname} ${
            c.patient.lastname
          } (${c.appointment_type === 'online' ? 'Online' : 'onsite'})`,
          start: c.appointment,
          end: this.addMinutesToDate(new Date(c.appointment), 60), // 1-hour
          id: c.id,
          extendedProps: { patient: c.patient },
        }));

        this.bookedSlots = consultations.map(
          (c) =>
            this.formatDate(new Date(c.appointment)) +
            ' ' +
            new Date(c.appointment).toLocaleTimeString()
        );

        this.calendarOptions.events = events;
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.error('Error fetching consultations:', err);
        this.toastr.error("We couldn't load consultations.");
      }
    );
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  addMinutesToDate(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  handleDateClick(arg: DateClickArg) {
    const consultation_date = this.formatDate(new Date(arg.dateStr));
    this.router.navigate(['/doctor/add-new-consultation', consultation_date]);
  }

  onMonthChange(event: any): void {
    this.selectedMonth = parseInt(event.target.value);
    this.navigateToDate();
  }

  onYearChange(event: any): void {
    this.selectedYear = parseInt(event.target.value);
    this.navigateToDate();
  }

  navigateToDate(): void {
    const selectedDate = new Date(this.selectedYear, this.selectedMonth, 1);
    if (this.calendarComponent) {
      this.calendarComponent.getApi().gotoDate(selectedDate);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from language changes to prevent memory leaks
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
