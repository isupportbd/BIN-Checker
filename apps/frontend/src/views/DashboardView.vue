<template>
  <DashboardLayout>
    <!-- User specific section: File Upload -->
    <template v-if="!isAdmin">
      <div class="container-fluid py-4 px-2">
        <!-- Welcome Banner -->
        <div class="mb-5">
          <h2 class="fw-bold text-dark mb-1">Welcome back!</h2>
          <p class="text-muted">Manage your BIN data and generate reports from your dashboard.</p>
        </div>

        <!-- 3 Navigation Cards -->
        <div class="row g-4 mb-4">
          <!-- Upload Data Card -->
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/upload')">
              <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden bg-gradient-blue text-white rounded-3">
                <div class="icon-wrapper mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </div>
                <h4 class="fw-bold mb-2">Upload Data</h4>
                <p class="text-white-50 mb-4 small">Import your excel sheets to seamlessly parse and save BIN information into the database.</p>
                <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                  <span>Get Started</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </div>
                <!-- Decorative Circle -->
                <div class="card-decoration"></div>
              </div>
            </div>
          </div>
          
          <!-- BIN List Card -->
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/bin-list')">
              <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden bg-gradient-purple text-white rounded-3">
                <div class="icon-wrapper mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
                    <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
                    <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
                  </svg>
                </div>
                <h4 class="fw-bold mb-2">BIN List</h4>
                <p class="text-white-50 mb-4 small">View, search, and manage all your previously uploaded BIN records in one place.</p>
                <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                  <span>View Records</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </div>
                <!-- Decorative Circle -->
                <div class="card-decoration"></div>
              </div>
            </div>
          </div>

          <!-- Report Card -->
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm premium-card" @click="router.push('/reports')">
              <div class="card-body p-4 d-flex flex-column position-relative overflow-hidden bg-gradient-orange text-white rounded-3">
                <div class="icon-wrapper mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm1.5-3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5v-1zm-1-3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-1zm1-3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5V3z"/>
                  </svg>
                </div>
                <h4 class="fw-bold mb-2">Reports Hub</h4>
                <p class="text-white-50 mb-4 small">Access various reports including entity details, lists, and analytical insights.</p>
                <div class="mt-auto d-flex align-items-center text-white fw-semibold action-link">
                  <span>View Reports</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </div>
                <!-- Decorative Circle -->
                <div class="card-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Admin specific section -->
    <template v-else>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body p-4 text-center">
              <h1 class="display-4 fw-bold text-primary mb-2">0</h1>
              <p class="text-muted fw-medium m-0">Pending Approvals</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body p-4 text-center">
              <h1 class="display-4 fw-bold text-success mb-2">0</h1>
              <p class="text-muted fw-medium m-0">Total Users</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body p-4 text-center">
              <h1 class="display-4 fw-bold text-info mb-2">0</h1>
              <p class="text-muted fw-medium m-0">Total Records Uploaded</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'

const router = useRouter()
const isAdmin = ref(false)

onMounted(() => {
  const role = localStorage.getItem('userRole')
  
  if (role && role.toLowerCase() === 'admin') {
    isAdmin.value = true
  }
})


const alert = (msg: string) => window.alert(msg)
</script>

<style scoped>
th {
  white-space: nowrap;
}

.premium-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 12px;
}

.premium-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-orange {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

.card-decoration {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
  transition: all 0.3s ease;
}

.premium-card:hover .card-decoration {
  transform: scale(1.2);
  background: rgba(255, 255, 255, 0.15);
}

.action-link svg {
  transition: transform 0.2s;
}

.premium-card:hover .action-link svg {
  transform: translateX(4px);
}
</style>
