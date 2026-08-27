<template>
  <DashboardLayout>
    <div class="container-fluid py-2">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Plans & Pricing</h2>
          <p class="text-muted mb-0">Manage subscription plans and their prices.</p>
        </div>
        <button class="btn btn-primary rounded-pill px-4 fw-medium shadow-sm" @click="createPlan">
          <i class="bi bi-plus-lg me-2"></i>Create New Plan
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Main Card -->
      <div v-else class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="plan in plans" :key="plan.id">
          <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
            <div class="bg-primary text-white text-center py-4 px-3">
              <h4 class="fw-bold mb-1">{{ plan.name }}</h4>
              <p class="text-white-50 small m-0">{{ plan.description }}</p>
            </div>
            
            <div class="card-body p-4 text-center d-flex flex-column justify-content-center">
              <div class="mb-4">
                <span class="display-5 fw-bold text-dark">{{ plan.price }}</span>
                <span class="text-muted"> BDT / month</span>
              </div>
              
              <button class="btn btn-outline-primary rounded-pill w-100 fw-medium mt-auto" @click="editPlan(plan)">
                Edit Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Create Plan Modal -->
    <div class="modal fade" id="editPlanModal" tabindex="-1" aria-hidden="true" ref="editModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">{{ editingPlan.id === 0 ? 'Create Plan' : 'Edit Plan' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4">
            <div class="mb-3">
              <label class="form-label fw-medium">Plan Name</label>
              <input type="text" class="form-control bg-light" v-model="editingPlan.name" placeholder="e.g. Basic, Premium" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Monthly Price (BDT)</label>
              <input type="number" class="form-control bg-light" v-model="editingPlan.price" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Description</label>
              <textarea class="form-control bg-light" rows="2" v-model="editingPlan.description"></textarea>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary rounded-pill px-4" @click="savePlan" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Save Changes
            </button>
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
// @ts-ignore
import * as bootstrap from 'bootstrap'

const router = useRouter()
const plans = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const editModalRef = ref<HTMLElement | null>(null)
let editModalInstance: any = null

const editingPlan = ref({
  id: 0,
  name: '',
  price: 0,
  description: ''
})

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/plans`, {
      headers: getAuthHeaders()
    })
    const data = await response.json()
    if (data.success) {
      plans.value = data.data
    } else {
      console.error('API Error:', data.error);
      alert('Error fetching plans: ' + (data.error || 'Unauthorized'));
    }
  } catch (error) {
    console.error('Failed to fetch plans:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const role = localStorage.getItem('userRole')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  // Allow if role is Admin OR if the central SSO user says they are admin
  if (role?.toLowerCase() !== 'admin' && !user.isApproved) {
    router.push('/dashboard')
    return
  }
  
  fetchPlans()
  
  if (editModalRef.value) {
    editModalInstance = new bootstrap.Modal(editModalRef.value)
  }
})

const createPlan = () => {
  editingPlan.value = {
    id: 0,
    name: '',
    price: 0,
    description: ''
  }
  if (editModalInstance) {
    editModalInstance.show()
  }
}

const editPlan = (plan: any) => {
  editingPlan.value = { ...plan }
  if (editModalInstance) {
    editModalInstance.show()
  }
}

const savePlan = async () => {
  saving.value = true
  try {
    const isNew = editingPlan.value.id === 0
    const url = isNew 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/plans` 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/plans/${editingPlan.value.id}`
      
    const response = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: editingPlan.value.name,
        price: editingPlan.value.price,
        description: editingPlan.value.description
      })
    })
    
    const data = await response.json()
    if (data.success) {
      if (editModalInstance) {
        editModalInstance.hide()
      }
      await fetchPlans()
    } else {
      alert('Failed to save plan: ' + data.error)
    }
  } catch (error) {
    console.error('Failed to save plan:', error)
    alert('An error occurred while saving.')
  } finally {
    saving.value = false
  }
}
</script>
