import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

interface Review {
  name: string;
  occupation: string;
  stars: number;
  followers: number;
  posts: number;
  reviewText: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isMobile: boolean = false;

  // Tableau d'avis des clients
  reviews: Review[] = [
    {
      name: 'Serge Dupont',
      occupation: 'Freelance Web Designer',
      stars: 2,
      followers: 10,
      posts: 15,
      reviewText: "J'ai vraiment eu ma part. Le jeu est vraiment fiable et ils donnent les gains."
    },
    {
      name: 'Julie Martin',
      occupation: 'Photographe',
      stars: 3,
      followers: 20,
      posts: 30,
      reviewText: "J'ai eu ma part mais le service est un peu lent."
    },
    {
      name: 'Luc Delacroix',
      occupation: 'Consultant',
      stars: 1,
      followers: 5,
      posts: 10,
      reviewText: "Tout est parfait, service rapide, jeux impeccables."
    },
    {
      name: 'Sophie Lefebvre',
      occupation: 'Développeuse web',
      stars: 4,
      followers: 25,
      posts: 40,
      reviewText: "Jeu fantastique, service rapide."
    },
    {
      name: "Jean Dupont",
      occupation: "Directeur marketing",
      stars: 5,
      followers: 100,
      posts: 50,
      reviewText: "Le concours était incroyable ! Les lots sont fantastiques et l'organisation au top !"
    },
    {
      name: "Marie Lemoine",
      occupation: "Consultante",
      stars: 4,
      followers: 80,
      posts: 60,
      reviewText: "Excellente expérience. Simple et amusant. J'ai gagné !"
    },
    {
      name: "Pierre Martin",
      occupation: "Chef de produit",
      stars: 4,
      followers: 45,
      posts: 33,
      reviewText: "Très bon concours avec une interface facile à utiliser. Je recommande !"
    },
    {
      name: "Sophie Leroy",
      occupation: "Cadre supérieur",
      stars: 5,
      followers: 120,
      posts: 70,
      reviewText: "Une expérience unique ! Les lots sont variés et il est facile de participer."
    },
    {
      name: "Marc Lefevre",
      occupation: "Entrepreneur",
      stars: 3,
      followers: 55,
      posts: 40,
      reviewText: "J'ai adoré la simplicité du jeu. En plus, j'ai remporté un super lot !"
    },
    {
      name: "Claire Dupuis",
      occupation: "Designer",
      stars: 5,
      followers: 90,
      posts: 85,
      reviewText: "Une façon amusante de gagner des prix. La qualité des lots est impressionnante !"
    }
  ];

  visibleReviews: Review[] = [];
  currentPage: number = 1;
  reviewsPerPage: number = 3;
  pages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.checkScreenSize();
      this.pages = Array.from({ length: Math.ceil(this.reviews.length / this.reviewsPerPage) }, (_, i) => i + 1);
      this.setCurrentPage(1);
    }
  }

  ngAfterViewInit(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  // Fonction pour la gestion du carrousel
  scrollCarousel(direction: string) {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth; // Amount to scroll

    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // Fonction de pagination
  setCurrentPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.reviewsPerPage;
    this.visibleReviews = this.reviews.slice(startIndex, startIndex + this.reviewsPerPage);
  }

  // Vérifie si le code s'exécute dans un navigateur
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
