<template>
  <DashboardLayout>
    <div class="report-page d-flex flex-column h-100">
      
      <!-- Print-Only Header (Hidden on Web) -->
      <div class="d-none d-print-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <div>
          <h3 class="mb-1 fw-bold" style="color: #1e293b;">Entity by Economic Activities</h3>
          <p class="mb-0 text-muted">View entity counts grouped by economic areas.</p>
        </div>
        <div class="text-end">
          <h6 class="mb-1 fw-bold">{{ userEmail }}</h6>
          <p class="mb-0 text-muted small">{{ userRole === 'Admin' ? 'Admin' : 'Circle: ' + userCircle }}</p>
          <p class="mb-0 text-muted small" style="font-size: 11px;">Generated on: {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
      
      <!-- Top Actions Row for Mobile/Small Screens -->
      <div class="d-flex justify-content-between align-items-center mb-3 d-xl-none px-2 d-print-none">
        <h4 class="mb-0 fw-bold text-dark fs-5">Entity by Economic Activities</h4>
      </div>

      <!-- Main Report Container -->
      <div class="d-flex justify-content-center flex-grow-1 overflow-hidden pb-4">
        <div class="col-12 col-xl-11 d-flex flex-column h-100">
          <div class="shadow bg-white rounded-4 border d-flex flex-column h-100 overflow-hidden" style="border-color: #cbd5e1 !important;">
            
            <!-- Header section -->
            <div class="p-3 border-bottom d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 flex-shrink-0 d-print-none">
              <div class="d-flex align-items-center gap-3">
                <router-link to="/reports" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0 flex-shrink-0" style="width: 40px; height: 40px; border: 1px solid #e2e8f0;" title="Back to Reports Hub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </router-link>
                <div>
                  <h4 class="mb-1 fw-bold" style="color: #1e293b; letter-spacing: -0.5px; white-space: nowrap;">Entity by Economic Activities</h4>
                  <p class="mb-0 text-muted" style="font-size: 13px; white-space: nowrap;">View entity counts grouped by economic areas.</p>
                </div>
              </div>
              
              <!-- Download Buttons and Totals -->
              <div class="d-flex flex-wrap align-items-center gap-3 mt-3 mt-xl-0 d-print-none">
                
                <!-- Total Count: Eco Area -->
                <div v-if="reportData.length > 0" class="d-flex align-items-center justify-content-center gap-2 bg-info bg-opacity-10 text-info px-4 rounded-pill border border-info border-opacity-25 fw-bold" style="height: 36px; font-size: 14px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Eco. Area: {{ reportData.length }}
                </div>
                
                <!-- Total Count: Entities -->
                <div v-if="reportData.length > 0" class="d-flex align-items-center justify-content-center gap-2 bg-primary bg-opacity-10 text-primary px-4 rounded-pill border border-primary border-opacity-25 fw-bold" style="height: 36px; font-size: 14px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Entities: {{ totalCount }}
                </div>

                <!-- Print Button -->
                <button @click="printReport" class="btn btn-outline-danger rounded-pill px-4 fw-medium d-flex align-items-center justify-content-center gap-2" style="height: 36px; font-size: 14px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  Print / PDF
                </button>
                
                <!-- Excel Button -->
                <button @click="downloadExcel" class="btn btn-success rounded-pill px-4 fw-medium d-flex align-items-center justify-content-center gap-2" style="height: 36px; font-size: 14px;" :disabled="isLoading || reportData.length === 0 || isDownloading">
                  <svg v-if="!isDownloading" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Excel
                </button>
              </div>
            </div>

            <!-- New Filter Card Section -->
            <div class="p-3 border-bottom d-print-none flex-shrink-0" style="background-color: #f8fafc;">
              <div class="card border-0 shadow-sm rounded-4" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe !important;">
                <div class="card-body p-4">
                  <div class="row g-3 justify-content-center">
                    <!-- Circle Filter -->
                    <div class="col-12 col-md-4">
                      <select v-model="selectedCircle" class="form-select shadow-sm border-0 rounded-3" @change="fetchReportData">
                        <option value="" disabled selected>Select a Circle</option>
                        <option v-for="circle in circles" :key="circle" :value="circle">{{ circle }}</option>
                      </select>
                    </div>
                        
                    <!-- Group By Filter -->
                    <div class="col-12 col-md-4">
                      <select v-model="groupBy" class="form-select shadow-sm border-0 rounded-3" @change="fetchReportData">
                        <option value="major">Group By: Major Economic Area</option>
                        <option value="manufacturing">Group By: Manufacturing Area</option>
                        <option value="service">Group By: Service Area</option>
                      </select>
                    </div>
                    
                    <!-- Police Station Filter -->
                    <div class="col-12 col-md-4">
                      <select v-model="selectedPoliceStation" class="form-select shadow-sm border-0 rounded-3" @change="fetchReportData">
                        <option value="">All Police Stations</option>
                        <option v-for="station in policeStations" :key="station" :value="station">{{ station }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Display Area (Inside the card) -->
            <div class="data-area flex-grow-1 overflow-auto position-relative bg-white">
              
              <!-- Loading State -->
              <div v-if="isLoading" class="h-100 d-flex flex-column align-items-center justify-content-center">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Fetching summary data...</p>
              </div>

              <!-- Select Circle State -->
              <div v-else-if="!selectedCircle" class="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
                <div class="mb-4 text-muted opacity-75">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h4 class="text-muted fw-bold">Select a Circle</h4>
                <p class="text-muted" style="max-width: 400px;">
                  Please select a <b>Circle</b> to view the economic activities summary.
                </p>
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
                  No data found for the selected grouping.
                </p>
              </div>

              <!-- List View -->
              <div v-else class="pb-4">
                <div class="table-responsive bg-white shadow-sm rounded-4 border-0">
                  <table class="table table-hover align-middle mb-0" style="table-layout: fixed; font-size: 14px;">
                    <thead class="table-light text-dark fw-bold" style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      <tr>
                        <th class="ps-4 py-2 border-0 rounded-top-start-4" style="width: 80px;">Serial</th>
                        <th class="py-2 border-0">{{ getGroupName() }}</th>
                        <th class="py-2 border-0 text-center" style="width: 180px;">Number of Entities</th>
                        <th class="py-2 border-0 text-center rounded-top-end-4 d-print-none" style="width: 140px;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in reportData" :key="index" style="transition: all 0.2s;">
                        <td class="ps-4 text-primary fw-bold py-2">{{ index + 1 }}</td>
                        <td class="py-2 text-truncate">
                          <span class="fw-bold text-dark">{{ item.area }}</span>
                        </td>
                        <td class="py-2 text-center">
                          <span class="badge bg-primary rounded-pill px-3 py-1" style="font-size: 12px; min-width: 50px;">{{ item.count }}</span>
                        </td>
                        <td class="py-2 text-center d-print-none">
                          <button @click="viewList(item.area)" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium bg-white" style="border-width: 1.5px; white-space: nowrap;">
                            View List
                          </button>
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

      <!-- Full Screen Download Overlay -->
      <div v-if="isDownloading" class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 9999;">
        <div class="bg-white p-4 rounded-4 shadow-lg text-center border" style="width: 320px; border-color: #e2e8f0 !important;">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h5 class="fw-bold text-dark mb-1">Generating Excel</h5>
          <p class="text-muted small mb-3">Please wait while we process the data...</p>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'
import * as XLSX from 'xlsx'

const router = useRouter()
const reportData = ref<any[]>([])
const circles = ref<string[]>([])
const policeStations = ref<string[]>([])
const selectedCircle = ref('')
const selectedPoliceStation = ref('')
const groupBy = ref('major')
const isLoading = ref(false)
const isDownloading = ref(false)

const userEmail = ref('')
const userRole = ref('')
const userCircle = ref('')

const totalCount = computed(() => {
  return reportData.value.reduce((sum, item) => sum + Number(item.count), 0)
})

const getGroupName = () => {
  if (groupBy.value === 'manufacturing') return 'Manufacturing Area'
  if (groupBy.value === 'service') return 'Service Area'
  return 'Major Economic Area'
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

const fetchReportData = async () => {
  if (!selectedCircle.value) {
    reportData.value = []
    return
  }

  isLoading.value = true
  
  try {
    const userId = localStorage.getItem('userId') || ''
    let url = `https://api.isupportbd.com/api/reports/itemwise-summary?groupBy=${groupBy.value}`
    if (selectedCircle.value) {
      url += `&circle=${encodeURIComponent(selectedCircle.value)}`
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
      reportData.value = result.data
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

const viewList = (areaName: string) => {
  const query: any = {}
  if (selectedCircle.value) {
    query.circle = selectedCircle.value
  }
  if (selectedPoliceStation.value) {
    query.policeStation = selectedPoliceStation.value
  }
  if (groupBy.value === 'major') {
    query.majorArea = areaName
  } else if (groupBy.value === 'manufacturing') {
    query.majorArea = 'Manufacturing' // Need to ensure it activates the dropdown on the next page
    query.manufacturingArea = areaName
  } else if (groupBy.value === 'service') {
    query.majorArea = 'Service'
    query.serviceArea = areaName
  }
  router.push({ path: '/reports/entity-list', query })
}

const downloadExcel = () => {
  isDownloading.value = true
  
  try {
    const formattedData: any[] = reportData.value.map((item, index) => ({
      'Serial': index + 1,
      [getGroupName()]: item.area,
      'Number of Entities': item.count
    }))

    formattedData.push({
      'Serial': '',
      [getGroupName()]: `Total Eco. Area: ${reportData.value.length}`,
      'Number of Entities': totalCount.value
    })

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const colWidths = [{ wch: 8 }, { wch: 50 }, { wch: 20 }]
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Itemwise Summary')
    
    XLSX.writeFile(workbook, 'itemwise_entity_summary.xlsx')
  } catch (error) {
    console.error('Error downloading excel:', error)
    alert('Failed to generate Excel file. Please try again.')
  } finally {
    isDownloading.value = false
  }
}

const printReport = () => {
  window.print()
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
  fetchReportData()
})
</script>

<style scoped>
.report-page {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 90px);
}
.data-area {
  overflow-y: scroll !important;
}

@media print {
  body * {
    visibility: hidden;
  }
  .report-page, .report-page * {
    visibility: visible;
  }
  .report-page {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .d-print-none {
    display: none !important;
  }
  .d-print-flex {
    display: flex !important;
  }
  .table {
    border-collapse: collapse;
  }
  .table th, .table td {
    border: 1px solid #ddd !important;
    padding: 4px 8px !important;
    font-size: 12px !important;
  }
  .badge {
    padding: 4px 8px !important;
  }
  .shadow {
    box-shadow: none !important;
  }
  .card {
    border: none !important;
  }
  .h-100 {
    height: auto !important;
  }
  .overflow-hidden, .overflow-auto {
    overflow: visible !important;
  }
}
</style>
