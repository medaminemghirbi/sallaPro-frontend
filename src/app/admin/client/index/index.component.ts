import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  clients: any
  filteredClients: any[] = [];

  searchTerm = '';
  pageSize = 10;
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadclients();
  }

  async loadclients() {
    this.loading = true;
    try {
      this.clients = await firstValueFrom(
        this.adminService.clients()
      );

      this.buildResourceTypeFilters();
      this.applyFilters();
    } catch (err) {
      console.error('Failed to load clients', err);
    } finally {
      this.loading = false;
    }
  }

  buildResourceTypeFilters() {
    this.resourceTypeFilters = [
      ...new Set(this.clients.map((c: any) => c.resource_type))
    ] as string[];
  }

  filterByResourceType(type: string | null) {
    this.selectedResourceTypeFilter = type;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredClients = this.clients.filter((client: any) => {
      const matchesSearch =
        !this.searchTerm ||
        client.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.key?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType =
        !this.selectedResourceTypeFilter ||
        client.resource_type === this.selectedResourceTypeFilter;
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

    this.clients.unshift({
      ...this.newCategory,
      created_at: new Date(),
    });

    this.buildResourceTypeFilters();
    this.applyFilters();
    this.closeModal();
  }
}
