export default {
  SAVE_CHARGES: (state, { data, key }) =>
    (state.charges = { ...state.charges, [key]: data }),

  SAVE_CHARGE_RANGES: (state, ranges) => (state.charge_ranges = ranges),
};
