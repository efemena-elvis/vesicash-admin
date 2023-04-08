import escrowTransactionTabRoutes from "@/modules/users/routes/escrow-transaction-tab-routes";
import userTabRoutes from "@/modules/users/routes/user-tab-routes";

const usersRoutes = [
  {
    // ====================================
    // USER ROUTES
    // ====================================
    path: "/users/manage-users",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashManageUsers",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages"
          ),
        meta: {
          requiresAuth: true,
          name: "Manage Users",
        },
      },
      {
        path: ":userID",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/layouts/user-details-layout"
          ),
        children: [...userTabRoutes],
      },

      ...escrowTransactionTabRoutes,

      {
        path: "/users/moderators",
        name: "VesicashModerators",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/moderators"
          ),
        meta: {
          requiresAuth: true,
          name: "Moderators",
        },
      },
    ],
  },
];

export default usersRoutes;
