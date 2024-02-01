export default [
  {
    path: "profile",
    name: "UserProfile",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-profile"
      ),
    meta: {
      requiresAuth: true,
      name: "Profile",
    },
  },
  {
    path: "escrow-transaction",
    name: "UserEscrowTransactions",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/layouts/user-escrow-transactions-layout"
      ),
    meta: {
      requiresAuth: true,
      name: "Escrow Transactions",
    },
  },

  {
    path: "wallet-transactions/funding",
    // name: "UserWalletTransactions",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/layouts/user-transactions-layout"
      ),
    meta: {
      requiresAuth: true,
    },

    children: [
      {
        path: "",
        name: "UserWalletFunding",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/wallet-transaction/user-funding"
          ),
        meta: {
          requiresAuth: true,
          name: "Wallet Funding",
        },
      },

      {
        path: "withdrawal",
        name: "UserWalletWithdrawal",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/wallet-transaction/user-withdrawal"
          ),
        meta: {
          requiresAuth: true,
          name: "Wallet Withdrawal",
        },
      },
    ],
  },

  {
    path: "verification",
    name: "UserVerification",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-verification"
      ),
    meta: {
      requiresAuth: true,
      name: "User Verifications",
    },
  },
  {
    path: "exchange-transactions",
    name: "UserExchangeTransactions",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-exchange-transactions"
      ),
    meta: {
      requiresAuth: true,
      name: "User exchange transactions",
    },
  },
  {
    path: "bank-accounts",
    name: "UserBankAccounts",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-bank-accounts"
      ),
    meta: {
      requiresAuth: true,
      name: "User Bank Accounts",
    },
  },

  {
    path: "connected-users",
    name: "UserConnectedUsers",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-connected-users"
      ),
    meta: {
      requiresAuth: true,
      name: "Connected User",
    },
  },

  {
    path: "api",
    name: "UserAPI",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-api"
      ),
    meta: {
      requiresAuth: true,
      name: "User API Keys",
    },
  },

  {
    path: "access",
    name: "UserAccess",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/pages/user-access"
      ),
    meta: {
      requiresAuth: true,
      name: "User Access",
    },
  },
];
