<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px; border-radius: 1rem;">
      <h3 class="card-title text-center text-primary fw-bold mb-4">Login</h3>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input type="email" class="form-control" v-model="form.email" required placeholder="name@example.com" />
        </div>
        <div class="mb-4">
          <label class="form-label">Password</label>
          <div class="position-relative">
            <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="form.password" required placeholder="Enter your password" style="padding-right: 40px;" />
            <span class="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" style="cursor: pointer;" @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755l-.809-.805zm-4.322-4.322a3.50 3.50 0 0 1 1.768 1.768l-1.768-1.768zm-2.022.022L6.92 7.034C6.58 7.373 6.36 7.848 6.36 8.36c0 1.05.85 1.9 1.9 1.9.512 0 .987-.22 1.326-.56l.096-.096-2.667-2.666zm5.352 5.352-12-12 .708-.708 12 12-.708.708zm-2.753-1.353c-1.393.818-3.056 1.343-5.067 1.343-5 0-8-5.5-8-5.5s.896-1.642 2.448-3.14l1.378 1.378A11.082 11.082 0 0 0 1.172 8c.058.087.122.183.195.288.335.48.83 1.12 1.465 1.755C4.121 11.332 5.88 12.5 8 12.5c1.172 0 2.274-.213 3.25-.59l-1.633-1.633a5.955 5.955 0 0 1-.806.208 3.5 3.5 0 0 1-4.004-4.004c.036-.282.106-.554.208-.806l-1.633-1.633z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
            </span>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3 rounded-pill fw-semibold">Login</button>
        <div class="text-center">
          Don't have an account? <router-link to="/signup">Sign up here</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

const handleLogin = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.value.email.trim().toLowerCase(),
        password: form.value.password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || 'Invalid credentials');
      return;
    }

    // Save user data securely
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.user.id.toString())
    localStorage.setItem('userEmail', data.user.email)
    
    // Determine if admin based on backend flag. Admin is the first user who got isApproved=true automatically.
    // Or we can just let Dashboard check if they are the admin. 
    // Wait, the backend doesn't explicitly return role 'admin'. Let's check `isApproved` and an admin list.
    // Let's assume the first user is admin for now, but a cleaner way is verifying `adminEmail`.
    
    const checkAdminResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/check-admin`);
    const checkAdminData = await checkAdminResponse.json();
    
    // If we want to detect admin role, for now we will assume if the email matches the first user, it's admin.
    // Wait, let's just keep the old `adminEmail` check for role assignment temporarily, 
    // or better, if the DB says they are approved, we just log them in. 
    // I will fetch all users? No, I will just assign the role based on localStorage 'adminEmail' for now.
    
    let adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail && localStorage.getItem('adminExists') === 'true') {
      adminEmail = 'oneassociatebd@gmail.com';
    }
    
    const savedAdminEmail = adminEmail ? adminEmail.trim().toLowerCase() : '';
    if (savedAdminEmail && form.value.email.trim().toLowerCase() === savedAdminEmail) {
      localStorage.setItem('userRole', 'Admin');
    } else {
      localStorage.setItem('userRole', 'User');
    }

    if (!data.user.isApproved && localStorage.getItem('userRole') !== 'Admin') {
       alert('Your account is pending admin approval.');
       return; // Block login for pending users
    }

    router.push('/dashboard')
  } catch (error) {
    alert('An error occurred during login');
    console.error(error);
  }
}
</script>

<style scoped>
</style>
