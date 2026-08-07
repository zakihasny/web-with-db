<script setup lang="ts">
interface Summary {
  sites: number
  employees: number
  devices: number
}

useHead({ title: 'Testing Website With Database' })

const { data: summary, error } = await useFetch<Summary>('/api/summary')
</script>

<template>
  <div>
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">Employee Database Lab</div>
          <h1>
            <span class="hero-primary-line">Testing Website</span>
            <span>With Database</span>
          </h1>
          <p class="hero-lead">
            Explore the sample employee database through a protected SQL console, then add validated records through a guided form.
          </p>
          <div class="hero-actions">
            <NuxtLink class="btn btn-primary btn-lg" to="/query">
              Run SQL Query
            </NuxtLink>
            <NuxtLink class="btn btn-outline btn-lg" to="/input">Add Employee</NuxtLink>
          </div>
          <div class="trust-row" aria-label="Application facts">
            <span>5 relational tables</span>
            <span>200-row query limit</span>
            <span>MySQL 8.4</span>
          </div>
        </div>

        <aside class="summary-panel" aria-labelledby="summary-heading">
          <div class="summary-heading-row">
            <div>
              <div class="eyebrow">Live Database</div>
              <h2 id="summary-heading">Sample data summary</h2>
            </div>
          </div>
          <div v-if="error" class="status-message status-message--warning">
            Start MySQL to display live record counts.
          </div>
          <dl class="summary-list">
            <div>
              <dt>Employees</dt>
              <dd>{{ summary?.employees ?? '—' }}</dd>
            </div>
            <div>
              <dt>Sites</dt>
              <dd>{{ summary?.sites ?? '—' }}</dd>
            </div>
            <div>
              <dt>Assigned devices</dt>
              <dd>{{ summary?.devices ?? '—' }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>

    <section id="schema" class="section-block section-block--neutral">
      <div class="container">
        <div class="section-heading">
          <div class="eyebrow">Database Workflow</div>
          <h2>Two focused ways to work with the data</h2>
          <p>Use SQL when you need flexible analysis. Use the form when you need a safe, structured insert.</p>
        </div>

        <div class="product-grid">
          <article class="product-card">
            <h3>Page 1 · SQL Query</h3>
            <p>Run SELECT, SHOW, DESCRIBE, and EXPLAIN statements against the employee schema.</p>
            <NuxtLink class="product-card__cta" to="/query">
              Open SQL Query
            </NuxtLink>
          </article>

          <article class="product-card">
            <h3>Page 2 · Add Data</h3>
            <p>Create an employee record with validated site, salary grade, seating, and employment details.</p>
            <NuxtLink class="product-card__cta" to="/input">
              Open Data Form
            </NuxtLink>
          </article>

          <article class="product-card">
            <h3>Relational Schema</h3>
            <p>The sample connects employees to sites, salary grades, seating positions, and assigned devices.</p>
            <NuxtLink class="product-card__cta" to="/query">
              Explore the Schema
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
