<template>
  <!-- Overlay -->
  <div
    v-if="modelValue"
    class="overlay"
    @click.self="close"
    role="dialog"
    aria-modal="true"
    aria-labelledby="instructions-title"
  >
    <!-- Bottom Sheet -->
    <div class="drawer" ref="drawer">
      <!-- Header -->
      <header class="drawer-header">
        <h2>Instructions</h2>
        <button class="close-btn" @click="close" aria-label="Close">✕</button>
      </header>

      <!-- Timeline -->
      <div class="timeline">
        <div
          v-for="(item, index) in instructions"
          :key="index"
          class="timeline-item"
          ref="setItemRef"
        >
          <span>•</span>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useSlide } from "@/composables/use-slide";
import { useStagger } from "@/composables/use-stagger";

// Props
const props = defineProps<{
  modelValue: boolean;
  instructions: string[];
}>();

// Emits
const emit = defineEmits(["update:modelValue"]);

// Drawer ref
const drawer = ref<HTMLElement | null>(null);
const items = ref<HTMLElement[]>([]);

// Collect timeline elements in order
function setItemRef(el: HTMLElement | null) {
  if (el) items.value.push(el);
}

// Close with exit animation
function close() {
  if (!drawer.value) {
    emit("update:modelValue", false);
    return;
  }

  useSlide(drawer.value, false, {
    onComplete: () => emit("update:modelValue", false),
  });
}

// Animate when opening
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) {
      // reset refs for next open
      items.value = [];
      return;
    }

    await nextTick();

    if (drawer.value) useSlide(drawer.value, true);

    // Animate header + each timeline item
    useStagger(".drawer-header > *, .timeline-item", 0.1);
  },
);
</script>

<style lang="css" scoped>
.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
}

.drawer {
  position: relative;
  width: 100%;

  border-top: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-left: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-right: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--rp-base);

  padding: 0 var(--radius);
  padding-bottom: 7vh;

  height: fit-content;
  max-height: 60vh;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--radius);
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--rp-subtle);
  font-size: 22px;
  transition: color var(--transition);
}

.timeline {
  display: flex;
  flex-direction: column;
  color: var(--rp-subtle);
  gap: 26px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.timeline p {
  margin: 0;
  font-size: 12px;
  text-align: justify;
}
</style>
