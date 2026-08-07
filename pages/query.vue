<script setup lang="ts">
import { BookOpen, Database, Play } from '@lucide/vue'

interface QueryResponse {
  columns: string[]
  rows: unknown[][]
  rowCount: number
  durationMs: number
  executedSql: string
}

const examples = [
  {
    label: 'Employee overview',
    sql: `SELECT
  e.employee_id,
  e.full_name,
  e.job_title,
  s.site_name,
  st.seat_code,
  sal.salary_grade
FROM employees e
JOIN sites s ON e.site_id = s.site_id
JOIN seating st ON e.seating_id = st.seating_id
JOIN salaries sal ON e.salary_id = sal.salary_id
ORDER BY e.employee_id;`
  },
  {
    label: 'Devices by employee',
    sql: `SELECT
  e.full_name,
  ed.device_type,
  ed.device_brand,
  ed.serial_number,
  ed.assigned_date
FROM employees e
JOIN employee_devices ed ON e.employee_id = ed.employee_id
ORDER BY e.full_name, ed.device_type;`
  },
  {
    label: 'Employees by site',
    sql: `SELECT
  s.site_name,
  s.city,
  COUNT(e.employee_id) AS employee_count
FROM sites s
LEFT JOIN employees e ON s.site_id = e.site_id
GROUP BY s.site_id, s.site_name, s.city
ORDER BY employee_count DESC;`
  }
]

useHead({ title: 'SQL Query' })

const sql = ref(examples[0].sql)
const result = ref<QueryResponse | null>(null)
const pending = ref(false)
const errorMessage = ref('')

async function runQuery() {
  pending.value = true
  errorMessage.value = ''

  try {
    result.value = await $fetch<QueryResponse>('/api/query', {
      method: 'POST',
      body: { sql: sql.value }
    })
  } catch (error: any) {
    result.value = null
    errorMessage.value = error?.data?.statusMessage || error?.message || 'The query could not be executed.'
  } finally {
    pending.value = false
  }
}

function selectExample(exampleSql: string) {
  sql.value = exampleSql
  result.value = null
  errorMessage.value = ''
}

function formatCell(value: unknown) {
  if (value === null) return 'NULL'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<template>
  <div>
    <section class="mini-hero">
      <div class="container">
        <div class="eyebrow">Page 1</div>
        <h1>SQL Query Console</h1>
        <p>Inspect the sample MySQL database with read-only statements and review the result in a responsive table.</p>
      </div>
    </section>

    <section class="section-block">
      <div class="container workspace-grid">
        <div class="workspace-main">
          <form class="panel query-panel" aria-labelledby="query-heading" @submit.prevent="runQuery">
            <div class="panel-heading-row">
              <div>
                <div class="eyebrow">Read-only Workspace</div>
                <h2 id="query-heading">Write a SQL statement</h2>
              </div>
              <span class="badge">SELECT only</span>
            </div>

            <label for="sql-editor">SQL statement</label>
            <textarea
              id="sql-editor"
              v-model="sql"
              class="sql-editor"
              rows="12"
              spellcheck="false"
              required
            />
            <div class="form-actions">
              <button class="btn btn-primary" type="submit" :disabled="pending">
                <Play :size="16" :stroke-width="2.2" aria-hidden="true" />
                {{ pending ? 'Running query…' : 'Run Query' }}
              </button>
            </div>
          </form>

          <section class="panel result-panel" aria-labelledby="result-heading" :aria-busy="pending">
            <div class="panel-heading-row">
              <div>
                <div class="eyebrow">Result</div>
                <h2 id="result-heading">Query output</h2>
              </div>
              <span v-if="result" class="result-meta">{{ result.rowCount }} rows · {{ result.durationMs }} ms</span>
            </div>

            <div v-if="errorMessage" class="status-message status-message--error" role="alert">
              {{ errorMessage }}
            </div>
            <div v-else-if="!result" class="empty-state">
              <Database :size="40" :stroke-width="1.5" aria-hidden="true" />
              <p>Run a query to display database rows here.</p>
            </div>
            <div v-else-if="result.rows.length === 0" class="empty-state">
              <Database :size="40" :stroke-width="1.5" aria-hidden="true" />
              <p>The query completed successfully and returned no rows.</p>
            </div>
            <div v-else class="table-scroll" tabindex="0" aria-label="Scrollable query results">
              <table>
                <thead>
                  <tr>
                    <th v-for="column in result.columns" :key="column" scope="col">{{ column }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in result.rows" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                      {{ formatCell(cell) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="workspace-side">
          <section class="panel" aria-labelledby="examples-heading">
            <BookOpen :size="24" :stroke-width="1.5" aria-hidden="true" />
            <h2 id="examples-heading">Example queries</h2>
            <p>Select an example to place it in the editor.</p>
            <div class="example-list">
              <button
                v-for="example in examples"
                :key="example.label"
                type="button"
                @click="selectExample(example.sql)"
              >
                {{ example.label }}
              </button>
            </div>
          </section>

          <section id="query-policy" class="panel policy-panel" aria-labelledby="policy-heading">
            <h2 id="policy-heading">Query policy</h2>
            <p>The console accepts SELECT, SHOW, DESCRIBE, and EXPLAIN. Multiple statements and write operations are rejected.</p>
            <p>SELECT results are limited to 200 rows, and each request has a five-second timeout.</p>
          </section>
        </aside>
      </div>
    </section>
  </div>
</template>
