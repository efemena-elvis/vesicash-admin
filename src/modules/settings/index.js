const SettingsRoutes = [
  {
    // ====================================
    // SETTINGS ROUTES
    // ====================================
    path: "/settings",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashSettings",
        component: () =>
          import(
            /* webpackChunkName: "settings-module" */
            "@/modules/settings/pages"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default SettingsRoutes;
