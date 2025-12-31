import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
interface Category {
  name: string;
  img: string;
  products: number;
  link: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  currentUser:any
  categories: Category[] = [
    { name: 'Ayush', img: 'assets/img/category/categorie-01.png', products: 400, link: 'product-all.html' },
    { name: 'Covid Essentials', img: 'assets/img/category/categorie-02.png', products: 924, link: 'product-all.html' },
    { name: 'Devices', img: 'assets/img/category/categorie-03.png', products: 450, link: 'product-all.html' },
    { name: 'Glucometers', img: 'assets/img/category/categorie-04.png', products: 580, link: 'product-all.html' },
    { name: 'Eye Glasses', img: 'assets/img/category/categorie-05.png', products: 620, link: 'product-all.html' },
    { name: 'Weight', img: 'assets/img/category/categorie-06.png', products: 740, link: 'product-all.html' },
    { name: "Women's Care", img: 'assets/img/category/categorie-07.png', products: 810, link: 'product-all.html' },
    { name: 'Baby Care', img: 'assets/img/category/categorie-08.png', products: 680, link: 'product-all.html' },
    { name: 'Home & Health', img: 'assets/img/category/categorie-09.png', products: 440, link: 'product-all.html' },
    { name: 'Sexual Wellness', img: 'assets/img/category/categorie-10.png', products: 270, link: 'product-all.html' },
    { name: 'Hands & Feet', img: 'assets/img/category/categorie-11.png', products: 360, link: 'product-all.html' },
    { name: 'Oral Care', img: 'assets/img/category/categorie-12.png', products: 520, link: 'product-all.html' },
  ];

  constructor(private router: Router,
        private translate: TranslateService,
        private auth: AuthService,
        private usersService: AdminService
    
  ) {}

  ngOnInit(): void {
    this.auth.getcurrentuser().subscribe({
      next: (response:any) => {
        this.currentUser = response.user; // depends on your API shape
        
      },
      error: (err:any) => {
        console.error('Error fetching current user', err);
      },
    });
  }

  selectModule(module: any) {
    this.router.navigate([module.route]);
  }
  
}


