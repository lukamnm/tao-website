import type { BannerVM } from './content'

/* Hero slides used until the admin has entered Banners (placement: hero). Same content as the design. */
export const DEFAULT_SLIDES: BannerVM[] = [
  { id: 'd1', title: 'დაზღვევა, რომელიც მუშაობს', text: 'ჯანმრთელობის და სამოგზაურო დაზღვევა 2007 წლიდან.', image: '/img/hero-home-tbilisi.jpg', imageAlt: 'ქალი ლურჯ პალტოში თბილისის ქუჩაზე', pos: '83% 50%', action: 'აირჩიე დაზღვევა', href: '/#products' },
  { id: 'd2', title: 'ექიმთან - ხარჯებზე ფიქრის გარეშე', text: 'ჯანმრთელობის დაზღვევა შენთვის, შენი ოჯახისთვის და შენი გუნდისთვის.', image: '/img/hero-health-clinic.jpg', imageAlt: 'ექიმი პაციენტს ესაუბრება კლინიკაში', pos: '80% 50%', action: 'გაიგე მეტი', href: '/health' },
  { id: 'd3', title: 'იმოგზაურე მშვიდად', text: 'სამოგზაურო პოლისი ონლაინ - გამგზავრებამდე რამდენიმე წუთით ადრეც კი.', image: '/img/hero-travel-airport.jpg', imageAlt: 'მგზავრი ჩემოდნით აეროპორტში', pos: '86% 50%', action: 'გაიგე მეტი', href: '/travel' },
]
