<template>
  <DashboardLayout>
  <div class="report-page d-flex flex-column h-100">
    <!-- Print-Only Header (Hidden on Web) -->
    <div class="d-none d-print-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
      <div>
        <h3 class="mb-1 fw-bold" style="color: #1e293b;">Entity Details Report</h3>
        <p class="mb-0 text-muted">Registered entities and detailed profiles.</p>
      </div>
      <div class="text-end">
        <h6 class="mb-1 fw-bold">{{ userEmail }}</h6>
        <p class="mb-0 text-muted small">{{ userRole === 'Admin' ? 'Admin' : 'Circle: ' + userCircle }}</p>
        <p class="mb-0 text-muted small" style="font-size: 11px;">Generated on: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Minimal Header with Filters (Hidden on Print) -->
    <div class="d-flex justify-content-center">
      <div class="col-12 col-xl-11">
        <div class="report-header shadow bg-white rounded-4 p-3 mb-4 border d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 flex-shrink-0 d-print-none" style="border-color: #cbd5e1 !important;">
      <div class="d-flex align-items-center gap-3">
        <router-link to="/reports" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0 flex-shrink-0" style="width: 40px; height: 40px; border: 1px solid #e2e8f0;" title="Back to Reports Hub">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </router-link>
        <div>
          <h4 class="mb-1 fw-bold" style="color: #1e293b; letter-spacing: -0.5px; white-space: nowrap;">Entity Details Report</h4>
          <p class="mb-0 text-muted" style="font-size: 13px; white-space: nowrap;">View detailed profiles of registered entities.</p>
        </div>
      </div>
      
      <!-- Filters Section (Moved into header) -->
      <div class="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-end gap-2 gap-md-3 w-100 w-xl-auto mt-2 mt-xl-0">
        <!-- Search Box -->
        <div class="position-relative filter-search">
          <svg class="position-absolute" style="left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by BIN number or Name..." 
            class="form-control form-control-sm border-secondary-subtle rounded-pill ps-5 py-2 w-100"
            @input="handleSearch"
            style="font-size: 14px;"
          >
        </div>
        
        <!-- Police Station Filter -->
        <select v-model="selectedPoliceStation" class="form-select form-select-sm border-secondary-subtle rounded-pill py-2 filter-select" style="font-size: 14px;" @change="handleSearch">
          <option value="">All Police Stations</option>
          <option v-for="station in policeStations" :key="station" :value="station">{{ station }}</option>
        </select>

        <!-- Forced Registration Filter -->
        <select v-model="selectedForcedReg" class="form-select form-select-sm border-secondary-subtle rounded-pill py-2 filter-select-small" style="font-size: 14px;" @change="handleSearch">
          <option value="">Forced Reg: All</option>
          <option value="Yes">Forced Reg: Yes</option>
          <option value="No">Forced Reg: No</option>
        </select>

        <!-- Print Button (Only in Detail View now) -->
        </div>
      </div>
    </div>
  </div>

    <!-- Data Display Area -->
    <div class="data-area flex-grow-1 overflow-auto position-relative">
      
      <!-- Initial Empty State -->
      <div v-if="!hasSearched" class="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
        <div class="mb-4 text-muted opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h4 class="text-muted fw-bold">Search for Entities</h4>
        <p class="text-muted" style="max-width: 400px;">Please search by BIN, Name, or apply a filter above to view detailed entity reports.</p>
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
          No data found for "{{ searchQuery || selectedPoliceStation || selectedForcedReg }}". Please try different search criteria.
        </p>
      </div>

      <!-- List View (When no entity is selected) -->
      <div v-else-if="!selectedEntity" class="pb-4">
        <div class="table-responsive bg-white shadow-sm rounded-4 border-0">
          <table class="table table-hover align-middle mb-0" style="font-size: 14px;">
            <thead class="table-light text-muted" style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
              <tr>
                <th class="ps-4 py-3 border-0 rounded-top-start-4">Institution Name</th>
                <th class="py-3 border-0">BIN</th>
                <th class="py-3 border-0">Mobile</th>
                <th class="py-3 border-0">Factory Address</th>
                <th class="py-3 border-0">Major Economic Activity</th>
                <th class="pe-4 py-3 border-0 rounded-top-end-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entity in reportData" :key="entity.id">
                <td class="ps-4 py-3 fw-bold text-dark">{{ entity.name || '-' }}</td>
                <td class="py-3">{{ entity.bin || '-' }}</td>
                <td class="py-3">{{ entity.mobileNumber || '-' }}</td>
                <td class="py-3 text-truncate" style="max-width: 250px;" :title="entity.factoryAddress">{{ entity.factoryAddress || '-' }}</td>
                <td class="py-3">{{ entity.majorAreaOfEconomicActivity || '-' }}</td>
                <td class="pe-4 py-3 text-end">
                  <button @click="viewEntity(entity)" class="btn btn-sm btn-outline-primary rounded-pill px-3">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail View (When an entity is selected) -->
      <div v-else class="pb-4">
        <div class="d-flex justify-content-center">
          <div class="col-12 col-xl-11 mt-2">
            <div class="bg-white shadow-sm rounded-4 p-4 border detail-card" style="border-color: #cbd5e1 !important;">
              <!-- Header Actions -->
              <div class="d-flex justify-content-between mb-3 d-print-none">
                <button @click="selectedEntity = null" class="btn btn-sm btn-outline-secondary px-3 rounded-pill fw-medium">
                  &larr; Back To List
                </button>
                <button @click="printReport" class="btn btn-sm btn-outline-secondary px-3 rounded-pill" title="Print Report">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
                  </svg>
                </button>
              </div>

              <!-- Tabular Data -->
              <div class="tabular-report">
              <div class="report-row">
                <div class="report-label">Entity Name</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.name || '-' }}</div>
              </div>
              <div class="report-row">
                <div class="report-label">BIN Issue Date</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ formatDate(selectedEntity.binIssueDate) }}<span v-if="selectedEntity.binIssueDate" class="text-muted fw-medium">{{ calculateAge(selectedEntity.binIssueDate) }}</span></div>
              </div>
              <div class="report-row">
                <div class="report-label">Factory Address</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.factoryAddress || '-' }}</div>
              </div>
              <div class="report-row">
                <div class="report-label">HQ Address</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.registeredHqAddress || '-' }}</div>
              </div>
              <div class="report-row">
                <div class="report-label">Mobile</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.mobileNumber || '-' }}</div>
              </div>
              <div class="report-row">
                <div class="report-label">Email</div>
                <div class="report-colon">:</div>
                <div class="report-value text-primary">{{ selectedEntity.email || '-' }}</div>
              </div>
              <div class="report-row">
                <div class="report-label">Forced Registration</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.forcedRegistration || 'No' }}</div>
              </div>
              <div class="report-row">
                <div class="report-label">Major Economic Activity</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.majorAreaOfEconomicActivity || '-' }}</div>
              </div>
              <div class="report-row" v-if="selectedEntity.areasOfManufacturing?.trim()">
                <div class="report-label">Area of Manufacturing</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.areasOfManufacturing }}</div>
              </div>
              <div class="report-row" v-if="selectedEntity.areasOfService?.trim()">
                <div class="report-label">Area of Service</div>
                <div class="report-colon">:</div>
                <div class="report-value">{{ selectedEntity.areasOfService }}</div>
              </div>
            </div>
              </div>
            </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1 && !selectedEntity" class="pagination-wrapper mt-auto pt-3 pb-2 d-print-none">
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
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'

const route = useRoute()
const router = useRouter()
const reportData = ref<any[]>([])
const policeStations = ref<string[]>([])
const selectedPoliceStation = ref('')
const selectedForcedReg = ref('')
const isLoading = ref(false)
const hasSearched = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const totalItems = ref(0)
const itemsPerPage = 10

const selectedEntity = ref<any>(null)

const userEmail = ref('')
const userRole = ref('')
const userCircle = ref('')

// Debounce timer for search
let searchTimer: any = null

const fetchPoliceStations = async () => {
  try {
    const userId = localStorage.getItem('userId') || ''
    const response = await fetch('https://api.isupportbd.com/api/police-stations', {
      headers: { 'Authorization': `Bearer ${userId}` }
    })
    const result = await response.json()
    if (result.success) {
      policeStations.value = result.data
    }
  } catch (error) {
    console.error('Failed to fetch police stations:', error)
  }
}

const fetchReportData = async (page: number = 1) => {
  // If no filters are active, reset to empty state
  if (!searchQuery.value && !selectedPoliceStation.value && !selectedForcedReg.value) {
    hasSearched.value = false
    reportData.value = []
    return
  }

  hasSearched.value = true
  isLoading.value = true
  
  try {
    const userId = localStorage.getItem('userId') || ''
    let url = `https://api.isupportbd.com/api/bins?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery.value)}`
    
    if (selectedPoliceStation.value) {
      url += `&policeStation=${encodeURIComponent(selectedPoliceStation.value)}`
    }
    if (selectedForcedReg.value) {
      url += `&forcedRegistration=${encodeURIComponent(selectedForcedReg.value)}`
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
      
      // Reset selected entity on new fetch
      selectedEntity.value = null
      
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

const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchReportData(1)
  }, 500)
}

const printReport = () => {
  window.print()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchReportData(page)
  }
}

const viewEntity = (entity: any) => {
  selectedEntity.value = entity
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-GB') // DD/MM/YYYY
  } catch {
    return dateString
  }
}

const calculateAge = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const now = new Date()
    let years = now.getFullYear() - date.getFullYear()
    let months = now.getMonth() - date.getMonth()
    let days = now.getDate() - date.getDate()
    
    if (days < 0) {
      months--
      const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += previousMonth.getDate()
    }
    
    if (months < 0) {
      years--
      months += 12
    }
    
    const parts = []
    if (years > 0) parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`)
    if (months > 0) parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`)
    if (days > 0 || (years === 0 && months === 0)) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`)
    
    return ` [${parts.join(' ')} Ago]`
  } catch {
    return ''
  }
}

onMounted(async () => {
  userEmail.value = localStorage.getItem('userEmail') || 'User'
  userRole.value = localStorage.getItem('userRole') || 'User'
  fetchPoliceStations()
  
  if (route.query.bin) {
    searchQuery.value = route.query.bin as string
    await fetchReportData(1)
    if (reportData.value.length === 1) {
      viewEntity(reportData.value[0])
    }
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
