<template>
  <router-view v-slot="{ Component }">
    <Transition name="view" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
