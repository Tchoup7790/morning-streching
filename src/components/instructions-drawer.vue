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
import { gsap } from "gsap";
import { type ComponentPublicInstance, nextTick, ref, watch } from "vue";

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

  gsap.to(drawer.value, {
    y: 50,
    opacity: 0,
    duration: 0.25,
    ease: "power2.in",
    onComplete: () => emit("update:modelValue", false),
  });
}

// Animate when opening
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) return;

    await nextTick();

    if (drawer.value) {
      gsap.fromTo(
        drawer.value,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      );
    }

    const elements = timelineItems.value
      .filter((el): el is Element => el !== null)
      .map((el) => el as HTMLElement);

    if (elements.length) {
      gsap.fromTo(
        elements,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.05,
        },
      );
    }
  },
);
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

  border-top: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-left: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-right: 1px solid
    color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--rp-surface);

  padding: 0 var(--radius);
  padding-bottom: 20vh;

  height: fit-content;
  max-height: 60vh;

  /* Needed for GSAP initial state */
  transform: translateY(0);
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

/* Timeline item */
.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}

/* Old-style dot */
.timeline-item span {
  font-size: 18px;
  color: var(--color-primary);
  opacity: 0.85;
}

/* Text */
.timeline p {
  color: var(--rp-subtle);
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  text-align: justify;
}
</style>
