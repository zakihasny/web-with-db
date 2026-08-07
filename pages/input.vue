<script setup lang="ts">
interface Site {
  site_id: number
  site_name: string
  city: string
}

interface Salary {
  salary_id: number
  salary_grade: string
  basic_salary: number
  allowance: number
}

interface Seat {
  seating_id: number
  site_id: number
  floor_number: string
  seat_code: string
}

interface MetaResponse {
  sites: Site[]
  salaries: Salary[]
  seating: Seat[]
}

useHead({ title: 'Add Employee Data' })

const { data: meta, pending: metaPending, error: metaError } = await useFetch<MetaResponse>('/api/meta', {
  default: () => ({ sites: [], salaries: [], seating: [] })
})

const form = reactive({
  fullName: '',
  email: '',
  jobTitle: '',
  hiredDate: '',
  siteId: 0,
  salaryId: 0,
  seatingId: 0
})

const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const filteredSeating = computed(() =>
  meta.value.seating.filter((seat) => seat.site_id === Number(form.siteId))
)

watch(
  () => form.siteId,
  () => {
    if (!filteredSeating.value.some((seat) => seat.seating_id === Number(form.seatingId))) {
      form.seatingId = 0
    }
  }
)

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
})

function resetForm() {
  form.fullName = ''
  form.email = ''
  form.jobTitle = ''
  form.hiredDate = ''
  form.siteId = 0
  form.salaryId = 0
  form.seatingId = 0
}

async function submitEmployee() {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch<{ employeeId: number; message: string }>('/api/employees', {
      method: 'POST',
      body: { ...form }
    })
    successMessage.value = `${response.message} Employee ID: ${response.employeeId}.`
    resetForm()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'The employee could not be added.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <section class="mini-hero">
      <div class="container">
        <div class="eyebrow">Page 2</div>
        <h1>Add Employee Data</h1>
        <p>Create a validated employee record using existing site, salary, and seating relationships.</p>
      </div>
    </section>

    <section class="section-block">
      <div class="container form-layout">
        <form class="panel employee-form" aria-labelledby="employee-form-heading" @submit.prevent="submitEmployee">
          <div class="panel-heading-row">
            <div>
              <div class="eyebrow">New Record</div>
              <h2 id="employee-form-heading">Employee information</h2>
            </div>
          </div>

          <div v-if="metaError" class="status-message status-message--error" role="alert">
            Database options are unavailable. Confirm that MySQL is running and reload the page.
          </div>
          <div v-if="successMessage" class="status-message status-message--success" role="status">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="status-message status-message--error" role="alert">
            {{ errorMessage }}
          </div>

          <div class="form-grid">
            <div class="form-field form-field--wide">
              <label for="full-name">Full name</label>
              <input id="full-name" v-model.trim="form.fullName" type="text" maxlength="120" autocomplete="name" required>
            </div>

            <div class="form-field">
              <label for="email">Email address</label>
              <input id="email" v-model.trim="form.email" type="email" maxlength="120" autocomplete="email" required>
            </div>

            <div class="form-field">
              <label for="job-title">Job title</label>
              <input id="job-title" v-model.trim="form.jobTitle" type="text" maxlength="100" autocomplete="organization-title" required>
            </div>

            <div class="form-field">
              <label for="hired-date">Hired date</label>
              <input id="hired-date" v-model="form.hiredDate" type="date" required>
            </div>

            <div class="form-field">
              <label for="site">Office site</label>
              <select id="site" v-model.number="form.siteId" :disabled="metaPending" required>
                <option :value="0" disabled>Select a site</option>
                <option v-for="site in meta.sites" :key="site.site_id" :value="site.site_id">
                  {{ site.site_name }} · {{ site.city }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label for="salary">Salary grade</label>
              <select id="salary" v-model.number="form.salaryId" :disabled="metaPending" required>
                <option :value="0" disabled>Select a salary grade</option>
                <option v-for="salary in meta.salaries" :key="salary.salary_id" :value="salary.salary_id">
                  {{ salary.salary_grade }} · {{ rupiah.format(salary.basic_salary) }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label for="seating">Seat code</label>
              <select id="seating" v-model.number="form.seatingId" :disabled="!form.siteId || metaPending" required>
                <option :value="0" disabled>Select a seat</option>
                <option v-for="seat in filteredSeating" :key="seat.seating_id" :value="seat.seating_id">
                  {{ seat.seat_code }} · Floor {{ seat.floor_number }}
                </option>
              </select>
              <span class="field-help">Available seats are filtered by the selected office site.</span>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" type="submit" :disabled="submitting || metaPending || Boolean(metaError)">
              {{ submitting ? 'Saving employee…' : 'Add Employee' }}
            </button>
            <button class="btn btn-outline" type="button" :disabled="submitting" @click="resetForm">Clear Form</button>
          </div>
        </form>

        <aside class="panel form-guidance" aria-labelledby="form-guidance-heading">
          <div class="eyebrow">Data Integrity</div>
          <h2 id="form-guidance-heading">Before you submit</h2>
          <ul>
            <li>Email addresses must be unique.</li>
            <li>The selected seat must belong to the selected site.</li>
            <li>All relationships are checked again by the server.</li>
            <li>The form can insert employee records only.</li>
          </ul>
        </aside>
      </div>
    </section>
  </div>
</template>
