<template>
  <!-- Renders the current route and exposes the component via a slot -->
  <router-view v-slot="{ Component }">
    <!-- Wraps route changes in a transition for smooth page animations -->
    <Transition name="view" mode="out-in">
      <!-- Dynamically renders the active routed component -->
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
