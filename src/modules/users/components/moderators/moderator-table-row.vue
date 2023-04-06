<template>
  <tr @click="toggleUpdateModal">
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ data.email_address }}
    </td>

    <td
      class="body-data moderator-access-row text-capitalize"
      :class="`${table_name}-3`"
    >
      {{ accessTypesStringValues }}
    </td>

    <td class="body-data moderator-actions" :class="`${table_name}-4`">
      <button class="btn btn-secondary btn-sm">Edit</button>
      <button
        class="btn btn-alert btn-sm"
        @click.stop="toggleDeleteModal"
        ref="delete"
      >
        Delete
      </button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_update_modal">
        <UpdateModeratorModal
          :email="data.email_address"
          :accessIDs="accessTypesIDs"
          :permissionIDs="permissionIDs"
          @closeTriggered="toggleUpdateModal"
          @refresh="refreshModerators"
        />
      </transition>

      <transition name="fade" v-if="show_delete_modal">
        <DeletePromptModal
          :name="data.email_address"
          @delete="removeModerator"
          @closeTriggered="toggleDeleteModal"
          title="Delete admin"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import { mapActions } from "vuex";
import UpdateModeratorModal from "@/modules/users/components/moderators/update-moderator-modal";
import DeletePromptModal from "@/modules/users/components/users/modals/delete-prompt-modal";
export default {
  name: "ModeratorTableRow",

  components: {
    UpdateModeratorModal,
    DeletePromptModal,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    index: {
      type: Number,
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    accessTypes() {
      return this.data?.permissions?.reduce((access, permission) => {
        if (!access.includes(permission?.access_type?.name))
          access = [...access, permission?.access_type?.name];
        return access;
      }, []);
    },

    accessTypesIDs() {
      return this.data?.permissions?.reduce((access, permission) => {
        if (!access.includes(permission?.access_type?.id))
          access = [...access, permission?.access_type?.id];
        return access;
      }, []);
    },

    accessTypesStringValues() {
      return this.accessTypes ? this.accessTypes?.join(", ") : "----------";
    },

    permissionIDs() {
      return this.data?.permissions?.map((permission) => permission.id);
    },
  },

  data: () => ({
    show_update_modal: false,
    show_delete_modal: false,
  }),

  methods: {
    ...mapActions({ deleteModerator: "users/deleteModerator" }),

    toggleUpdateModal() {
      this.show_update_modal = !this.show_update_modal;
    },

    toggleDeleteModal() {
      this.show_delete_modal = !this.show_delete_modal;
    },

    async removeModerator() {
      this.show_delete_modal = false;
      this.handleClick("delete");
      try {
        const response = await this.deleteModerator({
          email: this.data.email_address,
        });
        this.handleClick("delete", "Delete", false);
        const type = response?.code === 200 ? "success" : "warning";
        this.pushToast(response?.message, type);
        if (type === "success") this.$bus.$emit("refresh-moderators");
      } catch (err) {
        console.log("ERROR DELETING MODERATOR", err);
        this.handleClick("delete", "Delete", false);
        this.pushToast("Failed to delete moderator", "error");
      }
    },

    refreshModerators() {
      this.$emit("refresh");
      this.show_update_modal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.moderator-access-row {
  white-space: normal;
  line-height: 160%;
}

.moderator-actions {
  .btn {
    display: inline-block;
  }
  & > :nth-child(1) {
    margin-right: toRem(15);
  }
}
</style>
