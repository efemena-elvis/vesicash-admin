const verificationRoutes = [
  {
    // ====================================
    // VERIFICATION ROUTES
    // ====================================
    path: "/verifications",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "verification-module" */
            "@/modules/verifications/layouts/verification-layout"
          ),
        meta: {
          requiresAuth: true,
        },

        children: [
          {
            name: "BusinessVerification",
            path: "business",
            component: () =>
              import(
                /* webpackChunkName: "verification-module" */
                "@/modules/verifications/pages/business-verification"
              ),
            meta: {
              requiresAuth: true,
              name: "Business Verifications",
            },
          },
          {
            name: "MORVerification",
            path: "mor",
            component: () =>
              import(
                /* webpackChunkName: "verification-module" */
                "@/modules/verifications/pages/mor-verification"
              ),
            meta: {
              requiresAuth: true,
              name: "MOR Verifications",
            },
          },
        ],
      },
    ],
  },
];

export default verificationRoutes;
