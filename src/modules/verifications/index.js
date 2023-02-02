const verificationsRoutes = [
  {
    // ====================================
    // VERIFICATIONS ROUTES
    // ====================================
    path: "/verifications",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashVerifications",
        component: () =>
          import(
            /* webpackChunkName: "verifications-module" */
            "@/modules/verifications/pages"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default verificationsRoutes;
