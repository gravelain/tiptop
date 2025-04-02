import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthInterceptor } from './auth.interceptor';
import { FooterComponent } from './pages/components/footer/footer.component';
import { HeaderComponent } from './pages/components/header/header.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfilComponent } from './pages/utilisateur/profil/profil.component';
import { UserProfileHeaderComponent } from './pages/utilisateur/user-profile-header/user-profile-header.component';
import { UserHistoryComponent } from './pages/utilisateur/user-history/user-history.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { LayoutadminComponent } from './pages/admin/layoutadmin/layoutadmin.component';
import { SidebarComponent } from './pages/admin/components/sidebar/sidebar.component';
import { TicketsComponent } from './pages/admin/tickets/tickets.component';
import { LotsComponent } from './pages/admin/lots/lots.component';
import { UserComponent } from './pages/admin/user/user.component';
import { CgvComponent } from './pages/cgv/cgv.component';
import { MentionlegaleComponent } from './pages/mentionlegale/mentionlegale.component';
import { AideComponent } from './pages/aide/aide.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TombolatComponent } from './pages/admin/tombolat/tombolat.component';
import { ProfiladminComponent } from './pages/admin/profiladmin/profiladmin.component';
import { CookieBannerComponent } from './pages/cookie-banner/cookie-banner.component';
import { LotComponent } from './pages/lot/lot.component';
import { JeuxComponent } from './pages/jeux/jeux.component';
import { NewsletterComponent } from './pages/admin/newsletter/newsletter.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    ContactComponent,
    ProfilComponent,
    UserProfileHeaderComponent,
    UserHistoryComponent,
    DashboardComponent,
    LayoutadminComponent,
    SidebarComponent,
    TicketsComponent,
    LotsComponent,
    UserComponent,
    CgvComponent,
    MentionlegaleComponent,
    AideComponent,
    PageNotFoundComponent,
    TombolatComponent,
    ProfiladminComponent,
    CookieBannerComponent,
    LotComponent,
    JeuxComponent,
    NewsletterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  // Pas besoin de bootstrap car vous utilisez bootstrapApplication dans main.ts
})
export class AppModule { }
