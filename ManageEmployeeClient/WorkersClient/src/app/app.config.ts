import { ApplicationConfig } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
// import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),  provideHttpClient(withFetch()),
     provideClientHydration(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
      provideAnimationsAsync(), provideAnimationsAsync()],
  

};
