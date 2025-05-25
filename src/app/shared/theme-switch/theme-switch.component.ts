import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss']
})
export class ThemeSwitchComponent implements OnInit {
  isDarkMode = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('dark-theme');
    if (savedTheme === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
  }

  toggleDarkTheme(event: Event) {
    this.isDarkMode = (event.target as HTMLInputElement).checked;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('dark-theme', 'true');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('dark-theme', 'false');
    }
  }
}
