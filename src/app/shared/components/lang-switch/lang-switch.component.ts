import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
      selector: 'app-lang-switch',
      templateUrl: './lang-switch.component.html',
      styleUrls: ['./lang-switch.component.css']
})
export class LangSwitchComponent implements OnInit {
      langs = ['en', 'id'];

      constructor(private translate: TranslateService) { }

      get currentLang() {
            const defaultLang = this.translate.getDefaultLang();
            return localStorage.getItem('beef-lang') || defaultLang;
      }
      
      set currentLang(lang: string) {
            localStorage.setItem('beef-lang', lang);
      }

      ngOnInit(): void {
            const currentLang = this.currentLang;
            this.switchLanguage(currentLang);
      }

      switchLanguage(lang: string) {
            this.translate.use(lang);
            this.currentLang = lang;
      }
}
