<template>
  <div class="avatar-page">
    <h2>Your Avatar</h2>

    <div class="avatar-container">
      <!-- Display the Player's Current Avatar with Equipped Items -->
      <div class="current-avatar">
        <div class="avatar-wrapper">
            <!-- Back Items: Positioned behind the avatar -->
            <img
              v-for="item in sortedEquippedItems.filter(item => item.item_type === 'back')"
              :key="item.item_id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Back Item"
              class="equipped-item-overlay back-layer"
            />

            <!-- Base Avatar Image -->
            <img :src="getAvatarUrl()" alt="Base Avatar" class="avatar-image" />

            <!-- Other Items: Positioned in front of the avatar -->
            <img
              v-for="item in sortedEquippedItems.filter(item => item.item_type !== 'back')"
              :key="item.item_id"
              :src="getImageUrl(item.image_url)"
              alt="Equipped Item"
              class="equipped-item-overlay"
              :class="getItemTypeClass(item.item_type)"
            />
          </div>
      </div>

      <!-- Display Owned Items with Equip/Unequip Buttons -->
      <div class="owned-items">
        <h3>Your Owned Items</h3>
        <div v-if="ownedItems.length === 0" class="no-items">
          You don't own any items yet.
        </div>
        <div v-else class="items-grid">
          <div v-for="item in ownedItems" :key="item.item_id" class="item-card">
            <img :src="getImageUrl(item.image_url)" alt="Item Image" class="item-image" />
            <h4>{{ item.name }}</h4>
            <button v-if="isItemEquipped(item.item_id)" @click="toggleEquipItem(item)">Unequip</button>
            <button v-else @click="toggleEquipItem(item)">Equip</button>
          </div>
        </div>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { userStore } from '../store/user';
import { onMounted, ref, computed } from 'vue';

export default {
  setup() {
    const ownedItems = ref([]);
    const equippedItems = ref([]);
    const message = ref('');

    const itemOrder = {
      back: 1,
      pants: 2,
      shirt: 3,
      package: 4,
      hat: 5,
      hair: 6,
      front: 7,
    };

    // Fetch Owned Items
    const fetchOwnedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/catalog/owned/${userStore.id}`);
        ownedItems.value = response.data;
      } catch (error) {
        console.error('Failed to fetch owned items:', error);
        message.value = 'Failed to load owned items.';
      }
    };

    // Fetch Equipped Items
    const fetchEquippedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/catalog/equipped/${userStore.id}`);
        equippedItems.value = response.data;
      } catch (error) {
        console.error('Failed to fetch equipped items:', error);
        message.value = 'Failed to load equipped items.';
      }
    };

    // Check if an item is equipped
    const isItemEquipped = (itemId) => {
      return equippedItems.value.some((item) => item.item_id === itemId);
    };

    // Toggle Equip/Unequip Item with limits per type
    const toggleEquipItem = async (item) => {
        try {
          if (isItemEquipped(item.item_id)) {
            // Unequip Item
            await axios.post('http://localhost:5000/api/catalog/unequip', {
              userId: userStore.id,
              itemId: item.item_id,
            });
            message.value = 'Item unequipped successfully!';
          } else {
            // Ensure item_type is defined
            if (!item.item_type) {
              message.value = 'Item type is undefined. Please try again or contact support.';
              return;
            }

            // Check the number of equipped items of this type
            const itemTypeCount = equippedItems.value.filter(
              (equipped) => equipped.item_type === item.item_type
            ).length;

            if (itemTypeCount >= 1) {
              message.value = `You can only equip one ${item.item_type} at a time.`;
              return;
            }

            // Equip Item
            await axios.post('http://localhost:5000/api/catalog/equip', {
              userId: userStore.id,
              itemId: item.item_id,
              itemType: item.item_type, // Ensure item_type is passed to the backend
            });
            message.value = 'Item equipped successfully!';
          }

          // Refresh owned and equipped items
          await fetchOwnedItems();
          await fetchEquippedItems();
        } catch (error) {
          console.error('Failed to toggle equip/unequip item:', error);
          message.value = 'Failed to change item status.';
        }
      };


    // Sort equipped items based on item type
    const sortedEquippedItems = computed(() => {
      const backItems = equippedItems.value.filter(item => item.item_type === 'back');
      const otherItems = equippedItems.value.filter(item => item.item_type !== 'back')
        .slice()
        .sort((a, b) => itemOrder[a.item_type] - itemOrder[b.item_type]);

      return [...backItems, ...otherItems];
    });


    // Get Base Avatar URL
    const getAvatarUrl = () => '/src/assets/baseAvatarSpaced.png';

    // Get Full Image URL
    const getImageUrl = (imageUrl) => (imageUrl ? `http://localhost:5000${imageUrl}` : '/src/assets/default-item.png');

    // Get CSS class based on item type
    const getItemTypeClass = (itemType) => itemType;

    onMounted(() => {
      fetchOwnedItems();
      fetchEquippedItems();
    });

    return {
      ownedItems,
      equippedItems,
      message,
      toggleEquipItem,
      isItemEquipped,
      getAvatarUrl,
      getImageUrl,
      sortedEquippedItems,
      getItemTypeClass,
    };
  },
};
</script>

<style scoped>
.avatar-page {
  padding: 2em;
  color: #fff;
}

.avatar-container {
  display: flex;
  gap: 2em;
  justify-content: center;
}

/* Avatar display section */
.current-avatar {
  flex: 1;
  text-align: center;
}

/* .avatar-wrapper {
  position: relative;
  width: 300px;
  height: 400px;
  margin: 0 auto;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 2px solid #42b983;
  border-radius: 8px;
}

.equipped-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
} */

.avatar-wrapper {
  position: relative;
  width: 300px;
  height: 400px;
  margin: 0 auto;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 2px solid #42b983;
  border-radius: 8px;
  position: relative;
  z-index: 1; /* Avatar is in the middle layer */
}

.equipped-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* Back items should be behind the avatar */
.back-layer {
  z-index: 0; /* Behind the avatar */
}

/* Other items layering */
.pants {
  z-index: 2;
}

.shirt {
  z-index: 3;
}

.hair {
  z-index: 4;
}

.hat {
  z-index: 5;
}

.package {
  z-index: 6;
}

.front {
  z-index: 7; /* In front of everything */
}

/* Owned items section */
.owned-items {
  flex: 2;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1em;
}

.item-card {
  background-color: #444;
  padding: 1em;
  border-radius: 8px;
  text-align: center;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 0.5em;
}

button {
  background-color: #42b983;
  color: #fff;
  padding: 0.5em;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}

button:hover {
  background-color: #369870;
}

.no-items {
  color: #ff4f4f;
  font-weight: bold;
  text-align: center;
}
</style>
