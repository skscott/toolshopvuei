<script setup>
import LogoWidget from '@/components/landing/LogoWidget.vue';
import { ref } from 'vue';

const password = ref('');
const repeatPassword = ref('');
</script>

<template>
    <section class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto">
        <div class="flex w-full h-full justify-center gap-12">
            <div class="flex flex-col py-20 lg:min-w-[30rem]">
                <router-link to="/" class="flex items-center justify-center lg:justify-start mb-8">
                    <LogoWidget />
                </router-link>
                <div class="flex flex-col justify-center flex-grow">
                    <div class="max-w-md mx-auto w-full">
                        <h5 class="title-h5 text-center lg:text-left">Create a new password</h5>
                        <p class="body-small mt-3.5 text-center lg:text-left">Lorem ipsum dolor sit amet</p>
                        <form>
                            <InputText type="password" v-model="password" class="w-full mt-7" placeholder="Password" />
                            <InputText type="password" v-model="repeatPassword" class="w-full mt-4" placeholder="Repeat Password" />
                            <div class="flex items-center gap-4 mt-8">
                                <button type="submit" class="body-button border border-surface-200 dark:border-surface-800 bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-950 dark:text-surface-0 flex-1">Cancel</button>
                                <button type="submit" class="body-button flex-1">Submit</button>
                            </div>
                        </form>
                        <div class="mt-8 body-small text-center lg:text-left">A problem? <a class="underline cursor-pointer hover:opacity-75 transition-all">Click here</a> and let us help you.</div>
                    </div>
                </div>
                <div class="mt-8 text-center lg:text-start block relative text-surface-400 dark:text-surface-500 text-sm">©{{ new Date().getFullYear() }} PrimeTek</div>
            </div>
            <div class="hidden lg:flex h-full py-20">
                <div class="h-full w-full lg:max-w-[32.5rem] xl:max-w-[60.5rem] mx-auto flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] rounded-3xl border border-surface overflow-hidden">
                    <LazyImageWidget class="w-auto h-full object-contain object-left" src="/demo/images/landing/auth-image.svg" alt="Auth Image" />
                </div>
            </div>
        </div>
    </section>
</template>
