<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
    class="update-moderator-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header" v-if="show_access">
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          {{ email ? "Update" : "Add" }} moderator
        </div>
      </div>
    </template>

    <template slot="modal-cover-header" v-else>
      <div class="modal-cover-header" @click="togglePermission">
        <span class="icon icon-caret-left"></span>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body" v-if="show_access">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Email Address</div>
          <BasicInput
            label_id="EmailAddress"
            :input_value="form.email"
            placeholder="Enter email address"
            input_type="email"
            :is_disabled="!!email"
            @getInputState="updateFormState($event, 'email')"
            :error_handler="{
              type: 'email',
              message: 'Enter a valid email address',
            }"
          />
        </div>

        <div class="access-container mgy-30" v-if="loading_access">
          <div class="tertiary-2-text full-width">Access types</div>
          <div
            class="skeleton-loader access-skeleton"
            v-for="i in 9"
            :key="i"
          ></div>
        </div>

        <div class="access-container mgy-30" v-else>
          <div class="tertiary-2-text full-width">Access types</div>
          <label
            class="check-wrapper"
            v-for="(type, index) in access_types"
            :for="type.name + type.id"
            :key="type.id"
          >
            <input
              type="checkbox"
              :id="type.name + type.id"
              :checked="type.selected"
              @change="selectAccessType(index, type)"
            />
            <div class="tertiary-2-text text-capitalize">{{ type.name }}</div>
          </label>
        </div>
      </div>
    </template>

    <template slot="modal-cover-body" v-else>
      <div class="modal-cover-body">
        <div class="d-flex justify-content-between mgt-10 mgb-22">
          <div class="secondary-1-text">Grant Access</div>
          <div class="tertiary-2-text">
            (to <b>{{ form.email }}</b
            >)
          </div>
        </div>

        <div class="permission-conatiner">
          <div
            class="permission-card mgb-20"
            v-for="(access, i) in selected_access_types"
            :key="'access' + i + access.id"
          >
            <div class="primary-2-text text-capitalize mgb-10">
              {{ access.name }}
            </div>
            <div class="permission-row">
              <label
                class="check-wrapper"
                v-for="(permission, j) in access.permissions"
                :for="'permission' + permission.name + permission.id"
                :key="'permission' + permission.name + permission.id"
              >
                <input
                  type="checkbox"
                  :id="'permission' + permission.name + permission.id"
                  :checked="permission.selected"
                  @change="selectPermission(i, j)"
                />
                <div class="tertiary-3-text text-capitalize">
                  {{
                    permission.name
                      ? permission.name.split("_").join(" ")
                      : "--------"
                  }}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-md btn-primary w-100 mgt-15"
          :disabled="disabled || loading_access"
          @click="togglePermission"
          v-if="show_access"
        >
          Continue
        </button>

        <button
          class="btn btn-md btn-primary w-100 mgt-15"
          v-else
          ref="save"
          @click="saveModerator"
        >
          {{ email ? "Update" : "Add" }}
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BasicInput from "@/shared/components/form-comps/basic-input";
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "UpdateModeratorModal",

  components: {
    ModalCover,
    BasicInput,
  },

  props: {
    email: {
      type: String,
      default: "",
    },

    accessIDs: {
      type: Array,
      default: () => [],
    },

    permissionIDs: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters({ getModeratorAccessTypes: "users/getModeratorAccessTypes" }),

    selectedAccessTypes() {
      return [];
      // return [...this.access_types]?.filter((type) => type.selected);
    },

    selectedPermissionIDs() {
      return [...this.selected_access_types]
        ?.map((selection) =>
          selection.permissions
            ?.filter((permission) => permission.selected)
            ?.map((item) => item.id)
        )
        ?.flatMap((item) => item);
    },

    disabled() {
      return this.validity.email || !this.selected_access_types?.length;
    },
  },

  watch: {
    "getModeratorAccessTypes.length": {
      async handler(size) {
        size ? this.saveAccessTypes() : this.fetchAccessTypes();
      },
      immediate: true,
    },

    "access_types.length": {
      handler(size) {
        if (size)
          this.selected_access_types = [...this.access_types].filter(
            (type) => type.selected
          );
      },
      immediate: true,
    },

    email: {
      handler(data) {
        this.form.email = data;
        this.validity.email = !data;
      },
      immediate: true,
    },

    permissionIDs: {
      handler(IDs) {
        this.permission_ids = [...IDs];
      },
      immediate: true,
    },
  },

  data() {
    return {
      loading_access: false,
      access_types: [],
      selected_access_types: [],
      permission_ids: [],
      show_access: true,
      form: {
        email: "",
      },
      validity: {
        email: true,
      },
    };
  },

  methods: {
    ...mapActions({
      fetchModeratorsAccessTypes: "users/fetchModeratorsAccessTypes",
      addModerator: "users/addModerator",
      updateModerator: "users/updateModerator",
      deleteModerator: "users/deleteModerator",
    }),

    async fetchAccessTypes() {
      this.loading_access = true;
      await this.fetchModeratorsAccessTypes();
      this.loading_access = false;
    },

    async saveModerator() {
      const cta = this.email ? "Update" : "Add";
      try {
        this.handleClick("save");
        const action = this.email ? "updateModerator" : "addModerator";

        const payload = {
          email: this.form?.email,
          permission_id: [...this.selectedPermissionIDs],
        };

        const response = await this[action](payload);
        this.handleClick("save", cta, false);
        if (response?.code === 400) {
          if (response?.data?.permission_id?.length)
            this.pushToast(`Select at least one permission`, "warning");
          else if (response?.data?.email?.length)
            this.pushToast(
              `${this.form.email} is not a valid email`,
              "warning"
            );

          return;
        }

        const type = response?.code === 200 ? "success" : "warning";
        this.pushToast(response?.message, type);
        if (type === "success") {
          this.$bus.$emit("refresh-moderators");
          this.$emit("closeTriggered");
        }
      } catch (err) {
        this.handleClick("save", cta, false);
        console.log("ERROR SAVING MODERATOR", err);
        this.pushToast(`Failed to ${cta} moderator`, "error");
      }
    },

    saveAccessTypes() {
      const types = [...this.getModeratorAccessTypes];
      this.access_types = types?.reverse()?.reduce((types, type) => {
        if (type?.permissions?.length) {
          const permissions = this.preSelectPermissions(
            type.permissions,
            this.permissionIDs
          );
          type = {
            ...type,
            permissions,
            selected: !!type?.selected || this.accessIDs.includes(type.id),
          };

          types = [...types, type];
        }

        return types;
      }, []);
    },

    selectAccessType(index, type) {
      this.access_types.splice(index, 1, { ...type, selected: !type.selected });
      this.selected_access_types = [...this.access_types].filter(
        (type) => type.selected
      );
    },

    preSelectPermissions(permissions, IDs) {
      return permissions.map((permission) => ({
        ...permission,
        selected: IDs.includes(permission.id),
      }));
    },

    isPermissionSelected(id) {
      return this.permission_ids.includes(id);
    },

    selectPermission(i, j) {
      this.selected_access_types[i].permissions[j].selected =
        !this.selected_access_types[i]?.permissions[j].selected;
    },

    togglePermission() {
      this.show_access = !this.show_access;
    },
  },
};
</script>

<style lang="scss" scoped>
.permission-conatiner {
  @include custom-scroll-style("grey-100", 0);
  max-height: 55vh;
  overflow-y: auto;
}

.access-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: toRem(20);
}

.access-skeleton {
  height: toRem(20);
}

.check-wrapper {
  @include flex-row-start-nowrap;
  align-items: flex-start;
  gap: 0 toRem(10);
  cursor: pointer;
}

.full-width {
  grid-column: 1/-1;
}

.permission-card {
  border: toRem(1) solid getColor("grey-900");
  padding: toRem(15) toRem(15);

  .permission-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: toRem(18) toRem(12);
  }
}

.icon-caret-left {
  position: relative;
  transform: scale(3.1);
  top: 0.45rem;
  cursor: pointer;
  display: inline-block;
  transition: all ease-in-out 0.3s;

  &:hover {
    color: getColor("grey-600");
  }
}
</style>

<style lang="scss">
.update-moderator-modal.modal-overlay {
  .modal-outer-container {
    top: 2rem;
  }
  input[type="checkbox"]:before {
    top: 16%;
    left: 33%;
  }
  input[type="checkbox"]:after {
    @include draw-shape(19);
    border-radius: toRem(5);
  }

  .permission-row {
    input[type="checkbox"]:before {
      top: 13%;
      left: 30%;
    }
    input[type="checkbox"]:after {
      @include draw-shape(17);
      border-radius: toRem(3);
    }
  }
}
</style>
