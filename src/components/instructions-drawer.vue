<template>
  <!-- Overlay -->
  <div v-if="modelValue" class="overlay" @click.self="close">
    <!-- Bottom Sheet -->
    <div class="drawer">
      <!-- Header -->
      <header class="drawer-header">
        <h2>Instructions</h2>
        <button class="close-btn" @click="close">✕</button>
      </header>

      <!-- Timeline -->
      <div class="timeline">
        <div
          v-for="(item, index) in instructions"
          :key="index"
          class="timeline-item"
        >
          <span>•</span>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  modelValue: boolean;
  instructions: string[];
}>();

// Emits
const emit = defineEmits(["update:modelValue"]);

// Close overlay
function close() {
  emit("update:modelValue", false);
}
</script>

<style scoped>
/* Fullscreen dark overlay */
.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
}

/* Bottom sheet container */
.drawer {
  width: 100%;

  border-top: 2px solid var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--rp-surface);

  padding: 0 var(--radius);

  padding-bottom: 20vh;

  height: fit-content;
  max-height: 60vh;
}

/* Header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--radius);
}

.close-btn {
  background: none;
  border: none;
  color: var(--rp-subtle);
  font-size: 22px;
  cursor: pointer;
  transition: color var(--transition);
}

.close-btn:hover {
  color: var(--rp-text);
}

/* Timeline container */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

/* Timeline item wrapper */
.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}

/* Text */
.timeline p {
  color: var(--rp-subtle);
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  text-align: justify;
}
</style>
