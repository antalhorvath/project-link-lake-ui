import {AppModule} from "./app/core/app.module";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
