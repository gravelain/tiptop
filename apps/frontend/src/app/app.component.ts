import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { NgIf } from '@angular/common'; // Si tu utilises NgIf dans le template

@Component({
  selector: 'app-root',
  standalone: true,  // Composant autonome
  imports: [RouterModule, NgIf],  // Import des modules nécessaires comme RouterModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'thetiptop-web';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        // Récupération de la route active
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data;
      })
    ).subscribe(data => {
      // Mise à jour du titre de la page
      this.titleService.setTitle(data?.['title'] || 'ThetiptopWeb');
      
      // Mise à jour de la méta description
      this.metaService.updateTag({
        name: 'description',
        content: data?.['description'] || 'Participez au jeu-concours Thé Tip Top et tentez de remporter des cadeaux uniques.'
      });
    });
  }
}
