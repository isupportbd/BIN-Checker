<template>
  <div class="d-flex layout-wrapper bg-light">
    
    <!-- Sidebar (Admin Only) -->
    <div v-if="isAdmin" class="bg-dark text-white d-flex flex-column p-3 d-print-none sidebar" style="width: 250px; min-width: 250px;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span class="fs-4 fw-bold">BIN Checker</span>
      </a>
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link text-white" active-class="active bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer2 me-2" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
              <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li class="nav-item mt-1" v-if="isAdmin">
          <router-link to="/approvals" class="nav-link text-white" active-class="active bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill me-2" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
            Approvals
          </router-link>
        </li>
        <li class="nav-item mt-1" v-if="isAdmin">
          <router-link to="/plans" class="nav-link text-white" active-class="active bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag-fill me-2" viewBox="0 0 16 16">
              <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>
            Plans & Pricing
          </router-link>
        </li>
      </ul>
      <hr>
      
      <!-- Spacer to push anything else up if needed, though we removed bottom avatar -->
      <div class="flex-grow-1"></div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 d-flex flex-column main-wrapper">
      
      <!-- Topbar Header -->
      <header class="bg-white shadow-sm d-flex align-items-center p-3 border-bottom z-1 d-print-none">
        <div class="w-100 d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-dark fw-semibold ms-2">{{ pageTitle }}</h5>
          
          <div class="d-flex align-items-center">
            
            <!-- Notification Bell (Admin Only) -->
            <div v-if="isAdmin" class="dropdown me-4">
              <div class="position-relative" style="cursor: pointer;" title="Notifications" @click.stop="toggleNotification">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="text-secondary hover-dark notification-bell" viewBox="0 0 16 16" style="transition: color 0.2s;">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                </svg>
                <span v-if="pendingCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white notification-badge">
                  {{ pendingCount }}
                </span>
              </div>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3" :class="{ show: showNotification }" style="min-width: 260px; position: absolute; right: 0;">
                <li class="px-3 py-2 border-bottom bg-light rounded-top-3">
                  <span class="fw-bold text-dark">Notifications</span>
                </li>
                <li v-if="pendingCount > 0">
                  <button class="dropdown-item py-3 text-wrap d-flex align-items-start" @click="goToPending">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                      </svg>
                    </div>
                    <div>
                      <span class="d-block fw-medium text-dark mb-1">Pending Approvals</span>
                      <span class="text-muted small">You have {{ pendingCount }} new users waiting to be approved.</span>
                    </div>
                  </button>
                </li>
                <li v-else>
                  <div class="px-3 py-4 text-center text-muted small">
                    No new notifications right now.
                  </div>
                </li>
              </ul>
            </div>

            <!-- Current User Profile in Header -->
            <div class="dropdown pe-3">
              <button class="btn border-0 p-0 shadow-sm rounded-circle" type="button" @click.stop="toggleProfile" style="transition: transform 0.2s ease;">
                <div class="bg-primary bg-gradient text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style="width: 42px; height: 42px; font-size: 1.1rem;">
                  {{ userInitial }}
                </div>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3" :class="{ show: showProfile }" style="min-width: 220px; position: absolute; right: 0;">
                <li class="px-3 py-3 border-bottom text-center bg-light rounded-top-3">
                  <span class="fw-bold text-dark d-block text-truncate mb-2">{{ userEmail }}</span>
                  <span class="badge rounded-pill px-3 py-1" :class="isAdmin ? 'text-bg-primary' : 'text-bg-success'">{{ userRole }}</span>
                </li>
                <li>
                  <button class="dropdown-item text-danger fw-medium py-2 mt-1 d-flex align-items-center justify-content-center" @click="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                      <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Page Content -->
      <main class="p-4 flex-grow-1 d-flex flex-column content-wrapper">
        <slot />
      </main>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isAdmin = ref(false)
const userEmail = ref('')
const userRole = ref('')
const pendingCount = ref(0)
let pollInterval: any = null

const showNotification = ref(false)
const showProfile = ref(false)

const toggleNotification = () => {
  showNotification.value = !showNotification.value
  if (showNotification.value) showProfile.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  if (showProfile.value) showNotification.value = false
}

const closeDropdowns = () => {
  showNotification.value = false
  showProfile.value = false
}

const goToPending = () => {
  closeDropdowns()
  router.push('/approvals')
}

const userInitial = computed(() => userEmail.value ? userEmail.value.charAt(0).toUpperCase() : 'U')

const pageTitle = computed(() => {
  if (route.name === 'dashboard') return 'Dashboard'
  if (route.name === 'approvals') return 'Approvals'
  if (route.name === 'plans') return 'Plans & Pricing'
  return 'BIN Checker'
})

const fetchPendingCount = async () => {
  if (!isAdmin.value) return;
  try {
    const response = await fetch('https://api.isupportbd.com/api/users/pending')
    const data = await response.json()
    if (data.success) {
      pendingCount.value = data.data.length
    }
  } catch (error) {
    console.error('Error fetching pending users:', error)
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)

  const role = localStorage.getItem('userRole')
  userRole.value = role || 'User'
  userEmail.value = localStorage.getItem('userEmail') || 'Unknown User'
  
  if (role && role.toLowerCase() === 'admin') {
    isAdmin.value = true
    fetchPendingCount()
    pollInterval = setInterval(fetchPendingCount, 15000) // Poll every 15s
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
  if (pollInterval) clearInterval(pollInterval)
})

const logout = () => {
  localStorage.removeItem('userRole')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userId')
  localStorage.removeItem('user') // Also clear the sso user
  window.location.href = '/login' // Redirect to Login
}
</script>

<style scoped>
.notification-bell:hover {
  color: #212529 !important;
}
.notification-badge {
  font-size: 0.65rem;
  padding: 0.35em 0.55em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: pop 0.3s ease-out;
}
@keyframes pop {
  0% { transform: translate(-50%, -50%) scale(0); }
  80% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.layout-wrapper {
  height: 100vh;
  overflow: hidden;
}

.main-wrapper {
  overflow: hidden;
}

.content-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
}

@media print {
  .layout-wrapper, .main-wrapper, .content-wrapper {
    height: auto !important;
    overflow: visible !important;
  }
  .bg-light {
    background-color: white !important;
  }
  main {
    padding: 0 !important;
  }
}
</style>
