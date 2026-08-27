<template>
  <DashboardLayout>
    <div class="container-fluid py-2">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">User Approvals</h2>
          <p class="text-muted mb-0">Manage pending registrations and approved user accounts.</p>
        </div>
      </div>

      <!-- Main Card -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <!-- Tabs & Search Header -->
        <div class="card-header bg-white border-bottom p-0">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center px-4 pt-3 pb-2 gap-3">
            
            <!-- Custom Tabs -->
            <ul class="nav nav-pills custom-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link fw-medium px-4 py-2" :class="{ active: currentTab === 'pending' }" @click="currentTab = 'pending'">
                  Pending 
                  <span class="badge rounded-pill ms-2" :class="currentTab === 'pending' ? 'bg-white text-primary' : 'bg-primary text-white'">
                    {{ pendingUsers.length }}
                  </span>
                </button>
              </li>
              <li class="nav-item ms-2" role="presentation">
                <button class="nav-link fw-medium px-4 py-2" :class="{ active: currentTab === 'active' }" @click="currentTab = 'active'">
                  Active
                  <span class="badge rounded-pill ms-2" :class="currentTab === 'active' ? 'bg-white text-primary' : 'bg-primary text-white'">
                    {{ activeCount }}
                  </span>
                </button>
              </li>
              <li class="nav-item ms-2" role="presentation">
                <button class="nav-link fw-medium px-4 py-2 text-danger" :class="{ 'active bg-danger text-white': currentTab === 'inactive' }" @click="currentTab = 'inactive'">
                  Inactive
                  <span class="badge rounded-pill ms-2" :class="currentTab === 'inactive' ? 'bg-white text-danger' : 'bg-danger text-white'" v-if="inactiveCount > 0">
                    {{ inactiveCount }}
                  </span>
                </button>
              </li>
            </ul>

            <!-- Search Bar (For Active and Inactive Tabs) -->
            <div class="search-wrapper" v-if="currentTab === 'active' || currentTab === 'inactive'">
              <div class="input-group">
                <span class="input-group-text bg-light border-0 ps-3 pe-2 text-muted rounded-start-pill">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                </span>
                <input type="text" class="form-control bg-light border-0 rounded-end-pill ps-1 shadow-none" v-model="searchQuery" placeholder="Search users..." />
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="card-body p-0">
          
          <!-- ================= PENDING TAB ================= -->
          <div v-if="currentTab === 'pending'">
            <!-- Empty State -->
            <div v-if="pendingUsers.length === 0" class="text-center py-5">
              <div class="mb-3 text-muted opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                </svg>
              </div>
              <h5 class="fw-bold text-dark">No pending approvals</h5>
              <p class="text-muted">There are no new user registrations waiting for your approval right now.</p>
            </div>

            <!-- Table -->
            <div class="table-responsive" v-else>
              <table class="table table-borderless table-hover align-middle custom-table mb-0">
                <thead class="text-muted small text-uppercase bg-light">
                  <tr>
                    <th class="ps-4 rounded-start">User</th>
                    <th>Email</th>
                    <th>TrxID</th>
                    <th>Status</th>
                    <th class="text-end pe-4 rounded-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in pendingUsers" :key="user.id" class="table-row-animate">
                    <td class="ps-4">
                      <div class="d-flex align-items-center">
                        <div class="avatar-circle bg-warning text-dark fw-bold me-3">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="fw-semibold text-dark">{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="text-muted">{{ user.email }}</td>
                    <td><span class="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">{{ user.trxId }}</span></td>
                    <td><span class="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">Pending</span></td>
                    <td class="text-end pe-4">
                      <button class="btn btn-icon btn-light text-success hover-success rounded-circle shadow-sm" title="Approve User" @click="approveUser(user.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ================= ACTIVE TAB ================= -->
          <div v-if="currentTab === 'active'">
            <!-- Empty State -->
            <div v-if="activeUsers.length === 0" class="text-center py-5">
              <div class="mb-3 text-muted opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </div>
              <h5 class="fw-bold text-dark">No active users found</h5>
              <p class="text-muted">We couldn't find any active users matching your search.</p>
            </div>

            <!-- Table -->
            <div class="table-responsive" v-else>
              <table class="table table-borderless table-hover align-middle custom-table mb-0">
                <thead class="text-muted small text-uppercase bg-light">
                  <tr>
                    <th class="ps-4 rounded-start">User</th>
                    <th>Email</th>
                    <th>TrxID</th>
                    <th>Status</th>
                    <th class="text-end pe-4 rounded-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in activeUsers" :key="user.id" class="table-row-animate">
                    <td class="ps-4">
                      <div class="d-flex align-items-center">
                        <div class="avatar-circle bg-primary text-white fw-bold me-3">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="fw-semibold text-dark">{{ user.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-muted">{{ user.email }}</td>
                    <td><span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">{{ user.trxId || 'N/A' }}</span></td>
                    <td><span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">Active</span></td>
                    <td class="text-end pe-4">
                      <button class="btn btn-icon btn-light text-danger hover-danger rounded-circle shadow-sm" title="Delete User" @click="deleteUser(user.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ================= INACTIVE TAB ================= -->
          <div v-if="currentTab === 'inactive'">
            <!-- Empty State -->
            <div v-if="inactiveUsers.length === 0" class="text-center py-5">
              <div class="mb-3 text-muted opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                </svg>
              </div>
              <h5 class="fw-bold text-dark">No inactive users</h5>
              <p class="text-muted">There are no users who have been inactive for more than 3 months.</p>
            </div>

            <!-- Table -->
            <div class="table-responsive" v-else>
              <table class="table table-borderless table-hover align-middle custom-table mb-0">
                <thead class="text-muted small text-uppercase bg-light">
                  <tr>
                    <th class="ps-4 rounded-start">User</th>
                    <th>Email</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th class="text-end pe-4 rounded-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in inactiveUsers" :key="user.id" class="table-row-animate bg-danger bg-opacity-10">
                    <td class="ps-4">
                      <div class="d-flex align-items-center">
                        <div class="avatar-circle bg-danger text-white fw-bold me-3">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="fw-semibold text-dark">{{ user.name }}</div>
                          <div class="small text-danger fw-medium d-flex align-items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                            </svg>
                            Inactive (3+ months)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="text-muted">{{ user.email }}</td>
                    <td class="text-muted">{{ user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A' }}</td>
                    <td><span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">Inactive</span></td>
                    <td class="text-end pe-4">
                      <button class="btn btn-icon btn-light text-danger hover-danger rounded-circle shadow-sm" title="Delete User" @click="deleteUser(user.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
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
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../components/DashboardLayout.vue'

const router = useRouter()
const currentTab = ref('pending') // 'pending' | 'approved'
const mockUsers = ref<any[]>([])
const approvedUsers = ref<any[]>([])
const searchQuery = ref('')

const pendingUsers = computed(() => mockUsers.value)

const processedApprovedUsers = computed(() => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  const currentUserId = parseInt(localStorage.getItem('userId') || '0')

  return approvedUsers.value
    .filter(u => u.id !== currentUserId) // Hide logged-in admin
    .map(u => {
      let isInactive = false
      if (u.lastLoginAt) {
        const lastLogin = new Date(u.lastLoginAt)
        if (lastLogin < threeMonthsAgo) {
          isInactive = true
        }
      }
      return { ...u, isInactive }
    })
})

const activeUsers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return processedApprovedUsers.value
    .filter(u => !u.isInactive)
    .filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) || 
      (u.trxId && u.trxId.toLowerCase().includes(query))
    )
})

const inactiveUsers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return processedApprovedUsers.value
    .filter(u => u.isInactive)
    .filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) || 
      (u.trxId && u.trxId.toLowerCase().includes(query))
    )
})

const inactiveCount = computed(() => {
  return processedApprovedUsers.value.filter(u => u.isInactive).length
})

const activeCount = computed(() => {
  return processedApprovedUsers.value.filter(u => !u.isInactive).length
})

const fetchPendingUsers = async () => {
  try {
    const response = await fetch('https://api.isupportbd.com/api/users/pending')
    const data = await response.json()
    if (data.success) {
      mockUsers.value = data.data
    }
  } catch (error) {
    console.error('Failed to fetch pending users:', error)
  }
}

const fetchApprovedUsers = async () => {
  try {
    const response = await fetch('https://api.isupportbd.com/api/users/approved')
    const data = await response.json()
    if (data.success) {
      approvedUsers.value = data.data
    }
  } catch (error) {
    console.error('Failed to fetch approved users:', error)
  }
}

onMounted(() => {
  const role = localStorage.getItem('userRole')
  if (!role || role.toLowerCase() !== 'admin') {
    // Only admins can access this page
    router.push('/dashboard')
    return
  }
  
  fetchPendingUsers()
  fetchApprovedUsers()
})

const approveUser = async (id: number) => {
  try {
    const response = await fetch(`https://api.isupportbd.com/api/users/approve/${id}`, {
      method: 'PUT'
    })
    const data = await response.json()
    if (data.success) {
      fetchPendingUsers()
      fetchApprovedUsers()
    } else {
      alert('Failed to approve user: ' + data.error)
    }
  } catch (error) {
    console.error('Failed to approve user:', error)
    alert('An error occurred.')
  }
}

const deleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user? ALL of their uploaded data will also be permanently deleted!')) {
    return;
  }
  
  try {
    const response = await fetch(`https://api.isupportbd.com/api/users/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (data.success) {
      fetchApprovedUsers()
    } else {
      alert('Failed to delete user: ' + data.error)
    }
  } catch (error) {
    console.error('Failed to delete user:', error)
    alert('An error occurred while deleting.')
  }
}
</script>

<style scoped>
/* Tabs Styling */
.custom-tabs .nav-link {
  color: #6c757d;
  border-radius: 50rem;
  transition: all 0.2s ease;
}
.custom-tabs .nav-link:hover:not(.active) {
  background-color: #f8f9fa;
  color: #495057;
}
.custom-tabs .nav-link.active {
  background-color: #0d6efd;
  color: white;
  box-shadow: 0 4px 6px rgba(13, 110, 253, 0.2);
}

/* Search Bar */
.search-wrapper {
  width: 100%;
  max-width: 320px;
}
.search-wrapper .input-group-text {
  background-color: #f1f3f5;
}
.search-wrapper .form-control {
  background-color: #f1f3f5;
}
.search-wrapper .form-control:focus {
  box-shadow: none;
  background-color: #e9ecef;
}
.search-wrapper:focus-within .input-group-text {
  background-color: #e9ecef;
  color: #0d6efd !important;
}

/* Table Styling */
.custom-table th {
  font-weight: 600;
  letter-spacing: 0.5px;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.custom-table td {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  vertical-align: middle;
  border-bottom: 1px solid #f8f9fa;
}

/* Avatar Circle */
.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* Icon Buttons */
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background-color: #fff;
  border: 1px solid #dee2e6;
}
.hover-success:hover {
  background-color: #198754;
  color: #fff !important;
  border-color: #198754;
  transform: translateY(-2px);
}
.hover-danger:hover {
  background-color: #dc3545;
  color: #fff !important;
  border-color: #dc3545;
  transform: translateY(-2px);
}

/* Row Hover Animation */
.table-row-animate {
  transition: all 0.2s ease;
}
.table-row-animate:hover {
  background-color: #fcfcfc;
  transform: scale(1.002);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  position: relative;
  z-index: 1;
}

/* Badge Tweaks */
.badge {
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
