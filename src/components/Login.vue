<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-900">
    <div class="bg-gray-800 p-8 rounded shadow-md w-96">
      <h1 class="text-white text-2xl mb-6 text-center">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-400" for="email">Email</label>
          <input 
            v-model="email"
            type="text" 
            id="email" 
            required 
            class="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white" 
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-400" for="password">Senha</label>
          <input 
            v-model="password"
            type="password" 
            id="password" 
            required 
            class="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white" 
          />
        </div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <span v-if="isLoading">Carregando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      <p class="text-gray-400 text-center mt-4">
        Não tem uma conta? <a href="/register" class="text-red-400 hover:underline">Registrar</a>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      if (this.email && this.password) {
        this.isLoading = true;
        this.errorMessage = '';
        try {
          const response = await api.post('/auth/login', {
            email: this.email,
            password: this.password
          });

          const token = response.data.token;
          const role = response.data.role;
          const id = response.data.id;
          const expiresIn = response.data.expiresIn || 7200000;

          localStorage.setItem('authToken', token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('tokenExpiration', Date.now() + expiresIn);
          localStorage.setItem('userId', id);

          this.$router.push('/');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.errorMessage = 'Credenciais inválidas. Tente novamente.';
          } else if (error.response && error.response.status === 403) {
            this.errorMessage = 'Erro de autorização. Tente novamente.';
          } else {
            this.errorMessage = error.response?.data?.message || 'Erro de conexão. Verifique sua rede e tente novamente.';
          }
        } finally {
          this.isLoading = false;
        }
      } else {
        this.errorMessage = 'Por favor, preencha todos os campos.';
      }
    }
  }
};
</script>

<style scoped>
label, h1, button {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}
p {
  font-family: 'Arial', sans-serif;
}

body {
  font-family: 'Arial', sans-serif;
}

button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

header {
  background: linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,1));
}

h2 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

input {
  background-color: #333;
  border-color: #444;
}

button {
  background-color: #e50914;
}

button:hover {
  background-color: #b20710;
}

a {
  color: #e50914;
}

a:hover {
  color: #b20710;
}
</style>
