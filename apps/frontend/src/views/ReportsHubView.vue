<template>
  <DashboardLayout>
    <div class="container-fluid py-4 px-2">
      <!-- Back to Dashboard -->
      <div class="mb-4 d-flex align-items-center gap-3">
        <router-link to="/dashboard" class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0 flex-shrink-0" style="width: 40px; height: 40px; border: 1px solid #e2e8f0;" title="Back to Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </router-link>
        <div>
          <h2 class="fw-bold text-dark mb-1">Reports Hub</h2>
          <p class="text-muted mb-0">Select a report to generate and view data insights.</p>
        </div>
      </div>

      <!-- Report Cards -->
      <div class="row g-4 mb-4">
        
        <!-- Entity Details Report Card -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/reports/entity-details')">
            <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden bg-gradient-orange text-white rounded-3">
              <div class="icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm1.5-3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5v-1zm-1-3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-1zm1-3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5V3z"/>
                </svg>
              </div>
              <h4 class="fw-bold mb-2">Entity Details</h4>
              <p class="text-white-50 mb-4 small">View printable, detailed profiles for individual registered entities.</p>
              <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                <span>Open Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
              <div class="card-decoration"></div>
            </div>
          </div>
        </div>
        
        <!-- Entity List Report Card -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/reports/entity-list')">
            <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden text-white rounded-3" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <div class="icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                  <path d="M4.5 10a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </div>
              <h4 class="fw-bold mb-2">Entity List</h4>
              <p class="text-white-50 mb-4 small">Generate list-based reports and download bilingual filtered Excel files.</p>
              <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                <span>Open Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
              <div class="card-decoration"></div>
            </div>
          </div>
        </div>

        <!-- Entity by Economic Activities Card -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/reports/entity-by-economic-activities')">
            <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden text-white rounded-3" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
              <div class="icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                </svg>
              </div>
              <h4 class="fw-bold mb-2">Entity by Economic Activities</h4>
              <p class="text-white-50 mb-4 small">View summarized counts of entities grouped by their economic areas.</p>
              <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                <span>Open Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
              <div class="card-decoration"></div>
            </div>
          </div>
        </div>

        <!-- Duplicate BIN Report Card -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/reports/duplicates')">
            <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden text-white rounded-3" style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);">
              <div class="icon-wrapper mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M12 13h.01"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h4 class="fw-bold mb-2">Duplicate BIN</h4>
              <p class="text-white-50 mb-4 small">Identify businesses with similar names, addresses, or mobile numbers.</p>
              <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                <span>Open Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
              <div class="card-decoration"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'

const router = useRouter()
</script>

<style scoped>
.premium-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.premium-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.bg-gradient-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.action-link {
  font-size: 14px;
  opacity: 0.9;
  transition: opacity 0.2s;
}
.premium-card:hover .action-link {
  opacity: 1;
}
.premium-card:hover .action-link svg {
  transform: translateX(4px);
  transition: transform 0.2s ease;
}

.card-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}
</style>
