import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarMinimizedSubject = new BehaviorSubject<boolean>(false);
  public sidebarMinimized$: Observable<boolean> = this.sidebarMinimizedSubject.asObservable();

  constructor() {
    // Load sidebar state from localStorage if available
    const savedState = localStorage.getItem('sidebarMinimized');
    if (savedState !== null) {
      this.sidebarMinimizedSubject.next(JSON.parse(savedState));
    }
  }

  toggleSidebar(): void {
    const currentState = this.sidebarMinimizedSubject.value;
    const newState = !currentState;
    this.sidebarMinimizedSubject.next(newState);
    localStorage.setItem('sidebarMinimized', JSON.stringify(newState));
  }

  setSidebarState(state: boolean): void {
    this.sidebarMinimizedSubject.next(state);
    localStorage.setItem('sidebarMinimized', JSON.stringify(state));
  }

  getSidebarState(): boolean {
    return this.sidebarMinimizedSubject.value;
  }
}
