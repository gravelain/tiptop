import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lot',
  templateUrl: './lot.component.html',
  styleUrls: ['./lot.component.css']
})
export class LotComponent {
  lots = [
    {
      id: 'infuseur',
      title: 'Infuseur à thé',
      description: 'Parfait pour infuser votre thé préféré',
      image: 'assets/images/infuseur.webp',
      isExpanded: false,
      extraDetails: 'Cet infuseur est un incontournable pour tous les amateurs de thé. Il permet une infusion parfaite tout en conservant les arômes.',
      detail1: 'Matériaux de haute qualité, résistant à la chaleur.',
      detail2: 'Facile à utiliser et à nettoyer.',
      detail3: 'Compatible avec tous types de thés.',
      detail4: 'Design ergonomique pour une utilisation facile.',
      detail5: 'Convient pour des infusions longues sans altérer le goût.'
    },
    {
      id: 'detox',
      title: 'lot Thé detox ou infusion',
      description: 'Thé detox ou infusion pour purifier votre corps',
      image: 'assets/images/detox.webp',
      isExpanded: false,
      extraDetails: 'Ce thé detox est idéal pour purifier votre corps après une longue journée ou un week-end intense.',
      detail1: 'Contient des ingrédients naturels comme le citron, le gingembre et la menthe.',
      detail2: 'Sans sucre ajouté ni conservateurs.',
      detail3: 'Aide à la digestion et à la relaxation.',
      detail4: 'Réduit les ballonnements et favorise une peau éclatante.',
      detail5: 'Parfait pour une détox après les fêtes.'
    },
    {
      id: 'signature',
      title: 'lot Thé signature',
      description: 'Thé signature aux arômes exclusifs',
      image: 'assets/images/signature.webp',
      isExpanded: false,
      extraDetails: 'Notre thé signature est composé d\'un mélange exclusif d\'arômes délicats qui en font une expérience gustative unique.',
      detail1: 'Mélange exclusif créé par des maîtres de thé de renommée internationale.',
      detail2: 'Arômes intenses et équilibrés, parfait pour les moments de détente.',
      detail3: 'Idéal pour les amateurs de thé raffiné cherchant une expérience de dégustation supérieure.',
      detail4: 'Ce thé a reçu plusieurs distinctions internationales.',
      detail5: 'Parfait pour accompagner des repas ou des moments de calme.'
    },
    {
      id: 'decouverte',
      title: 'lot Coffret découverte',
      description: 'Coffret découverte pour explorer de nouveaux goûts',
      image: 'assets/images/decouvertewebp.webp',
      isExpanded: false,
      extraDetails: 'Ce coffret contient une sélection de nos thés les plus populaires, parfait pour découvrir de nouvelles saveurs.',
      detail1: 'Inclus plusieurs variétés de thés soigneusement sélectionnés.',
      detail2: 'Emballé dans un coffret élégant, idéal pour offrir en cadeau.',
      detail3: 'Découvrez des thés noirs, verts, et des infusions fruitées.',
      detail4: 'Parfait pour les amateurs de thé et pour ceux qui veulent découvrir différentes saveurs.',
      detail5: 'Ce coffret inclut des descriptions détaillées de chaque thé.'
    },
    {
      id: 'gourmand',
      title: 'lot Thé gourmand',
      description: 'Un thé aux saveurs gourmandes pour les amateurs de douceurs.',
      image: 'assets/images/gourmand.webp',
      isExpanded: false,
      extraDetails: 'Le thé gourmand est un mélange sucré et épicé parfait pour les amateurs de thés doux et réconfortants.',
      detail1: 'Ingrédients de qualité supérieure avec des notes de caramel et de vanille.',
      detail2: 'Parfait pour accompagner un dessert ou une pause gourmande.',
      detail3: 'Sans additifs artificiels, fabriqué avec des arômes naturels.',
      detail4: 'Disponible en version bio, pour une dégustation plus responsable.',
      detail5: 'Idéal pour offrir en cadeau aux amateurs de thé doux.'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const lotId = params['id'];
      const lot = this.lots.find(l => l.id === lotId);
      if (lot) {
        lot.isExpanded = true;
      }
    });
  }

  toggleDetails(lot: any): void {
    lot.isExpanded = !lot.isExpanded;
  }
}
