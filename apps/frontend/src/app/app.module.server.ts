import { NgModule, ApplicationRef } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ]
})
export class AppServerModule {
  constructor(private appRef: ApplicationRef) {}

  ngDoBootstrap() {
    this.appRef.bootstrap(AppComponent);
  }
}
