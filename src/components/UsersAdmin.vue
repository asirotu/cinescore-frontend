<template>
  <div class="bg-black min-h-screen flex">
    <aside :class="['bg-gray-900 w-64 p-4 transition-all', isMenuOpen ? 'translate-x-0 block' : '-translate-x-full hidden']">
      <h2 class="text-white text-2xl font-semibold mb-8 text-center">Painel Administrador</h2>
      <ul>
        <li>
          <button
            @click="navigateTo('admin/movies')"
            class="text-white w-full py-2 text-lg hover:bg-gray-700 px-4 rounded border-b-2 border-gray-700"
          >
            Filmes
          </button>
        </li>
        <li>
          <button
            @click="navigateTo('admin/directors')"
            class="text-white w-full py-2 text-lg hover:bg-gray-700 px-4 rounded border-b-2 border-gray-700"
          >
            Diretores
          </button>
        </li>
        <li>
          <button
            @click="navigateTo('admin/users')"
            class="text-white w-full py-2 text-lg hover:bg-gray-700 px-4 rounded border-b-2 border-gray-700"
          >
            Usuários
          </button>
        </li>
        <li>
          <button
            @click="logout()"
            class="text-white w-full py-2 text-lg hover:bg-red-700 px-4 rounded border-b-2 border-gray-700 mt-8"
          >
            Sair
          </button>
        </li>
      </ul>
    </aside>

    <main class="flex-1">
      <header class="bg-black flex justify-between items-center p-6">
        <img
          @click.stop="$router.push('/')"
          class="w-32 object-contain"
          src="../assets/cinescore.jpeg"
          alt="Logo"
        />
        <button @click="toggleMenu" class="text-white font-semibold">
          Menu
        </button>
      </header>
      <div class="flex-1 bg-black text-white p-8">
        <table class="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
          <thead>
            <tr class="bg-gray-700 text-center">
              <th @click="sort('id')" class="cursor-pointer p-4 text-gray-200">ID <span v-if="sortKey === 'id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
              <th @click="sort('username')" class="cursor-pointer p-4 text-gray-200">Usuário <span v-if="sortKey === 'username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
              <th @click="sort('email')" class="cursor-pointer p-4 text-gray-200">E-mail <span v-if="sortKey === 'email'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
              <th @click="sort('phone')" class="cursor-pointer p-4 text-gray-200">Telefone <span v-if="sortKey === 'phone'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
              <th class="p-4 text-gray-200">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in sortedUsers" :key="user.id" class="hover:bg-gray-700">
              <td class="p-4 border-b text-center">{{ user.id }}</td>
              <td class="p-4 border-b text-center">{{ user.username }}</td>
              <td class="p-4 border-b text-center">{{ user.email }}</td>
              <td class="p-4 border-b text-center">{{ user.phone }}</td>
              <td class="p-4 border-b text-center">
                <router-link :to="`/admin/edit/users/${user.id}`"
                  class="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition duration-200">
                  Editar
                </router-link>
                <button @click="confirmRemoveUser(user.id)"
                  class="inline-flex items-center px-4 py-2 ml-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200">
                  Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <confirm-modal
        :isOpen="isModalOpen"
        :onConfirm="removeUser"
        :message="'Deseja realmente remover este usuário?'"
        @close="isModalOpen = false"
      />

      <modal
        :isOpen="isErrorModalOpen"
        :title="'Erro ao remover o usuário'"
        :message="errorMessage"
        @close="isErrorModalOpen = false"
      />
    </main>
  </div>
</template>

<script>
import api from '../api';
import ConfirmModal from './Modal.vue';
import Modal from './ModalConfirm.vue';

export default {
  name: 'UsersList',
  components: {
    ConfirmModal,
    Modal
  },
  data() {
    return {
      users: [],
      sortKey: '',
      sortOrder: 'asc',
      isModalOpen: false,
      userToRemove: null,
      isErrorModalOpen: false,
      errorMessage: '',
      isMenuOpen: false
    };
  },
  created() {
    this.fetchUsers();
  },
  computed: {
    sortedUsers() {
      const usersCopy = [...this.users];
      return usersCopy.sort((a, b) => {
        const modifier = this.sortOrder === 'asc' ? 1 : -1;
        const aValue = a[this.sortKey];
        const bValue = b[this.sortKey];

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return (aValue - bValue) * modifier;
      });
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.get('/users');
        this.users = response.data.content;
      } catch (error) {
        console.error(error);
      }
    },
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    confirmRemoveUser(userId) {
      this.userToRemove = userId;
      this.isModalOpen = true;
    },
    async removeUser() {
      try {
        await api.delete(`/users/${this.userToRemove}`);
        this.users = this.users.filter(user => user.id !== this.userToRemove);
        this.isModalOpen = false;
      } catch (error) {
        this.errorMessage = 'Erro ao remover o usuário. Tente novamente.';
        this.isErrorModalOpen = true;
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
