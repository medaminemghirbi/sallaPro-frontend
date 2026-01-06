import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  clients: any;
  filteredClients: any[] = [];
  selectedIds: Set<any> = new Set();
  editMode = false;

  searchTerm = '';
  pageSize = 10;
  p = 1;
  loading = false;

  selectedResourceTypeFilter: string | null = null;
  resourceTypeFilters: string[] = [];

  showModal = false;
  isEdit = false;
  
  // Edit client modal
  showEditModal = false;
  selectedClient: any = null;
  editForm = {
    address: '',
    phone_number: '',
    country_code: '+216'
  };
  
  // Country codes with flags
  countryCodes = [
    { code: '+212', name: 'Morocco', flag: '🇲🇦' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  ];
  
  // Delete confirmation modal
  showDeleteModal = false;
  clientToDelete: any = null;

  resourceTypes = [
    { name: 'Space' },
    { name: 'Service' },
    { name: 'Equipment' },
  ];
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

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadclients();
  }

  async loadclients() {
    this.loading = true;
    try {
      this.clients = await firstValueFrom(this.adminService.clients());

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
      ...new Set(this.clients.map((c: any) => c.resource_type)),
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
        client.full_name
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        client.firstname
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        client.lastname
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone_number
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        client.unique_code
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        client.address?.toLowerCase().includes(this.searchTerm.toLowerCase());

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

  getClientId(client: any) {
    return client?.id;
  }

  isSelected(client: any) {
    const id = this.getClientId(client);
    return id != null && this.selectedIds.has(id);
  }

  toggleSelect(client: any) {
    const id = this.getClientId(client);
    if (id == null) return;
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
  }

  toggleSelectAll(event: any) {
    const checked = event?.target?.checked;
    // select/unselect only current page visible items
    const start = (this.p - 1) * (this.pageSize || 10);
    const end = start + (this.pageSize || 10);
    const visible = (this.filteredClients || []).slice(start, end);
    visible.forEach((c: any) => {
      const id = this.getClientId(c);
      if (id == null) return;
      if (checked) this.selectedIds.add(id);
      else this.selectedIds.delete(id);
    });
  }

  areAllVisibleSelected() {
    if (!this.filteredClients || this.filteredClients.length === 0)
      return false;
    const start = (this.p - 1) * (this.pageSize || 10);
    const end = start + (this.pageSize || 10);
    const visible = (this.filteredClients || []).slice(start, end);
    return (
      visible.length > 0 &&
      visible.every((c: any) => {
        const id = this.getClientId(c);
        return id != null && this.selectedIds.has(id);
      })
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // clear selection when exiting edit mode
      this.selectedIds.clear();
    }
  }

  exportClients(
    format: 'csv' | 'pdf' | 'json' | 'world' = 'csv',
    selectedOnly = false
  ) {
    const source = Array.isArray(this.clients)
      ? this.clients
      : this.clients?.data || [];

    const clientIds = selectedOnly
      ? source
          .filter((c: any) => {
            const id = this.getClientId(c);
            return id != null && this.selectedIds.has(id);
          })
          .map((c: any) => this.getClientId(c))
      : [];

    if (selectedOnly && clientIds.length === 0) {
      this.toastr.warning('No clients selected for export');
      return;
    }

    // Prepare filters to send to backend
    const filters: any = {};
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }
    if (this.selectedResourceTypeFilter) {
      filters.resourceType = this.selectedResourceTypeFilter;
    }

    // Call backend API for export
    this.loading = true;
    this.adminService.exportClients(format, clientIds, filters).subscribe({
      next: (response) => {
        this.loading = false;

        // Extract filename from Content-Disposition header if available
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `clients.${format}`;
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
            contentDisposition
          );
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        // Download the file
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          this.toastr.success(
            `Clients exported successfully as ${format.toUpperCase()}`
          );
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Export failed:', err);
        this.toastr.error('Failed to export clients. Please try again.');
      },
    });
  }

  // Open edit modal
  openEditModal(client: any) {
    this.selectedClient = client;
    
    // Auto-detect country code from country name
    const detectedCode = this.getCountryCodeFromName(client.country);
    
    this.editForm = {
      address: client.address || '',
      phone_number: client.phone_number || '',
      country_code: client.country_code || detectedCode || '+216'
    };
    this.showEditModal = true;
  }

  // Get country code based on country name
  getCountryCodeFromName(countryName: string | null | undefined): string | null {
    if (!countryName) return null;
    
    const normalizedName = countryName.toLowerCase().trim();
    
    // Find matching country from our list
    const country = this.countryCodes.find(c => 
      c.name.toLowerCase().includes(normalizedName) || 
      normalizedName.includes(c.name.toLowerCase())
    );
    
    return country ? country.code : null;
  }

  // Close edit modal
  closeEditModal() {
    this.showEditModal = false;
    this.selectedClient = null;
    this.editForm = {
      address: '',
      phone_number: '',
      country_code: '+216'
    };
  }

  // Save edited client
  async saveClient() {
    if (!this.selectedClient?.id) {
      this.toastr.error('Client ID is missing');
      return;
    }

    this.loading = true;
    try {
      await firstValueFrom(
        this.adminService.updateClient(this.selectedClient.id, this.editForm)
      );
      
      // Update local data
      const index = this.clients.findIndex((c: any) => c.id === this.selectedClient.id);
      if (index !== -1) {
        this.clients[index] = {
          ...this.clients[index],
          ...this.editForm
        };
      }
      
      this.applyFilters();
      this.toastr.success('Client updated successfully');
      this.closeEditModal();
    } catch (err) {
      console.error('Failed to update client', err);
      this.toastr.error('Failed to update client');
    } finally {
      this.loading = false;
    }
  }

  // Delete client
  openDeleteModal(client: any) {
    if (!client?.id) {
      this.toastr.error('Client ID is missing');
      return;
    }
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  async confirmDelete() {
    if (!this.clientToDelete?.id) {
      this.toastr.error('Client ID is missing');
      return;
    }

    this.loading = true;
    try {
      await firstValueFrom(this.adminService.deleteClient(this.clientToDelete.id));
      
      // Remove from local data
      this.clients = this.clients.filter((c: any) => c.id !== this.clientToDelete.id);
      this.applyFilters();
      this.toastr.success('Client deleted successfully');
      this.closeDeleteModal();
    } catch (err) {
      console.error('Failed to delete client', err);
      this.toastr.error('Failed to delete client');
    } finally {
      this.loading = false;
    }
  }
}
