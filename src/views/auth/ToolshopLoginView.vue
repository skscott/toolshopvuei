<script setup lang="ts">
import AppleWidget from '@/components/auth/AppleWidget.vue';
import GoogleWidget from '@/components/auth/GoogleWidget.vue';
import Logo from '@/components/landing/LogoWidget.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Use axios or another HTTP client

const router = useRouter();
const email = ref('');
const remember = ref(false);
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
const url = `${baseApiUrl}/api/authenticate/`;

const login = async () => {
    try {
        const response = await axios.post(url, {
            username: email.value,
            password: password.value
        });

        // Assuming the API returns a token
        if (response.data.token) {
            localStorage.setItem('token', response.data.token); // Store the token
            router.push('/dashboard'); // Redirect to home/dashboard
        }
    } catch (error) {
        errorMessage.value = 'Invalid username or password';
        console.error(error);
    }
};

</script>

<template>
    <section class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto">
        <div class="flex w-full h-full justify-center gap-12">
            <div class="flex flex-col py-20 lg:min-w-[30rem]">
                <router-link to="/" class="flex items-center justify-center lg:justify-start mb-8">
                    <Logo />
                </router-link>
                <div class="flex flex-col justify-center flex-grow">
                    <div class="max-w-md mx-auto w-full">
                        <h5 class="title-h5 text-center lg:text-left">Login</h5>
                        <p class="body-small mt-3.5 text-center lg:text-left">Please enter your details</p>

                        <!-- OAuth Buttons -->
                        <button class="button-button mt-8"><GoogleWidget /> Sign in with Google</button>
                        <button class="button-button mt-4"><AppleWidget /> Sign in with Apple</button>

                        <div class="flex items-center gap-3.5 my-7">
                            <span class="flex-1 h-[1px] bg-surface-200 dark:bg-surface-800" />
                            <span class="body-small text-surface-400 dark:text-surface-600">or</span>
                            <span class="flex-1 h-[1px] bg-surface-200 dark:bg-surface-800" />
                        </div>

                        <!-- No Form, Just Input Fields -->
                        <InputText type="text" v-model="email" class="w-full" placeholder="Email" />
                        <InputText type="password" v-model="password" class="w-full mt-4" placeholder="Password" />

                        <div class="my-8 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <Checkbox inputId="remember" v-model="remember" :binary="true" />
                                <label for="remember" class="body-small">Remember me</label>
                            </div>
                            <router-link to="/auth/forgot-password" class="body-small text-primary-500 hover:underline">Forgot password?</router-link>
                        </div>

                        <!-- Use @click Instead of Form Submit -->
                        <button @click="login" class="body-button w-full">Login</button>

                        <!-- Error Message -->
                        <p v-if="errorMessage" class="text-red-500 text-center mt-2">{{ errorMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
