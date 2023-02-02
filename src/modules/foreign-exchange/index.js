const fxRoutes = [
  {
    // ====================================
    // FX ROUTES
    // ====================================
    path: "/foreign-exchange",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashFX",
        component: () =>
          import(
            /* webpackChunkName: "fx-module" */
            "@/modules/foreign-exchange/pages"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default fxRoutes;
