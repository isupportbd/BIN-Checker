<template>
  <div class="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
    <div class="p-5 mb-4 bg-white rounded-3 shadow-lg" style="max-width: 800px;">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold text-primary mb-4">BIN Checker System</h1>
        <p class="col-md-12 fs-5 mb-4">
          A powerful and seamless platform for uploading and managing your Business Identification Number (BIN) records. 
          Get comprehensive filtering, fast data processing, and simple Excel sheet uploads.
        </p>
        <div v-if="planPrice !== null" class="alert alert-success fs-4 fw-semibold shadow-sm mb-5" role="alert">
          Subscription Plan: Only {{ planPrice }} BDT / month
        </div>
        <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <router-link to="/signup" class="btn btn-primary btn-lg px-4 gap-3 shadow-sm rounded-pill">Sign Up Now</router-link>
          <router-link to="/login" class="btn btn-outline-secondary btn-lg px-4 shadow-sm rounded-pill">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const planPrice = ref<number | null>(null)

onMounted(async () => {
  try {
    const planRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/plans`)
    const planData = await planRes.json()
    if (planData.success && planData.data && planData.data.length > 0) {
      planPrice.value = planData.data[0].price
    } else {
      planPrice.value = 500 // fallback
    }
  } catch (error) {
    console.error('Error fetching plans', error)
    planPrice.value = 500 // fallback
  }
})
</script>

<style scoped>
</style>
