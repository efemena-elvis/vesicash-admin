export default [
  {
    path: ":transactionID",
    name: "EscrowTransactionDetails",
    component: () =>
      import(
        /* webpackChunkName: "escrow-module" */
        "@/modules/users/layouts/user-escrow-transaction-layout"
      ),
    meta: {
      requiresAuth: true,
    },

    children: [
      {
        path: "payment-rules",
        name: "EscrowTransactionPaymentRules",
        component: () =>
          import(
            /* webpackChunkName: "escrow-module" */
            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-payment-rules"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Payment Rules",
        },
      },

      {
        path: "payments",
        component: () =>
          import(
            /* webpackChunkName: "escrow-module" */
            "@/modules/users/layouts/user-escrow-transaction-payment-layout"
          ),
        meta: {
          requiresAuth: true,
        },

        children: [
          {
            path: "",
            name: "EscrowTransactionPayments",
            component: () =>
              import(
                /* webpackChunkName: "escrow-module" */
                "@/modules/users/pages/escrow-transaction/user-escrow-transaction-payments"
              ),
            meta: {
              requiresAuth: true,
              name: "Escrow Payments",
            },
          },
          {
            path: "disbursements",
            name: "EscrowTransactionDisbursements",
            component: () =>
              import(
                /* webpackChunkName: "escrow-module" */
                "@/modules/users/pages/escrow-transaction/user-escrow-transaction-disbursements"
              ),
            meta: {
              requiresAuth: true,
              name: "Escrow Disbursements",
            },
          },
        ],
      },

      {
        path: "parties",
        name: "EscrowTransactionParties",
        component: () =>
          import(
            /* webpackChunkName: "escrow-module" */
            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-parties"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Parties",
        },
      },

      {
        path: "activity",
        name: "EscrowTransactionActivity",
        component: () =>
          import(
            /* webpackChunkName: "escrow-module" */
            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-activity"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Activities",
        },
      },
    ],
  },
];
