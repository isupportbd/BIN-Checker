<template>
  <DashboardLayout>
  <div class="report-page d-flex flex-column h-100">
    <!-- Print-Only Header (Hidden on Web) -->
    <div class="d-none d-print-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
      <div>
        <h3 class="mb-1 fw-bold" style="color: #1e293b;">Entity List Report</h3>
        <p class="mb-0 text-muted">Tabular list of registered entities.</p>
      </div>
      <div class="text-end">
        <h6 class="mb-1 fw-bold">{{ userEmail }}</h6>
        <p class="mb-0 text-muted small">{{ userRole === 'Admin' ? 'Admin' : 'Circle: ' + userCircle }}</p>
        <p class="mb-0 text-muted small" style="font-size: 11px;">Generated on: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Main Report Container -->
    <div class="d-flex justify-content-center flex-grow-1 overflow-hidden pb-4">
      <div class="col-12 col-xl-11 d-flex flex-column h-100">
        <div class="shadow bg-white rounded-4 border d-flex flex-column h-100 overflow-hidden" style="border-color: #cbd5e1 !important;">
          
          <!-- Header section -->
          <div class="p-3 border-bottom d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 flex-shrink-0 d-print-none">
            <div class="d-flex align-items-center gap-3">
              <button @click="goBack" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0 flex-shrink-0" style="width: 40px; height: 40px; border: 1px solid #e2e8f0;" title="Go Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div>
                <h4 class="mb-1 fw-bold" style="color: #1e293b; letter-spacing: -0.5px; white-space: nowrap;">Entity by Economic Activities</h4>
                <p class="mb-0 text-muted" style="font-size: 13px; white-space: nowrap;">View detailed list of entities.</p>
              </div>
            </div>
            
            <!-- Download Buttons (Moved to top) -->
            <div class="d-flex gap-2 mt-2 mt-xl-0">
              <button @click="downloadExcel('en')" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-medium d-flex align-items-center gap-1" :disabled="!hasSearched || reportData.length === 0 || isDownloading !== null">
                <svg v-if="isDownloading !== 'en'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                English
              </button>
              <button @click="downloadExcel('bn')" class="btn btn-primary btn-sm rounded-pill px-3 fw-medium d-flex align-items-center gap-1" :disabled="!hasSearched || reportData.length === 0 || isDownloading !== null">
                <svg v-if="isDownloading !== 'bn'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                বাংলা
              </button>
            </div>
          </div>

          <!-- New Filter Card Section -->
          <div class="p-3 bg-light border-bottom d-print-none flex-shrink-0">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-body p-3">
                <div class="row g-3">
                  <!-- Search -->
                  <div class="col-12 col-md-6 col-lg-4">
                    <div class="position-relative">
                      <input type="text" v-model="searchQuery" class="form-control form-control-sm pe-5" placeholder="Search BIN or Name..." @input="handleSearchInput">
                      <div class="position-absolute top-50 end-0 translate-middle-y me-2 text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </div>
                    </div>
                  </div>
                  <!-- Circle Filter -->
                  <div class="col-12 col-md-6 col-lg-4">
                    <select v-model="selectedCircle" class="form-select form-select-sm" @change="handleFilterChange">
                      <option value="">All Circles</option>
                      <option v-for="circle in circles" :key="circle" :value="circle">{{ circle }}</option>
                    </select>
                  </div>
                  <!-- Police Station Filter -->
                  <div class="col-12 col-md-6 col-lg-4">
                    <select v-model="selectedPoliceStation" class="form-select form-select-sm" @change="handleFilterChange">
                      <option value="">All Police Stations</option>
                      <option v-for="station in policeStations" :key="station" :value="station">{{ station }}</option>
                    </select>
                  </div>
                  <!-- Forced Registration Filter -->
                  <div class="col-12 col-md-6 col-lg-4">
                    <select v-model="selectedForcedReg" class="form-select form-select-sm" @change="handleFilterChange">
                      <option value="">Forced Reg: All</option>
                      <option value="Yes">Forced Reg: Yes</option>
                      <option value="No">Forced Reg: No</option>
                    </select>
                  </div>
                  <!-- Major Area -->
                  <div class="col-12 col-md-6 col-lg-4">
                    <select v-model="selectedMajorArea" class="form-select form-select-sm text-truncate" @change="handleFilterChange" title="Major Area of Economic Activity">
                      <option value="">All Major Areas</option>
                      <option v-for="area in majorAreas" :key="area" :value="area">{{ area }}</option>
                    </select>
                  </div>
                  <!-- Manufacturing Area (Dependent) -->
                  <div v-if="selectedMajorArea.includes('Manufacturing')" class="col-12 col-md-6 col-lg-4">
                    <select v-model="selectedManufacturingArea" class="form-select form-select-sm text-truncate" @change="handleFilterChange">
                      <option value="">All Manufacturing Areas</option>
                      <option v-for="area in manufacturingAreas" :key="area" :value="area">{{ area }}</option>
                    </select>
                  </div>
                  <!-- Service Area (Dependent) -->
                  <div v-if="selectedMajorArea.includes('Service')" class="col-12 col-md-6 col-lg-4">
                    <select v-model="selectedServiceArea" class="form-select form-select-sm text-truncate" @change="handleFilterChange">
                      <option value="">All Service Areas</option>
                      <option v-for="area in serviceAreas" :key="area" :value="area">{{ area }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Display Area (Inside the card) -->
          <div class="data-area flex-grow-1 overflow-auto position-relative bg-white">
            
            <!-- Initial Empty State -->
      <div v-if="!hasSearched" class="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
        <div class="mb-4 text-muted opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h4 class="text-muted fw-bold">Select Filters</h4>
        <p class="text-muted" style="max-width: 400px;">Please apply at least one filter (Circle, Economic Area, or Search) to view the entity list.</p>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Fetching report data...</p>
      </div>

      <!-- No Data Found State -->
      <div v-else-if="reportData.length === 0" class="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
        <div class="mb-4 text-danger opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-dark fw-bold">No Records Found</h4>
        <p class="text-muted" style="max-width: 400px;">
          No data found for the selected filters. Please try different criteria.
        </p>
      </div>

      <!-- List View -->
      <div v-else class="pb-4">
        <div class="table-responsive bg-white shadow-sm rounded-4 border-0">
          <table class="table table-hover align-middle mb-0" style="font-size: 14px;">
            <thead class="table-light text-muted" style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
              <tr>
                <th class="ps-4 py-3 border-0 rounded-top-start-4">Serial</th>
                <th class="py-3 border-0">Institution Name</th>
                <th class="py-3 border-0">Address</th>
                <th class="py-3 border-0">Mobile</th>
                <th class="pe-4 py-3 border-0 rounded-top-end-4 text-end">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entity, index) in reportData" :key="entity.id">
                <td class="ps-4 py-3 text-muted">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-3 fw-bold text-dark">{{ entity.name || '-' }}</td>
                <td class="py-3 text-truncate" style="max-width: 200px;" :title="entity.factoryAddress">{{ entity.factoryAddress || '-' }}</td>
                <td class="py-3">{{ entity.mobileNumber || '-' }}</td>
                <td class="pe-4 py-3 text-end text-primary text-truncate" style="max-width: 200px;" :title="entity.email">{{ entity.email || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-wrapper mt-auto p-3 border-top d-print-none bg-white">
        <div class="d-flex align-items-center justify-content-between bg-white rounded-pill px-4 py-2 shadow-sm">
          <span class="text-muted" style="font-size: 14px;">Showing page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} total entities)</span>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-light btn-sm rounded-pill px-3" 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              Previous
            </button>
            <button 
              class="btn btn-primary btn-sm rounded-pill px-4" 
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
</div>
</div>
</div>
</div>
</div>

<!-- Full Screen Download Overlay -->
<div v-if="isDownloading !== null" class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 9999;">
  <div class="bg-white p-4 rounded-4 shadow-lg text-center border" style="width: 320px; border-color: #e2e8f0 !important;">
    <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <h5 class="fw-bold text-dark mb-1">Generating Report</h5>
    <p class="text-muted small mb-3">Please wait while we process the data...</p>
    
    <div class="progress mb-2" style="height: 8px;">
      <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" :style="{ width: downloadProgress + '%' }" :aria-valuenow="downloadProgress" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="fw-bold text-primary">{{ downloadProgress }}%</div>
  </div>
</div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'
import * as XLSX from 'xlsx'
import { transliterateToBengali, translateNumbersToBengali } from '../utils/transliterate'

const route = useRoute()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/reports')
  }
}

const reportData = ref<any[]>([])
const circles = ref<string[]>([])
const policeStations = ref<string[]>([])
const majorAreas = ref<string[]>([])
const manufacturingAreas = ref<string[]>([])
const serviceAreas = ref<string[]>([])

const searchQuery = ref('')
const selectedCircle = ref('')
const selectedPoliceStation = ref('')
const selectedForcedReg = ref('')
const selectedMajorArea = ref('')
const selectedManufacturingArea = ref('')
const selectedServiceArea = ref('')
const isLoading = ref(false)
const hasSearched = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const totalItems = ref(0)
const itemsPerPage = 10

const isDownloading = ref<string | null>(null)
const downloadProgress = ref(0)

const userEmail = ref('')
const userRole = ref('')
const userCircle = ref('')

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

const fetchFilterOptions = async () => {
  try {
    const userId = localStorage.getItem('userId') || ''
    const headers = { 'Authorization': `Bearer ${userId}` }
    
    let majorUrl = 'https://api.isupportbd.com/api/major-areas'
    let mfgUrl = 'https://api.isupportbd.com/api/manufacturing-areas'
    let srvUrl = 'https://api.isupportbd.com/api/service-areas'
    
    const ps = selectedPoliceStation.value
    const ma = selectedMajorArea.value
    
    if (ps) {
      majorUrl += `?policeStation=${encodeURIComponent(ps)}`
      mfgUrl += `?policeStation=${encodeURIComponent(ps)}`
      srvUrl += `?policeStation=${encodeURIComponent(ps)}`
    }
    
    if (ma) {
      const char = ps ? '&' : '?'
      mfgUrl += `${char}majorArea=${encodeURIComponent(ma)}`
      srvUrl += `${char}majorArea=${encodeURIComponent(ma)}`
    }

    const [majRes, mfgRes, srvRes] = await Promise.all([
      fetch(majorUrl, { headers }).then(r => r.json()),
      fetch(mfgUrl, { headers }).then(r => r.json()),
      fetch(srvUrl, { headers }).then(r => r.json())
    ])
    if (majRes.success) majorAreas.value = majRes.data
    if (mfgRes.success) manufacturingAreas.value = mfgRes.data
    if (srvRes.success) serviceAreas.value = srvRes.data
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
  }
}

// Debounce timer for search
let searchTimer: any = null

const fetchReportData = async (page: number = 1) => {
  if (!selectedCircle.value && !selectedMajorArea.value && !selectedManufacturingArea.value && !selectedServiceArea.value && !searchQuery.value) {
    reportData.value = []
    hasSearched.value = false
    return
  }

  hasSearched.value = true
  isLoading.value = true
  
  try {
    const userId = localStorage.getItem('userId') || ''
    let url = `https://api.isupportbd.com/api/bins?page=${page}&limit=${itemsPerPage}`
    
    if (searchQuery.value) url += `&search=${encodeURIComponent(searchQuery.value)}`
    if (selectedCircle.value) url += `&circle=${encodeURIComponent(selectedCircle.value)}`
    if (selectedPoliceStation.value) url += `&policeStation=${encodeURIComponent(selectedPoliceStation.value)}`
    if (selectedForcedReg.value) url += `&forcedRegistration=${encodeURIComponent(selectedForcedReg.value)}`
    if (selectedMajorArea.value) url += `&majorArea=${encodeURIComponent(selectedMajorArea.value)}`
    
    // Only pass dependent filters if their major area is selected
    if (selectedMajorArea.value.includes('Manufacturing') && selectedManufacturingArea.value) {
      url += `&manufacturingArea=${encodeURIComponent(selectedManufacturingArea.value)}`
    }
    if (selectedMajorArea.value.includes('Service') && selectedServiceArea.value) {
      url += `&serviceArea=${encodeURIComponent(selectedServiceArea.value)}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      reportData.value = result.data
      currentPage.value = result.page
      totalPages.value = result.totalPages
      totalItems.value = result.total
      
      // Reset page variables if needed on new fetch
      
      // Extract circle from first record if user is not admin and circle is unknown
      if (userRole.value !== 'Admin' && reportData.value.length > 0 && !userCircle.value) {
        userCircle.value = reportData.value[0].circle || 'Unknown Circle'
      }
    } else {
      console.error('Failed to fetch data:', result.error)
      reportData.value = []
    }
  } catch (error) {
    console.error('Error fetching report data:', error)
    reportData.value = []
  } finally {
    isLoading.value = false
  }
}

const handleFilterChange = () => {
  // Reset dependent fields if Major Area changes
  if (!selectedMajorArea.value.includes('Manufacturing')) selectedManufacturingArea.value = ''
  if (!selectedMajorArea.value.includes('Service')) selectedServiceArea.value = ''
  
  // Re-fetch dependent filter options based on the current selections
  fetchFilterOptions()
  
  fetchReportData(1)
}

const handleSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchReportData(1)
  }, 500)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchReportData(page)
  }
}

const downloadExcel = async (lang: 'en' | 'bn') => {
  if (!hasSearched.value || reportData.value.length === 0) return
  isDownloading.value = lang
  
  try {
    // 1. Fetch all data for the current filter (ignoring pagination limits for export)
    const userId = localStorage.getItem('userId') || ''
    let url = `https://api.isupportbd.com/api/bins?limit=10000`
    
    if (searchQuery.value) url += `&search=${encodeURIComponent(searchQuery.value)}`
    if (selectedCircle.value) url += `&circle=${encodeURIComponent(selectedCircle.value)}`
    if (selectedPoliceStation.value) url += `&policeStation=${encodeURIComponent(selectedPoliceStation.value)}`
    if (selectedForcedReg.value) url += `&forcedRegistration=${encodeURIComponent(selectedForcedReg.value)}`
    if (selectedMajorArea.value) url += `&majorArea=${encodeURIComponent(selectedMajorArea.value)}`
    if (selectedMajorArea.value.includes('Manufacturing') && selectedManufacturingArea.value) {
      url += `&manufacturingArea=${encodeURIComponent(selectedManufacturingArea.value)}`
    }
    if (selectedMajorArea.value.includes('Service') && selectedServiceArea.value) {
      url += `&serviceArea=${encodeURIComponent(selectedServiceArea.value)}`
    }

    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${userId}` } })
    const result = await response.json()
    const dataToExport = result.success ? result.data : reportData.value

    // 2. Format data for Excel
    const formattedData = []
    
    if (lang === 'bn') {
      for (let i = 0; i < dataToExport.length; i++) {
        downloadProgress.value = Math.round((i / dataToExport.length) * 100)
        const item = dataToExport[i]
        formattedData.push({
          'ক্রমিক': translateNumbersToBengali((i + 1).toString()),
          'প্রতিষ্ঠানের নাম': await transliterateToBengali(item.name || ''),
          'ঠিকানা': await transliterateToBengali(item.factoryAddress || ''),
          'মোবাইল': translateNumbersToBengali(item.mobileNumber || ''),
          'ইমেইল': item.email || '-' // usually emails stay in English
        })
      }
    } else {
      for (let i = 0; i < dataToExport.length; i++) {
        if (i % 50 === 0) {
          downloadProgress.value = Math.round((i / dataToExport.length) * 100)
          await new Promise(resolve => setTimeout(resolve, 0)) // Yield to update UI
        }
        
        const item = dataToExport[i]
        formattedData.push({
          'Serial': i + 1,
          'Institution Name': item.name || '-',
          'Address': item.factoryAddress || '-',
          'Mobile': item.mobileNumber || '-',
          'Email': item.email || '-'
        })
      }
    }

    // 3. Create workbook and save
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    
    // Set column widths
    const colWidths = lang === 'bn' 
      ? [{ wch: 8 }, { wch: 40 }, { wch: 50 }, { wch: 15 }, { wch: 25 }]
      : [{ wch: 8 }, { wch: 40 }, { wch: 50 }, { wch: 15 }, { wch: 25 }]
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, lang === 'bn' ? 'এন্টিটি লিস্ট' : 'Entity List')
    
    const fileName = lang === 'bn' ? 'entity_list_report_bn.xlsx' : 'entity_list_report_en.xlsx'
    
    downloadProgress.value = 100 // Finished
    await new Promise(resolve => setTimeout(resolve, 200)) // Brief pause so user sees 100%
    
    XLSX.writeFile(workbook, fileName)
    
  } catch (error) {
    console.error('Error downloading excel:', error)
    alert('Failed to generate Excel file. Please try again.')
  } finally {
    isDownloading.value = null
  }
}

onMounted(async () => {
  userEmail.value = localStorage.getItem('userEmail') || 'User'
  userRole.value = localStorage.getItem('userRole') || 'User'
  userCircle.value = localStorage.getItem('userCircle') || ''
  
  await fetchCircles()
  await fetchPoliceStations()
  await fetchFilterOptions()
  
  // Apply initial filters from route query if present
  if (route.query.circle) {
    selectedCircle.value = route.query.circle as string
  }
  if (route.query.majorArea) {
    selectedMajorArea.value = route.query.majorArea as string
  }
  if (route.query.manufacturingArea) {
    selectedManufacturingArea.value = route.query.manufacturingArea as string
  }
  if (route.query.serviceArea) {
    selectedServiceArea.value = route.query.serviceArea as string
  }
  
  if (selectedCircle.value || selectedMajorArea.value || selectedManufacturingArea.value || selectedServiceArea.value || route.query.search) {
    fetchReportData(1)
  }
})
</script>

<style scoped>
.report-page {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.filter-search {
  width: 100%;
}

.filter-select {
  width: 100%;
}

.filter-select-small {
  width: 100%;
}

@media (min-width: 768px) {
  .filter-search {
    width: 320px;
  }
  .filter-select {
    width: 200px;
  }
  .filter-select-small {
    width: 150px;
  }
}

.tabular-report {
  color: #0f172a;
}

.report-row {
  display: flex;
  margin-bottom: 20px;
  font-size: 16px;
}

.report-label {
  font-weight: 700;
  width: 200px;
  min-width: 200px;
  color: #000;
}

.report-colon {
  font-weight: 700;
  width: 40px;
  min-width: 40px;
  text-align: center;
  color: #000;
}

.report-value {
  flex: 1;
  color: #000;
}

.cursor-pointer:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .report-label {
    width: 150px;
    min-width: 150px;
  }
}

/* Print Styles for A4 */
@media print {
  @page {
    size: A4;
    margin: 20mm;
  }
  
  body {
    background-color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .report-page, .data-area {
    background-color: white !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  
  .detail-card {
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }
  
  .report-row {
    margin-bottom: 20px !important;
    page-break-inside: avoid !important;
  }
}
</style>
