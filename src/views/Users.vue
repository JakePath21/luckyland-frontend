<template>
    <div class="users-page">
      <h2>All Players</h2>
      <input
        type="text"
        v-model="searchQuery"
        @input="fetchUsers"
        placeholder="Search players by name..."
        class="search-bar"
      />
  
      <div class="users-list">
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
          @click="goToProfile(user.id)"
        >
          <div class="avatar-wrapper">
            <img :src="getAvatarUrl()" alt="Base Avatar" class="avatar-image" />
            <img
              v-for="item in getSortedEquippedItems(user.equipped_items)"
              :key="item.item_id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Item"
              class="equipped-item-overlay"
              :class="getItemClass(item.item_type)"
            />
          </div>
          <h3>{{ user.username }}</h3>
        </div>
      </div>
  
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }}</span>
        <button @click="nextPage" :disabled="!hasMorePages">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const users = ref([]);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const hasMorePages = ref(false);
      const router = useRouter();
  
      // Fetch users and their equipped items
      const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users`, {
                params: { search: searchQuery.value, page: currentPage.value },
                });

                // Filter users that start with the search query (case-insensitive)
                const filteredUsers = response.data.users.filter(user =>
                user.username.toLowerCase().startsWith(searchQuery.value.toLowerCase())
                );

                // Fetch equipped items for each filtered user
                users.value = await Promise.all(
                filteredUsers.map(async (user) => {
                    const equippedResponse = await fetchEquippedItems(user.id);
                    return { ...user, equipped_items: equippedResponse };
                })
                );

                // Sort users by ID in ascending order
                users.value.sort((a, b) => a.id - b.id);

                hasMorePages.value = response.data.hasMorePages;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };


  
      // Fetch equipped items for a user by ID
      const fetchEquippedItems = async (userId) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/catalog/equipped/${userId}`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching equipped items for user ${userId}:`, error);
          return [];
        }
      };
  
      const prevPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
          fetchUsers();
        }
      };
  
      const nextPage = () => {
        if (hasMorePages.value) {
          currentPage.value++;
          fetchUsers();
        }
      };
  
      const goToProfile = (userId) => {
        router.push(`/users/${userId}`);
      };
  
      const getAvatarUrl = (avatar) => (avatar ? `/avatars/${avatar}` : '/src/assets/baseAvatarSpaced.png');
  
      const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/default-item.png');
  
      const itemOrder = {
        back: 1,
        pants: 2,
        shirt: 3,
        hair: 4,
        hat: 5,
        package: 6,
        front: 7,
      };
  
      const getSortedEquippedItems = (equippedItems) => {
        return Array.isArray(equippedItems)
          ? equippedItems.slice().sort((a, b) => itemOrder[a.item_type] - itemOrder[b.item_type])
          : [];
      };
  
      const getItemClass = (itemType) => `item-${itemType}`;
  
      onMounted(fetchUsers);
  
      return {
        users,
        searchQuery,
        currentPage,
        hasMorePages,
        fetchUsers,
        prevPage,
        nextPage,
        goToProfile,
        getAvatarUrl,
        getImageUrl,
        getSortedEquippedItems,
        getItemClass,
      };
    },
  };
  </script>
  
  <style scoped>
  .users-page {
    color: #fff;
    padding: 2em;
    text-align: center;
  }
  
  .search-bar {
    padding: 0.75em;
    width: 100%;
    max-width: 400px;
    margin: 1em auto;
    border: none;
    border-radius: 4px;
    font-size: 1em;
  }
  
  .users-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
    justify-content: center;
  }
  
  .user-card {
    background-color: #333;
    padding: 1em;
    border-radius: 8px;
    text-align: center;
    width: 200px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .user-card:hover {
    background-color: #444;
  }
  
  .avatar-wrapper {
    position: relative;
    width: 100px;
    height: 130px;
    margin: 0 auto 1em;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 1;
  }
  
  .equipped-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  /* Layering for each item type */
  .item-back {
    z-index: 0;
  }
  
  .item-pants {
    z-index: 2;
  }
  
  .item-shirt {
    z-index: 3;
  }
  
  .item-hair {
    z-index: 4;
  }
  
  .item-hat {
    z-index: 5;
  }
  
  .item-package {
    z-index: 6;
  }
  
  .item-front {
    z-index: 7;
  }
  
  /* Pagination Styles */
  .pagination {
    margin-top: 1em;
  }
  
  .pagination button {
    background-color: #42b983;
    color: #fff;
    padding: 0.5em 1em;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 0.5em;
  }
  
  .pagination button:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
  </style>
  