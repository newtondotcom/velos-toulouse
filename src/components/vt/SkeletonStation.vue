<script setup lang="ts">
  import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div class="rounded-xl flex flex-row w-full mt-3">
    <div class="flex flex-col w-full cursor-pointer">
      <div class="flex flex-row justify-between">
        <Skeleton class="w-[70vw] md:w-[36vw] h-5 rounded-full" />
      </div>
      <div class="flex flex-row justify-between mt-1">
        <Skeleton class="w-[70vw] md:w-[36vw] h-5 rounded-full" />
      </div>
    </div>
    <div class="flex flex-col justify-center align-middle w-16 px-2">
      <Skeleton class="w-10 h-10" />
    </div>
  </div>
</template>
