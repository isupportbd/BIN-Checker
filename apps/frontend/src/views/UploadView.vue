<template>
  <DashboardLayout>
    <div class="container-fluid py-2">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Upload Data</h2>
          <p class="text-muted mb-0">Upload BIN Data (Excel)</p>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0">
        <div class="card-body p-4">
          <h5 class="card-title fw-bold text-primary mb-3">Select File</h5>
          <div class="mb-3 input-group shadow-sm" style="border-radius: 50rem;">
            <label for="fileUpload" class="input-group-text btn btn-primary bg-gradient px-4 py-2" :class="{ 'disabled': isSaving }" style="cursor: pointer; border-top-left-radius: 50rem; border-bottom-left-radius: 50rem; border: none; z-index: 2;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2 mb-1" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              Choose Excel File
            </label>
            <div class="form-control bg-light px-4 py-2 text-muted fw-medium d-flex align-items-center" style="border-top-right-radius: 50rem; border-bottom-right-radius: 50rem;" :class="{ 'bg-secondary bg-opacity-10': isSaving }">
              {{ selectedFileName || 'No file chosen' }}
            </div>
            <input id="fileUpload" class="d-none" type="file" accept=".xlsx, .xls, .csv" @change="handleFileUpload" :disabled="isSaving">
          </div>
          <p class="text-muted small m-0">Only specific columns will be extracted: BIN Issue Date, Circle, BIN, Name, Factory Address, Police Station, District, Mobile Number, Email, Registered HQ Address, Major Area of Economic Activity, Areas of Manufacturing, Areas of Service, BIN Status.</p>
        </div>
      </div>

      <div class="card shadow-sm border-0" v-if="parsedData.length > 0">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="card-title fw-bold text-primary m-0">Uploaded Data Preview</h5>
            <button class="btn btn-success rounded-pill px-4 fw-medium d-flex align-items-center" @click="confirmSave" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isSaving ? 'Saving Data...' : 'Confirm & Save' }}
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col" v-for="col in targetColumns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in paginatedData" :key="index">
                  <th scope="row" class="text-muted">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                  <td v-for="col in targetColumns" :key="col">{{ row[col] || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="d-flex justify-content-between align-items-center mt-3" v-if="totalPages > 1">
            <span class="text-muted small">Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, parsedData.length) }} of {{ parsedData.length }} entries</span>
            <nav aria-label="Table navigation">
              <ul class="pagination pagination-sm m-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">Previous</button>
                </li>
                <li class="page-item disabled">
                  <span class="page-link">Page {{ currentPage }} of {{ totalPages }}</span>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import DashboardLayout from '../components/DashboardLayout.vue'

const router = useRouter()
const parsedData = ref<any[]>([])
const selectedFileName = ref('')
const isSaving = ref(false)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 15

const totalPages = computed(() => {
  return Math.ceil(parsedData.value.length / itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return parsedData.value.slice(start, end)
})

onMounted(() => {
  const role = localStorage.getItem('userRole')
  if (!role || role.toLowerCase() === 'admin') {
    // Only normal users should be here (though admin could technically if they had the link, but let's redirect admins to dashboard)
    // Wait, admins might want to upload data? Currently UI was for non-admins only.
    // So let's redirect if admin.
    if (role?.toLowerCase() === 'admin') {
      router.push('/dashboard')
    }
  }
})

// Columns to extract based on user request
const targetColumns = [
  'BIN Issue Date',
  'Circle',
  'BIN',
  'Name',
  'Factory / Business Operation Address',
  'Police Station',
  'Mobile Number',
  'nandi361291@gmail.com', // As specified by user, probably meant Email
  'Registered HQ Address',
  'Major Area of Economic Activity',
  'Areas of Manufacturing',
  'Areas of Service',
  'Forced Registration'
]

const handleFileUpload = (event: any) => {
  const file = event.target.files[0]
  if (!file) {
    selectedFileName.value = ''
    return
  }
  
  selectedFileName.value = file.name
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target?.result
    const workbook = XLSX.read(data, { type: 'binary' })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) return
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) return
    
    // Parse sheet to JSON array, using raw: false to keep formatted dates (e.g. 18/09/2019)
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false }) as any[]
    
    // Helper to find a matching key in a row object, ignoring case and spaces
    const findKey = (row: any, target: string) => {
      const targetLower = target.toLowerCase().trim();
      const keys = Object.keys(row);
      for (const k of keys) {
        if (k.toLowerCase().trim() === targetLower) return row[k];
      }
      return null;
    };

    // Filter and map to only include target columns
    const filteredData = jsonData
      .filter(row => {
        // Only include active BIN status
        const status = findKey(row, 'BIN Status') || '';
        return String(status).trim().toLowerCase() === 'active';
      })
      .map(row => {
        const newRow: any = {}
        targetColumns.forEach(col => {
          if (col === 'Factory / Business Operation Address') {
            // Combine Address, Police Station, and District
            const addressParts = [
              findKey(row, 'Factory / Business Operation Address') || findKey(row, 'Factory Address'),
              findKey(row, 'Police Station'),
              findKey(row, 'District')
            ].filter(part => part && String(part).trim() !== '')
            
            newRow[col] = addressParts.join(', ')
          } else if (col === 'nandi361291@gmail.com') {
            newRow[col] = findKey(row, 'nandi361291@gmail.com') || findKey(row, 'Email') || findKey(row, 'e-mail') || '';
          } else {
            newRow[col] = findKey(row, col) || ''
          }
        })
        return newRow
      })

    parsedData.value = filteredData
    currentPage.value = 1 // Reset to first page on new upload
  }
  
  reader.readAsBinaryString(file)
}

const confirmSave = async () => {
  if (parsedData.value.length === 0) return;
  
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('User session not found. Please log in again.');
    return;
  }

  isSaving.value = true;

  try {
    const response = await fetch('https://api.isupportbd.com/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        userId: parseInt(userId),
        data: parsedData.value
      })
    });
    
    const result = await response.json();
    if (result.success) {
      alert(result.message);
      parsedData.value = []; // clear the data
      selectedFileName.value = ''; // Reset file name
    } else {
      alert('Failed to save data: ' + result.error);
    }
  } catch (error) {
    console.error('Error saving data:', error);
    alert('An error occurred while saving the data.');
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
th {
  white-space: nowrap;
}
</style>
