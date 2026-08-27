<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 500px; border-radius: 1rem;">
      <h3 class="card-title text-center text-primary fw-bold mb-4">
        {{ isAdminSignup ? 'Admin Sign Up' : 'User Sign Up' }}
      </h3>
      
      <div v-if="!isAdminSignup" class="alert alert-info mb-4 text-center" role="alert">
        <strong>Subscription Plan:</strong> {{ planName }}<br/>
        <div class="mt-2 mb-2">
          Please <strong>Send Money</strong> via bKash to <strong>01719950891</strong>.<br/>
          Amount: {{ planPrice }} BDT + 1.8% charge ({{ Math.ceil(planPrice * 0.018) }} BDT) = <strong class="text-danger fs-5">Total Payable: {{ planPrice + Math.ceil(planPrice * 0.018) }} BDT</strong>.<br/>
        </div>
        After sending, enter the Transaction ID below. Your account will be active once an admin approves it.
      </div>
      <div v-else class="alert alert-warning mb-4" role="alert">
        <strong>Admin Setup:</strong> You are creating the primary admin account. No subscription fee is required.
      </div>

      <form @submit.prevent="handleSignup">
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-control" v-model="form.name" required placeholder="Enter your full name" />
        </div>
        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input type="email" class="form-control" v-model="form.email" required placeholder="name@example.com" />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="position-relative">
            <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="form.password" required placeholder="Create a password" style="padding-right: 40px;" />
            <span class="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" style="cursor: pointer;" @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755l-.809-.805zm-4.322-4.322a3.50 3.50 0 0 1 1.768 1.768l-1.768-1.768zm-2.022.022L6.92 7.034C6.58 7.373 6.36 7.848 6.36 8.36c0 1.05.85 1.9 1.9 1.9.512 0 .987-.22 1.326-.56l.096-.096-2.667-2.666zm5.352 5.352-12-12 .708-.708 12 12-.708.708zm-2.753-1.353c-1.393.818-3.056 1.343-5.067 1.343-5 0-8-5.5-8-5.5s.896-1.642 2.448-3.14l1.378 1.378A11.082 11.082 0 0 0 1.172 8c.058.087.122.183.195.288.335.48.83 1.12 1.465 1.755C4.121 11.332 5.88 12.5 8 12.5c1.172 0 2.274-.213 3.25-.59l-1.633-1.633a5.955 5.955 0 0 1-.806.208 3.5 3.5 0 0 1-4.004-4.004c.036-.282.106-.554.208-.806l-1.633-1.633z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
            </span>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <div class="position-relative">
            <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control" v-model="form.confirmPassword" required placeholder="Confirm your password" style="padding-right: 40px;" />
            <span class="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" style="cursor: pointer;" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755l-.809-.805zm-4.322-4.322a3.50 3.50 0 0 1 1.768 1.768l-1.768-1.768zm-2.022.022L6.92 7.034C6.58 7.373 6.36 7.848 6.36 8.36c0 1.05.85 1.9 1.9 1.9.512 0 .987-.22 1.326-.56l.096-.096-2.667-2.666zm5.352 5.352-12-12 .708-.708 12 12-.708.708zm-2.753-1.353c-1.393.818-3.056 1.343-5.067 1.343-5 0-8-5.5-8-5.5s.896-1.642 2.448-3.14l1.378 1.378A11.082 11.082 0 0 0 1.172 8c.058.087.122.183.195.288.335.48.83 1.12 1.465 1.755C4.121 11.332 5.88 12.5 8 12.5c1.172 0 2.274-.213 3.25-.59l-1.633-1.633a5.955 5.955 0 0 1-.806.208 3.5 3.5 0 0 1-4.004-4.004c.036-.282.106-.554.208-.806l-1.633-1.633z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
            </span>
          </div>
        </div>
        <div v-if="!isAdminSignup" class="mb-4">
          <label class="form-label fw-bold text-success">bKash Transaction ID (TrxID)</label>
          <input type="text" class="form-control border-success" v-model="form.trxId" required placeholder="e.g. 8AB7CDEF9X" />
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3 rounded-pill fw-semibold">
          {{ isAdminSignup ? 'Create Admin Account' : 'Sign Up & Confirm Payment' }}
        </button>
        <div class="text-center">
          Already have an account? <router-link to="/login">Login here</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAdminSignup = ref(false)

const planPrice = ref(500)
const planName = ref('Monthly Subscription')

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  trxId: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/check-admin`)
    const data = await response.json()
    if (!data.adminExists) {
      isAdminSignup.value = true
    }
  } catch (error) {
    console.error('Error checking admin status', error)
  }
  
  if (!isAdminSignup.value) {
    try {
      const planRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/plans`)
      const planData = await planRes.json()
      if (planData.success && planData.data && planData.data.length > 0) {
        planPrice.value = planData.data[0].price
        planName.value = planData.data[0].name
      }
    } catch (error) {
      console.error('Error fetching plans', error)
    }
  }
})

const handleSignup = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  const isApproved = isAdminSignup.value ? true : false;
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        trxId: form.value.trxId,
        isApproved: isApproved,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || 'Failed to create account');
      return;
    }

    if (isAdminSignup.value) {
      localStorage.setItem('adminExists', 'true')
      localStorage.setItem('adminEmail', form.value.email)
      alert('Admin account created successfully!')
    } else {
      alert(`Registration submitted! Your TrxID ${form.value.trxId} is pending admin approval.`)
    }
    
    router.push('/login')
  } catch (error) {
    alert('An error occurred while connecting to the server.');
    console.error(error);
  }
}
</script>

<style scoped>
</style>
