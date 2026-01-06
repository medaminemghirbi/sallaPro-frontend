import { Component, OnInit } from '@angular/core';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any
  filteredCategories: any[] = [];

  searchTerm = '';
  pageSize = 9;
  p = 1;
  loading = false;

  selectedResourceTypeFilter: string | null = null;
  resourceTypeFilters: string[] = [];

  showModal = false;
  isEdit = false;

  resourceTypes = [{ name: 'Space' }, { name: 'Service' }, { name: 'Equipment' }];
  selectedResourceType: any = null;

  newCategory = {
    name: '',
    key: '',
    description: '',
    resource_type: '',
  };

  resourceTypeClass: Record<string, string> = {
    Space: 'bg-primary',
    Service: 'bg-info',
    Equipment: 'bg-warning text-dark',
  };

  resourceTypeIcon: Record<string, string> = {
    Space: 'fa-building',
    Service: 'fa-concierge-bell',
    Equipment: 'fa-cogs',
  };

  constructor(private superadminservice: SuperadminService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    this.loading = true;
    try {
      this.categories = await firstValueFrom(
        this.superadminservice.categories()
      );

      this.buildResourceTypeFilters();
      this.applyFilters();
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      this.loading = false;
    }
  }

  buildResourceTypeFilters() {
    this.resourceTypeFilters = [
      ...new Set(this.categories.map((c: any) => c.resource_type))
    ] as string[];
  }

  filterByResourceType(type: string | null) {
    this.selectedResourceTypeFilter = type;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCategories = this.categories.filter((category: any) => {
      const matchesSearch =
        !this.searchTerm ||
        category.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.key?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType =
        !this.selectedResourceTypeFilter ||
        category.resource_type === this.selectedResourceTypeFilter;

      return matchesSearch && matchesType;
    });

    this.p = 1;
  }

  openAddModal() {
    this.showModal = true;
    this.isEdit = false;
    this.newCategory = {
      name: '',
      key: '',
      description: '',
      resource_type: '',
    };
    this.selectedResourceType = null;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (typeof this.selectedResourceType === 'string') {
      this.newCategory.resource_type = this.selectedResourceType;
      this.resourceTypes.push({ name: this.selectedResourceType });
    } else {
      this.newCategory.resource_type = this.selectedResourceType?.name;
    }

    this.categories.unshift({
      ...this.newCategory,
      created_at: new Date(),
    });

    this.buildResourceTypeFilters();
    this.applyFilters();
    this.closeModal();
  }
}
