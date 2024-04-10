import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  const bootstrap = () => bootstrapApplication(AppComponent, config);

  export default bootstrap;

  
