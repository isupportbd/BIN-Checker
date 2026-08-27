<template>
  <DashboardLayout>
  <div class="bin-list-page d-flex flex-column h-100">
    <!-- Minimal & Smart Toolbar -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 flex-shrink-0">
      <div class="d-flex align-items-center gap-3">
        <router-link to="/dashboard" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0" style="width: 36px; height: 36px; border: 1px solid #e2e8f0;" title="Back to Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </router-link>
        <h4 class="mb-0 fw-bold" style="color: #1e293b;">BIN Database</h4>
      </div>

      <div class="d-flex flex-wrap align-items-center gap-2">
        <!-- Compact Search -->
        <div class="position-relative" style="width: 260px;">
          <svg class="position-absolute" style="left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search BIN or Name..." 
            class="form-control form-control-sm border-secondary-subtle rounded-pill ps-5"
            @input="handleSearch"
            style="height: 36px; font-size: 14px;"
          >
        </div>
        
        <!-- Compact Filter -->
        <select v-model="selectedCircle" class="form-select form-select-sm border-secondary-subtle rounded-pill" style="width: 200px; height: 36px; font-size: 14px;" @change="handleSearch">
          <option value="">All Circles</option>
          <option v-for="circle in circles" :key="circle" :value="circle">{{ circle }}</option>
        </select>

        <!-- Compact Delete Action -->
        <button v-if="selectedCircle" class="btn btn-danger btn-sm rounded-pill d-flex align-items-center gap-2 px-3 shadow-sm" style="height: 36px; font-size: 13px; font-weight: 500;" @click="confirmDeleteCircle">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
          Delete Circle
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card main-card d-flex flex-column flex-grow-1 overflow-hidden shadow-sm border-0 rounded-4">

      <div class="table-container flex-grow-1 overflow-auto position-relative">
        <table class="data-table" v-if="!isLoading && binData.length > 0">
          <thead>
            <tr>
              <th>Issue Date</th>
              <th>BIN No.</th>
              <th style="min-width: 250px;">Name</th>
              <th>Circle</th>
              <th style="min-width: 200px; max-width: 250px;">Factory Address</th>
              <th>Police Station</th>
              <th>Mobile</th>
              <th>Email</th>
              <th style="min-width: 200px; max-width: 250px;">Registered HQ Address</th>
              <th>Major Area</th>
              <th style="min-width: 150px; max-width: 200px;">Areas of Mfg</th>
              <th style="min-width: 150px; max-width: 200px;">Areas of Service</th>
              <th>Forced Reg</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in binData" :key="row.id">
              <td class="whitespace-nowrap">{{ formatDate(row.binIssueDate) }}</td>
              <td class="font-medium text-primary">{{ row.bin }}</td>
              <td class="font-medium" style="min-width: 250px;">{{ row.name }}</td>
              <td class="whitespace-nowrap">{{ row.circle }}</td>
              <td style="max-width: 250px; white-space: normal;">{{ row.factoryAddress }}</td>
              <td class="whitespace-nowrap">{{ row.policeStation || '-' }}</td>
              <td class="whitespace-nowrap">{{ row.mobileNumber || '-' }}</td>
              <td class="whitespace-nowrap">{{ row.email || '-' }}</td>
              <td style="max-width: 250px; white-space: normal;">{{ row.registeredHqAddress || '-' }}</td>
              <td class="whitespace-nowrap">{{ row.majorAreaOfEconomicActivity || '-' }}</td>
              <td style="max-width: 200px; white-space: normal;">{{ row.areasOfManufacturing || '-' }}</td>
              <td style="max-width: 200px; white-space: normal;">{{ row.areasOfService || '-' }}</td>
              <td class="whitespace-nowrap">{{ row.forcedRegistration || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Loading State -->
        <div v-if="isLoading" class="state-container">
          <div class="spinner"></div>
          <p>Loading BIN records...</p>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && binData.length === 0" class="state-container empty-state">
          <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <h3>No records found</h3>
          <p v-if="searchQuery">No results matching "{{ searchQuery }}"</p>
          <p v-else>You haven't uploaded any data yet.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination flex-shrink-0" v-if="totalPages > 0">
        <span class="pagination-info">Showing page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} total records)</span>
        <div class="pagination-controls">
          <button 
            class="btn btn-outline btn-sm" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in displayedPages" 
              :key="page"
              class="page-num"
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button 
            class="btn btn-outline btn-sm" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../components/DashboardLayout.vue'

const binData = ref<any[]>([])
const circles = ref<string[]>([])
const selectedCircle = ref('')
const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const totalItems = ref(0)
const itemsPerPage = 15

// Debounce timer for search
let searchTimer: any = null

const fetchCircles = async () => {
  try {
    const userId = localStorage.getItem('userId') || ''
    const response = await fetch('https://api.isupportbd.com/api/circles', {
      headers: { 'Authorization': `Bearer ${userId}` }
    })
    const result = await response.json()
    if (result.success) {
      circles.value = result.data
    }
  } catch (error) {
    console.error('Failed to fetch circles:', error)
  }
}

const confirmDeleteCircle = async () => {
  if (!selectedCircle.value) return;
  const isConfirmed = window.confirm(`Are you sure you want to completely delete ALL data for circle "${selectedCircle.value}"? This action cannot be undone.`);
  if (!isConfirmed) return;
  
  try {
    const userId = localStorage.getItem('userId') || ''
    const response = await fetch(`https://api.isupportbd.com/api/bins/circle?name=${encodeURIComponent(selectedCircle.value)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userId}` }
    })
    const result = await response.json()
    if (result.success) {
      alert(result.message)
      selectedCircle.value = ''
      await fetchCircles() // Refresh circles list
      await fetchBins(1) // Refresh table
    } else {
      alert('Error: ' + result.error)
    }
  } catch (error) {
    console.error('Failed to delete circle data:', error)
    alert('An error occurred while deleting data.')
  }
}

const fetchBins = async (page: number = 1, search: string = '', circle: string = '') => {
  isLoading.value = true
  try {
    const userId = localStorage.getItem('userId') || ''
    const response = await fetch(`https://api.isupportbd.com/api/bins?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}&circle=${encodeURIComponent(circle)}`, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    })
    
    const result = await response.json()
    if (result.success) {
      binData.value = result.data
      currentPage.value = result.page
      totalPages.value = result.totalPages
      totalItems.value = result.total
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchBins(1, searchQuery.value, selectedCircle.value)
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchBins(page, searchQuery.value, selectedCircle.value)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  // Format as DD/MM/YYYY
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

// Logic to show a limited number of page buttons (e.g. max 5)
const displayedPages = computed(() => {
  const maxDisplayed = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2))
  let end = start + maxDisplayed - 1

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxDisplayed + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

onMounted(() => {
  fetchCircles()
  fetchBins()
})
</script>

<style scoped>
.bin-list-page {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.custom-select {
  padding: 12px 16px;
  border: 1px solid #94a3b8; /* More prominent border */
  border-radius: 8px;
  font-size: 15px;
  color: #334155;
  outline: none;
  transition: all 0.2s ease;
  background-color: white;
  cursor: pointer;
}

.custom-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 2px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
}

.main-card {
  padding: 0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  background: white;
  min-width: 0;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.search-section {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: #fafbfc;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.table-container {
  min-height: 250px;
  overflow-x: auto; /* Enable horizontal scrolling */
  position: relative;
  min-width: 0;
  width: 100%;
}

.data-table {
  width: 100%;
  min-width: 1000px; /* Ensure table doesn't squish too much */
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background-color: #1e293b; /* Dark slate background for header */
  color: #f8fafc; /* Light text for contrast */
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 24px;
  border: 1px solid #475569; /* Add border to header cells */
  border-bottom: 2px solid #0f172a;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th:first-child {
  border-top-left-radius: 16px;
}

.data-table th:last-child {
  border-top-right-radius: 16px;
}

.data-table td {
  padding: 16px 24px;
  border: 1px solid #cbd5e1; /* Add border to all sides of every data cell */
  font-size: 14px;
  color: #334155;
  vertical-align: middle;
}

.data-table tbody tr {
  transition: background-color 0.15s ease;
  background-color: #ffffff;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f8fafc; /* Zebra striping for better readability */
}

.data-table tbody tr:hover {
  background-color: #f1f5f9; /* Slightly darker hover effect */
}

.text-primary {
  color: var(--primary-color);
}

.whitespace-nowrap {
  white-space: nowrap;
}

.font-medium {
  font-weight: 500;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
  position: absolute;
  inset: 0;
  background: white;
}

.empty-state {
  position: static;
  background: transparent;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #334155;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background-color: #fafbfc;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.page-num:hover {
  background-color: #f1f5f9;
}

.page-num.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
