<template>
  <div>
    <div class="top-row mgb-30">
      <div class="page-title">Moderators</div>

      <div class="right-row">
        <button class="btn btn-md btn-primary" @click="toggleUpdateModerators">
          Add moderator
        </button>
      </div>
    </div>

    <ModeratorTable @edit="$emit('edit')" @delete="$emit('delete')" />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_update_moderators">
        <UpdateModeratorModal @closeTriggered="toggleUpdateModerators" />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ModeratorTable from "@/modules/users/components/moderators/moderator-table";
import UpdateModeratorModal from "@/modules/users/components/moderators/update-moderator-modal";

export default {
  name: "Moderators",

  components: {
    ModeratorTable,
    UpdateModeratorModal,
  },

  computed: {
    ...mapGetters({ getModeratorAccessTypes: "users/getModeratorAccessTypes" }),
  },

  watch: {
    "getModeratorAccessTypes.length": {
      async handler(size) {
        if (!size) this.fetchAccessTypes();
      },
      immediate: true,
    },
  },

  data() {
    return {
      show_update_moderators: false,
    };
  },

  methods: {
    ...mapActions({
      fetchModeratorsAccessTypes: "users/fetchModeratorsAccessTypes",
      fetchVesicashModerators: "users/fetchVesicashModerators",
    }),

    toggleUpdateModerators() {
      this.show_update_moderators = !this.show_update_moderators;
    },

    async fetchModerators() {
      await this.fetchVesicashModerators();
    },

    async fetchAccessTypes() {
      this.loading_access = true;
      await this.fetchModeratorsAccessTypes();
      this.loading_access = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-row {
  @include flex-row-between-nowrap;

  .page-title {
    @include breakpoint-down(lg) {
      display: none;
    }
  }
}
</style>
