const navRoutes = [
  {
    id: 1,
    title: "Dashboard",
    slug: "dashboard",
    icon: "DashboardIcon",
    link: "/dashboard",
    show_more: false,
    children: [],
    authorize: ["open"],
  },
  {
    id: 2,
    title: "Users",
    slug: "users",
    icon: "UserIcon",
    link: "",
    show_more: false,
    children: [
      {
        title: "Manage users",
        slug: "manage-users",
        link: "/users/manage-users",
      },
      { title: "Moderators", slug: "moderators", link: "/users/moderators" },
    ],
    authorize: ["open"],
  },
  {
    id: 3,
    title: "Escrow transactions",
    slug: "escrow-transactions",
    icon: "TransactionIcon",
    link: "/escrow-transactions",
    show_more: false,
    children: [],
    authorize: ["open"],
  },
  {
    id: 4,
    title: "Foreign exchange",
    slug: "foreign-exchange",
    icon: "ExchangeIcon",
    link: "/foreign-exchange",
    show_more: false,
    children: [],
    authorize: ["open"],
  },
  {
    id: 5,
    title: "Payments",
    slug: "payments",
    icon: "CreditCardIcon",
    link: "/payments",
    show_more: false,
    children: [],
    authorize: ["open"],
  },
  {
    id: 6,
    title: "API overview",
    slug: "api",
    icon: "PaymentIcon",
    link: "",
    show_more: false,
    children: [
      { title: "Overview", slug: "api-overview", link: "/api/api-overview" },
      {
        title: "Transactions",
        slug: "api-transactions",
        link: "/api/api-transactions",
      },
    ],
    authorize: ["open"],
  },
  {
    id: 7,
    title: "Verifications",
    slug: "verifications",
    icon: "VerificationIcon",
    link: "/verifications",
    show_more: false,
    children: [],
    authorize: ["open"],
  },

  {
    id: 8,
    title: "Settings",
    slug: "settings",
    icon: "SettingsIcon",
    link: "/settings",
    show_more: false,
    children: [],
    authorize: ["open"],
  },
];

export default navRoutes;
