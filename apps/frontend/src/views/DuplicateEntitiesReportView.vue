<template>
  <DashboardLayout>
    <!-- Main Report Container -->
    <div class="d-flex justify-content-center flex-grow-1 overflow-hidden pb-4 mt-2">
      <div class="col-12 col-xl-11 d-flex flex-column h-100">
        <div class="shadow bg-white rounded-4 border d-flex flex-column h-100 overflow-hidden" style="border-color: #cbd5e1 !important;">
          
          <!-- Header section -->
          <div class="p-3 border-bottom d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 flex-shrink-0 d-print-none">
            <div class="d-flex align-items-center gap-3">
              <button @click="goBack" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0 flex-shrink-0" style="width: 40px; height: 40px; border: 1px solid #e2e8f0;" title="Go Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div>
                <h4 class="mb-1 fw-bold" style="color: #1e293b; letter-spacing: -0.5px; white-space: nowrap;">Duplicate Entities</h4>
                <p class="mb-0 text-muted" style="font-size: 13px; white-space: nowrap;">Identify businesses with similar name, address or mobile.</p>
              </div>
            </div>
            
            <!-- Download Buttons and Totals -->
            <div class="d-flex flex-wrap align-items-center gap-3 mt-3 mt-xl-0 d-print-none">
              
              <!-- Total Clusters Count -->
              <div v-if="duplicateGroups.length > 0" class="d-flex align-items-center justify-content-center gap-2 bg-danger bg-opacity-10 text-danger px-4 rounded-pill border border-danger border-opacity-25 fw-bold" style="height: 36px; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Duplicate Groups: {{ duplicateGroups.length }}
              </div>
              
              <button @click="downloadExcel" class="btn btn-success rounded-pill px-4 fw-medium d-flex align-items-center justify-content-center gap-2" style="height: 36px; font-size: 14px;" :disabled="isLoading || duplicateGroups.length === 0 || isDownloading">
                <svg v-if="!isDownloading" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Export Excel
              </button>
            </div>
          </div>

          <!-- Filter Section -->
          <div class="p-3 border-bottom d-print-none flex-shrink-0" style="background-color: #f8fafc;">
            <div class="card border-0 shadow-sm rounded-4" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe !important;">
              <div class="card-body p-4">
                <div class="row g-3 justify-content-center align-items-end">
                  <!-- Circle Filter -->
                  <div class="col-12 col-md-4">
                    <select v-model="selectedCircle" class="form-select shadow-sm border-0 rounded-3">
                      <option value="" disabled selected>Select a Circle</option>
                      <option v-for="circle in circles" :key="circle" :value="circle">{{ circle }}</option>
                    </select>
                  </div>

                  <!-- Police Station Filter -->
                  <div class="col-12 col-md-4">
                    <select v-model="selectedPoliceStation" class="form-select shadow-sm border-0 rounded-3">
                      <option value="" disabled selected>Select a Police Station</option>
                      <option v-for="station in policeStations" :key="station" :value="station">{{ station }}</option>
                    </select>
                  </div>
                  
                  <!-- Analyze Button -->
                  <div class="col-12 col-md-4">
                    <button @click="fetchDuplicates" class="btn btn-primary shadow-sm rounded-3 px-4 fw-bold w-100" :disabled="isLoading || !selectedCircle || !selectedPoliceStation" style="height: 38px;">
                      <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ isLoading ? 'Analyzing...' : 'Find Duplicates' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Display Area -->
          <div class="data-area flex-grow-1 overflow-auto position-relative bg-white">
            
            <!-- Initial Empty State -->
            <div v-if="!hasSearched" class="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
              <div class="mb-4 text-primary opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
              </div>
              <h4 class="text-dark fw-bold">Duplicate Analysis</h4>
              <p class="text-muted" style="max-width: 450px;">
                Please select both a Circle and a Police Station, then click "Find Duplicates" to scan the database. The system will look for entities with matching or highly similar names, addresses, and mobile numbers.
              </p>
            </div>

            <!-- Loading State -->
            <div v-else-if="isLoading" class="h-100 d-flex flex-column align-items-center justify-content-center">
              <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted fw-medium">Running duplicate detection algorithm. This might take a few seconds...</p>
            </div>

            <!-- No Data Found State -->
            <div v-else-if="duplicateGroups.length === 0" class="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
              <div class="mb-4 text-success opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h4 class="text-dark fw-bold">No Duplicates Found</h4>
              <p class="text-muted" style="max-width: 400px;">
                Great news! The database looks clean based on the selected criteria.
              </p>
            </div>

            <!-- List View -->
            <div v-else class="pb-4 p-3">
              <div v-for="(group, groupIndex) in duplicateGroups" :key="groupIndex" class="card shadow-sm rounded-4 border-0 mb-4 overflow-hidden">
                <div class="card-header bg-danger bg-opacity-10 border-0 py-3">
                  <h6 class="mb-0 text-danger fw-bold d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Duplicate Group #{{ groupIndex + 1 }} ({{ group.length }} matches)
                  </h6>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0" style="font-size: 13px;">
                    <thead class="table-light text-dark fw-bold" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                      <tr>
                        <th class="ps-4 py-2 border-0">BIN</th>
                        <th class="py-2 border-0">Institution Name</th>
                        <th class="py-2 border-0">Mobile Number</th>
                        <th class="py-2 border-0">Factory Address</th>
                        <th class="py-2 border-0">Circle</th>
                        <th class="py-2 border-0 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in group" :key="item.id" class="border-bottom">
                        <td class="ps-4 fw-bold text-primary py-3">{{ item.bin }}</td>
                        <td class="py-3 fw-medium text-dark">{{ item.name || 'N/A' }}</td>
                        <td class="py-3">{{ item.mobileNumber || 'N/A' }}</td>
                        <td class="py-3" style="max-width: 300px;">
                          <div class="text-truncate" :title="item.factoryAddress">{{ item.factoryAddress || 'N/A' }}</div>
                        </td>
                        <td class="py-3 text-muted">{{ item.circle || 'N/A' }}</td>
                        <td class="py-3 text-center">
                          <button @click="viewEntityDetails(item.bin)" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'
import * as XLSX from 'xlsx'

const router = useRouter()
const duplicateGroups = ref<any[][]>([])
const circles = ref<string[]>([])
const selectedCircle = ref('')
const policeStations = ref<string[]>([])
const selectedPoliceStation = ref('')
const isLoading = ref(false)
const isDownloading = ref(false)
const hasSearched = ref(false)

const userEmail = ref('')
const userRole = ref('')
const userCircle = ref('')

const goBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/reports')
  }
}

const viewEntityDetails = (bin: string) => {
  router.push({ path: '/reports/entity-details', query: { bin } })
}

const fetchCircles = async () => {
  try {
    const userId = localStorage.getItem('userId') || ''
    const response = await fetch('https://api.isupportbd.com/api/circles', { headers: { 'Authorization': `Bearer ${userId}` } })
    const result = await response.json()
    if (result.success) circles.value = result.data
  } catch (error) { console.error('Failed to fetch circles:', error) }
}

const fetchPoliceStations = async () => {
  try {
    const userId = localStorage.getItem('userId') || ''
    const response = await fetch('https://api.isupportbd.com/api/police-stations', { headers: { 'Authorization': `Bearer ${userId}` } })
    const result = await response.json()
    if (result.success) policeStations.value = result.data
  } catch (error) { console.error('Failed to fetch police stations:', error) }
}

const fetchDuplicates = async () => {
  hasSearched.value = true
  isLoading.value = true
  
  try {
    const userId = localStorage.getItem('userId') || ''
    let url = 'https://api.isupportbd.com/api/reports/duplicates'
    if (selectedCircle.value) {
      url += `?circle=${encodeURIComponent(selectedCircle.value)}`
    }
    if (selectedPoliceStation.value) {
      url += `&policeStation=${encodeURIComponent(selectedPoliceStation.value)}`
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      duplicateGroups.value = result.data
    } else {
      console.error('Failed to fetch data:', result.error)
      duplicateGroups.value = []
    }
  } catch (error) {
    console.error('Error fetching duplicates:', error)
    duplicateGroups.value = []
  } finally {
    isLoading.value = false
  }
}

const downloadExcel = () => {
  isDownloading.value = true
  
  try {
    const exportData: any[] = []
    
    duplicateGroups.value.forEach((group, index) => {
      group.forEach(item => {
        exportData.push({
          'Group ID': `Group ${index + 1}`,
          'BIN': item.bin,
          'Name': item.name,
          'Mobile': item.mobileNumber,
          'Factory Address': item.factoryAddress,
          'Circle': item.circle,
          'Police Station': item.policeStation
        })
      })
      // Add empty row between groups
      exportData.push({})
    })
    
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Duplicates')
    
    const wscols = [
      { wch: 10 }, // Group ID
      { wch: 20 }, // BIN
      { wch: 40 }, // Name
      { wch: 15 }, // Mobile
      { wch: 60 }, // Address
      { wch: 20 }, // Circle
      { wch: 20 }, // Police Station
    ]
    worksheet['!cols'] = wscols
    
    XLSX.writeFile(workbook, 'duplicate_bin_report.xlsx')
  } catch (error) {
    console.error('Error generating Excel:', error)
  } finally {
    isDownloading.value = false
  }
}

onMounted(async () => {
  userEmail.value = localStorage.getItem('userEmail') || 'User'
  userRole.value = localStorage.getItem('userRole') || 'User'
  userCircle.value = localStorage.getItem('userCircle') || ''
  
  await fetchCircles()
  await fetchPoliceStations()
  
  if (userCircle.value) {
    selectedCircle.value = userCircle.value
  }
})
</script>

<style scoped>
.data-area::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.data-area::-webkit-scrollbar-track {
  background: #f8fafc; 
}
.data-area::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
.data-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>
