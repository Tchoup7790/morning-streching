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
          :ref="(el) => (timelineItems[index] = el)"
        >
          <span>•</span>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, nextTick, ref, watch } from "vue";
import { useSlideAnimation } from "@/composables/use-slide-animation";
import { useStaggerAnimation } from "@/composables/use-stagger-animation";

// Props
const props = defineProps<{
  modelValue: boolean;
  instructions: string[];
}>();

// Emits
const emit = defineEmits(["update:modelValue"]);

// Drawer ref
const drawer = ref<Element | null>(null);

// Timeline refs (Element, pas HTMLElement)
const timelineItems = ref<(Element | ComponentPublicInstance | null)[]>([]);

// Close with exit animation
function close() {
  if (!drawer.value) {
    emit("update:modelValue", false);
    return;
  }

  useSlideAnimation(drawer.value, false, () =>
    emit("update:modelValue", false),
  );
}

// Animate when opening
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) return;
    await nextTick();

    if (drawer.value) useSlideAnimation(drawer.value, true);

    useStaggerAnimation(".drawer-header > *, .timeline > *");
  },
);
</script>

<style scoped>
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
  width: 100%;

  border-top: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-left: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-right: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--rp-surface);

  padding: 0 var(--radius);
  padding-bottom: 5vh;

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
  cursor: pointer;
  transition: color var(--transition);
}

.close-btn:hover {
  color: var(--rp-text);
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
