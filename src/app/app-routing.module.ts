import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './com/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthguardService } from './services/authguard.service';
import { LandingComponent } from './com/landing/landing.component';
import { ArticleComponent } from './com/article/article.component';
import { ArticleFeedComponent } from './com/article-feed/article-feed.component';
import { UserProfileComponent } from './com/user-profile/user-profile.component';
import { SettingComponent } from './com/setting/setting.component';


const appRoutes: Routes = [

  {
    path: 'main', component: MainComponent,
    children: [
      { path: 'landing', component: LandingComponent, data: { state: 'landing' } },
      { path: 'article', component: ArticleComponent, data: { state: 'article' } },
      { path: 'article-feed', component: ArticleFeedComponent, data: { state: 'article-feed' } },
      { path: 'login', component: LoginComponent, data: { state: 'login' } },
      { path: 'profile', component: UserProfileComponent,canActivate: [AuthguardService], data: { state: 'profile' } },
      { path: 'setting', component: SettingComponent,canActivate: [AuthguardService], data: { state: 'setting' } }
    ]
  },
  //{ path: '', redirectTo: 'main/landing'},

  // otherwise redirect to home
  { path: '**', redirectTo: 'main/landing' }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }