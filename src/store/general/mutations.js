export default {
  UPDATE_AUTH_STATUS: (state, status) => {
    state.authorized = status;
  },

  UPDATE_FILE_PROGRESS: (state, payload) => {
    state.file = payload;
  },

  UPDATE_ALL_FILES_PROGRESS: (state, { id, files }) => {
    //ADD NEW FILES OR REPLACE EXISTING ONES WITH ITS UPDATED STATE
    const new_files_index = state.all_files.findIndex((file) => file.id === id);

    if (new_files_index === -1) {
      state.all_files.push({
        id,
        files,
      });
    } else {
      state.all_files.splice(new_files_index, 1, { id, files });
    }
  },

  REMOVE_UPLOADED_FILE: (state, { id, index }) => {
    const file_index = state.all_files.findIndex((file) => file.id === id);

    if (file_index !== -1) {
      if (state.all_files[file_index]?.files?.length === 1) {
        state.all_files.splice(file_index, 1);
        return;
      }
      state.all_files[file_index].files.splice(index, 1);
    }
  },

  UPDATE_TOUR_FLOW: (state, count) => {
    state.tour.count = count;
    state.tour.ongoing = count > 0 && count <= state.tour.total ? true : false;
  },

  END_TOUR_FLOW: (state) => {
    state.tour.ongoing = false;
  },
};
