const pricingRoutes = [
  {
    // ====================================
    // PRICING ROUTES
    // ====================================
    path: "/pricing",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "pricing-module" */
            "@/modules/pricing/layouts/pricing-layout"
          ),
        meta: {
          requiresAuth: true,
        },

        children: [
          {
            name: "WalletFundingPricing",
            path: "wallet-funding",
            component: () =>
              import(
                /* webpackChunkName: "pricing-module" */
                "@/modules/pricing/pages/funding-pricing-page"
              ),
            meta: {
              requiresAuth: true,
              name: "Wallet Funding Pricing",
            },
          },
          {
            name: "WalletWithdrawalPricing",
            path: "wallet-withdrawal",
            component: () =>
              import(
                /* webpackChunkName: "pricing-module" */
                "@/modules/pricing/pages/withdrawal-pricing-page"
              ),
            meta: {
              requiresAuth: true,
              name: "Wallet Withdrawal Pricing",
            },
          },
          {
            name: "MORPricing",
            path: "mor",
            component: () =>
              import(
                /* webpackChunkName: "pricing-module" */
                "@/modules/pricing/pages/mor-pricing-page"
              ),
            meta: {
              requiresAuth: true,
              name: "MOR Pricing",
            },
          },
          {
            name: "MORWithdrawalPricing",
            path: "mor-withdrawal",
            component: () =>
              import(
                /* webpackChunkName: "pricing-module" */
                "@/modules/pricing/pages/mor-withdrawal-pricing-page"
              ),
            meta: {
              requiresAuth: true,
              name: "Wallet Withdrawal Pricing",
            },
          },
          {
            name: "EscrowPricing",
            path: "escrow",
            component: () =>
              import(
                /* webpackChunkName: "pricing-module" */
                "@/modules/pricing/pages/escrow-pricing-page"
              ),
            meta: {
              requiresAuth: true,
              name: "Escrow Pricing",
            },
          },
          {
            name: "WireTransfer",
            path: "wire-transfer",
            component: () =>
              import(
                /* webpackChunkName: "pricing-module" */
                "@/modules/pricing/pages/wire-transfer-page"
              ),
            meta: {
              requiresAuth: true,
              name: "Wire Transfer",
            },
          },
        ],
      },
    ],
  },
];

export default pricingRoutes;
