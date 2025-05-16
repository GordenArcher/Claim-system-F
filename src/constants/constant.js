export const ClaimsNav = [
    {
      title: "Claim Lookup",
      path: "/admin/claim/verify/",
      icon: "search",
      roles: ["accountant", "administrator", "main_administrator"],
    },
    {
        title: "Upload Claim",
        path: "/claim/new",
        icon: "plus-circle",
        roles: ["accountant", "administrator", "main_administrator"],
      },
    {
      title: "Pending Claims",
      path: "/claims/pending",
      icon: "clock",
      roles: ["accountant", "administrator", "main_administrator"],
    },
    // {
    //   title: "Paid Claims",
    //   path: "/claims/paid",
    //   icon: "dollar-sign",
    //   roles: ["accountant", "administrator", "main_administrator"],
    // },
    {
      title: "Settings",
      path: "/settings",
      icon: "settings",
      roles: ["accountant", "administrator", "main_administrator"],
    },
    // Admin Routes
    {
      title: "Admin Dashboard",
      path: "/admin/dashboard",
      icon: "layout-dashboard",
      roles: ["administrator", "main_administrator"],
    },
    {
        title: "Claim History",
        path: "/claims/history",
        icon: "history",
        roles: ["administrator", "main_administrator"],
      },
    {
        title: "Payment History",
        path: "/payments/history",
        icon: "credit-card",
        roles: ["administrator", "main_administrator"],
      },
    {
      title: "User Management",
      path: "/admin/user-management",
      icon: "users",
      roles: ["administrator", "main_administrator"],
    },
    {
      title: "System Logs",
      path: "/admin/system-logs",
      icon: "clipboard-list",
      roles: ["administrator", "main_administrator"],
    },
    // Main Administrator Only
    {
      title: "Audit Trail",
      path: "/main-admin/audit-trail",
      icon: "search-check",
      roles: ["main_administrator"],
    },
  ];
  