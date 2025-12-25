import { Component, OnInit } from '@angular/core';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any;
  searchTerm: string = '';
  pageSize: number = 10;
  p: number = 1;
  loading: boolean = false; // ✅ track loading
  resourceTypeClass: Record<string, string> = {
    Space: 'bg-primary',
    Service: 'bg-info',
    Equipment: 'bg-warning text-dark',
  };
  showModal = false;
  isEdit = false;

  resourceTypes = [{ name: 'Type 1' }, { name: 'Type 2' }, { name: 'Type 3' }];

  selectedResourceType: any = null;

  newCategory = {
    name: '',
    key: '',
    description: '',
    resource_type: '',
  };
  // Mapping des icônes
  resourceTypeIcon: Record<string, string> = {
    Space: 'fa-building',
    Service: 'fa-concierge-bell',
    Equipment: 'fa-cogs',
  };
  constructor(private superadminservice: SuperadminService) {}

  ngOnInit(): void {
    this.loadCompanyTypes();
  }

  async loadCompanyTypes() {
    this.loading = true; // start loading
    try {
      this.categories = await firstValueFrom(
        this.superadminservice.categories()
      );
    } catch (err) {
      console.error('Failed to load company types', err);
    } finally {
      this.loading = false; // stop loading
    }
  }

  // Filtered data for search
  get filteredCategories() {
    if (!this.categories) return [];
    return this.categories.filter((c: any) => {
      return (
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.key.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
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
    // If user typed a new resource type
    if (typeof this.selectedResourceType === 'string') {
      this.newCategory.resource_type = this.selectedResourceType;
      this.resourceTypes.push({ name: this.selectedResourceType });
    } else {
      this.newCategory.resource_type = this.selectedResourceType?.name;
    }

    // Save new category
    this.filteredCategories.push({
      ...this.newCategory,
      created_at: new Date(),
    });

    this.closeModal();
  }
}
