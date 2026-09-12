module.exports = [
"[project]/components/government/GovernmentBottomNavigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GovernmentBottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.mjs [app-ssr] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.mjs [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-ssr] (ecmascript) <export default as Map>");
"use client";
;
;
;
;
const items = [
    {
        name: "Dashboard",
        href: "/government",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Verify",
        href: "/government/verify",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
    },
    {
        name: "Projects",
        href: "/government/projects",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"]
    },
    {
        name: "Analytics",
        href: "/government/analytics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
    },
    {
        name: "Map",
        href: "/government/map",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"]
    }
];
function GovernmentBottomNavigation() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-lg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-around px-2 py-2",
            children: items.map(({ name, href, icon: Icon })=>{
                const isActive = pathname === href;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: href,
                    className: `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            size: 20,
                            className: isActive ? "text-emerald-600" : "text-slate-400"
                        }, void 0, false, {
                            fileName: "[project]/components/government/GovernmentBottomNavigation.tsx",
                            lineNumber: 31,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: name
                        }, void 0, false, {
                            fileName: "[project]/components/government/GovernmentBottomNavigation.tsx",
                            lineNumber: 32,
                            columnNumber: 15
                        }, this)
                    ]
                }, name, true, {
                    fileName: "[project]/components/government/GovernmentBottomNavigation.tsx",
                    lineNumber: 24,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/government/GovernmentBottomNavigation.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/government/GovernmentBottomNavigation.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/government/GovernmentSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GovernmentSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.mjs [app-ssr] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.mjs [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user.mjs [app-ssr] (ecmascript) <export default as UserCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$governmentData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/governmentData.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const navItems = [
    {
        name: "Dashboard",
        href: "/government",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Verification Queue",
        href: "/government/verify",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
    },
    {
        name: "Project Monitoring",
        href: "/government/projects",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"]
    },
    {
        name: "Impact Analytics",
        href: "/government/analytics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
    },
    {
        name: "Regional Map",
        href: "/government/map",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"]
    },
    {
        name: "Solver Network",
        href: "/government/solvers",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    },
    {
        name: "Notifications",
        href: "/government/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        name: "My Profile",
        href: "/government/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle$3e$__["UserCircle"]
    },
    {
        name: "Settings",
        href: "/government/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function GovernmentSidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const unread = 3;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 border-b border-slate-100 px-6 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-black text-white",
                            children: "MAH"
                        }, void 0, false, {
                            fileName: "[project]/components/government/GovernmentSidebar.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-bold text-slate-900 leading-tight",
                                children: "Maharashtra"
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-emerald-500 font-medium",
                                children: "Government Portal"
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4",
                children: navItems.map(({ name, href, icon: Icon })=>{
                    const isActive = pathname === href || href !== "/government" && pathname.startsWith(href);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: href,
                        className: `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 17,
                                className: isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-500"
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 62,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1",
                                children: name
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, this),
                            name === "Verification Queue" && unread > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-white text-emerald-600" : "bg-red-500 text-white"}`,
                                children: unread
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 68,
                                columnNumber: 17
                            }, this)
                        ]
                    }, name, true, {
                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-slate-100 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white shadow-sm",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$governmentData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentOfficial"].avatar
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-sm font-semibold text-slate-800",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$governmentData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentOfficial"].name
                                    }, void 0, false, {
                                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-emerald-500 font-medium",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$governmentData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentOfficial"].role
                                    }, void 0, false, {
                                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            "Logout"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/government/GovernmentSidebar.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/government/GovernmentSidebar.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/government/GovernmentSidebar.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/data/governmentData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currentOfficial",
    ()=>currentOfficial,
    "districtData",
    ()=>districtData,
    "domainClusters",
    ()=>domainClusters,
    "governmentProjects",
    ()=>governmentProjects,
    "officials",
    ()=>officials,
    "regionalProblems",
    ()=>regionalProblems,
    "regionalStats",
    ()=>regionalStats,
    "verificationQueue",
    ()=>verificationQueue
]);
const currentOfficial = {
    id: 1,
    name: "Dr. Anita Sharma",
    email: "anita.sharma@maharashtra.gov.in",
    avatar: "AS",
    role: "State Coordinator",
    region: "Maharashtra",
    designation: "Additional Secretary, Department of Urban Development",
    department: "Urban Development & Disaster Management",
    totalVerified: 1047,
    totalRejected: 138,
    activeAssignments: 24,
    joinedDate: "January 2023"
};
const regionalStats = {
    state: "Maharashtra",
    totalProblems: 1284,
    verified: 1047,
    pending: 189,
    rejected: 138,
    activeProjects: 318,
    completedProjects: 642,
    critical: 38,
    high: 214,
    medium: 496,
    low: 299,
    totalSolvers: 142,
    institutionsEngaged: 67
};
const verificationQueue = [
    {
        id: 1,
        problemId: 201,
        problemTitle: "Severe Landslide Risk on NH-65 Near Lonavala",
        submittedBy: "Village Sarpanch, Malavli",
        dateSubmitted: "2 hours ago",
        evidenceProvided: 4,
        priority: "Critical",
        assignedTo: "Rajesh Kumar",
        slaHours: 24,
        hoursRemaining: 22
    },
    {
        id: 2,
        problemId: 202,
        problemTitle: "Cholera Outbreak in Rural Water Sources",
        submittedBy: "Dr. Priya Nair, PHC Bhiwandi",
        dateSubmitted: "5 hours ago",
        evidenceProvided: 6,
        priority: "Critical",
        assignedTo: null,
        slaHours: 12,
        hoursRemaining: 7
    },
    {
        id: 3,
        problemId: 203,
        problemTitle: "River Mula Chemical Effluent Pollution",
        submittedBy: "Green Pune Community (17 members)",
        dateSubmitted: "1 day ago",
        evidenceProvided: 3,
        priority: "High",
        assignedTo: "Sunita Deshmukh",
        slaHours: 48,
        hoursRemaining: 43
    },
    {
        id: 4,
        problemId: 204,
        problemTitle: "School Dropout Rate Rising in Tribal Blocks",
        submittedBy: "NGO Prayas, Nashik",
        dateSubmitted: "1 day ago",
        evidenceProvided: 2,
        priority: "High",
        assignedTo: "Rajesh Kumar",
        slaHours: 48,
        hoursRemaining: 40
    },
    {
        id: 5,
        problemId: 205,
        problemTitle: "Broken Flood Drainage System in Low-Lying Areas",
        submittedBy: "Municipal Councilor, Kalyan",
        dateSubmitted: "2 days ago",
        evidenceProvided: 5,
        priority: "High",
        assignedTo: null,
        slaHours: 72,
        hoursRemaining: 62
    },
    {
        id: 6,
        problemId: 206,
        problemTitle: "Mental Health Crisis Among Farming Families",
        submittedBy: "Amit Jadhav (Individual Citizen)",
        dateSubmitted: "2 days ago",
        evidenceProvided: 1,
        priority: "Medium",
        assignedTo: "Sunita Deshmukh",
        slaHours: 96,
        hoursRemaining: 88
    }
];
const regionalProblems = [
    {
        id: 201,
        title: "Severe Landslide Risk on NH-65 Near Lonavala",
        description: "During monsoon seasons, the hillside adjacent to NH-65 near Lonavala experiences recurring landslides that block the highway for days. Multiple vehicles have been damaged. The India Meteorological Department has predicted above-normal rainfall this year. Residents demand a predictive early-warning system and slope stabilization.",
        category: "Disaster Management",
        problemType: "Hybrid",
        domain: "Disaster Management",
        subdomain: "Landslide",
        location: "Lonavala, Pune District",
        district: "Pune",
        state: "Maharashtra",
        citizenName: "Village Sarpanch, Malavli",
        citizenAvatar: "VS",
        dateSubmitted: "2 hours ago",
        verificationStatus: "Under Review",
        priority: "Critical",
        aiPriorityScore: 94,
        aiFactors: {
            populationAffected: 9,
            urgency: 9,
            severity: 8,
            recurrence: 7,
            regionalRelevance: 9,
            evidenceConfidence: 8
        },
        supporters: 312,
        evidence: [
            "IMD rainfall report",
            "Geological survey photo",
            "News footage",
            "Local complaint register"
        ],
        problemOwner: {
            type: "Government Department",
            name: "Malavli Gram Panchayat",
            members: 1
        },
        assignedTo: "Rajesh Kumar",
        matchedUniversities: [
            {
                name: "College of Engineering Pune",
                score: 92
            },
            {
                name: "Savitribai Phule Pune University",
                score: 84
            }
        ],
        matchedIndustry: [
            {
                name: "GeoTech Solutions Pvt. Ltd.",
                score: 78
            }
        ],
        matchedMentors: [
            {
                name: "Dr. Ritu Verma, Civil Engineering",
                score: 91
            }
        ],
        hasProject: false
    },
    {
        id: 202,
        title: "Cholera Outbreak in Rural Water Sources",
        description: "Three villages in Bhiwandi taluka have reported 47 cholera cases in the last 10 days. Contaminated open well water is the suspected source. The district hospital has requested immediate water quality testing and a permanent purification solution.",
        category: "Healthcare",
        problemType: "Technical",
        domain: "Healthcare",
        subdomain: "Waterborne Disease",
        location: "Bhiwandi, Thane District",
        district: "Thane",
        state: "Maharashtra",
        citizenName: "Dr. Priya Nair, PHC",
        citizenAvatar: "DP",
        dateSubmitted: "5 hours ago",
        verificationStatus: "Pending",
        priority: "Critical",
        aiPriorityScore: 97,
        aiFactors: {
            populationAffected: 10,
            urgency: 10,
            severity: 10,
            recurrence: 3,
            regionalRelevance: 8,
            evidenceConfidence: 9
        },
        supporters: 189,
        evidence: [
            "Hospital case records",
            "Water lab report",
            "PHC official letter"
        ],
        problemOwner: {
            type: "Government Department",
            name: "Primary Health Centre, Bhiwandi"
        },
        matchedUniversities: [
            {
                name: "Savitribai Phule Pune University",
                score: 89
            },
            {
                name: "Tata Institute of Social Sciences",
                score: 72
            }
        ],
        matchedIndustry: [
            {
                name: "AquaPure Water Systems",
                score: 81
            }
        ],
        matchedMentors: [
            {
                name: "Dr. Anil Kulkarni, Public Health",
                score: 88
            }
        ],
        hasProject: false
    }
];
const governmentProjects = [
    {
        id: 301,
        problemId: 101,
        title: "Predictive Landslide Monitoring System — Lonavala",
        status: "Active",
        priority: "Critical",
        problemOwner: "Malavli Gram Panchayat",
        leadInstitution: "College of Engineering Pune",
        leadDepartment: "Civil & Environmental Engineering",
        leadMentor: "Dr. Ritu Verma",
        partnerOrganizations: [
            "GeoTech Solutions Pvt. Ltd.",
            "Indian Space Research Organisation (ISRO)"
        ],
        startDate: "15 August 2025",
        expectedCompletion: "30 April 2026",
        progress: 45,
        currentMilestone: "IoT Sensor Deployment",
        milestones: [
            {
                name: "Feasibility Study",
                status: "Completed",
                date: "30 Sep 2025"
            },
            {
                name: "Sensor Network Design",
                status: "Completed",
                date: "15 Nov 2025"
            },
            {
                name: "IoT Sensor Deployment",
                status: "In Progress",
                date: "15 Jan 2026"
            },
            {
                name: "ML Model Training",
                status: "Pending"
            },
            {
                name: "Early Warning Dashboard",
                status: "Pending"
            },
            {
                name: "Field Validation",
                status: "Pending"
            }
        ],
        budgetAllocated: 4500000,
        budgetUtilized: 1850000,
        teamSize: 14,
        updates: [
            {
                id: 1,
                author: "Dr. Ritu Verma",
                date: "12 Sep 2025",
                text: "Rainfall dataset preprocessing completed. Model development will begin next week.",
                status: "Completed"
            },
            {
                id: 2,
                author: "GeoTech Solutions",
                date: "28 Sep 2025",
                text: "IoT sensor procurement finalized. 120 sensors ordered for deployment.",
                status: "Completed"
            },
            {
                id: 3,
                author: "Dr. Ritu Verma",
                date: "5 Jan 2026",
                text: "First batch of 40 sensors installed on the vulnerable slope section.",
                status: "In Progress"
            }
        ],
        impactMetrics: {
            peopleBenefited: 45000,
            description: "Early warning system will protect highway users and 12 villages in the hazard zone.",
            verified: false
        }
    },
    {
        id: 302,
        problemId: 102,
        title: "Mula River Effluent Treatment Plant Expansion",
        status: "Active",
        priority: "High",
        problemOwner: "Green Pune Community",
        leadInstitution: "Savitribai Phule Pune University",
        leadDepartment: "Environmental Science & Technology",
        leadMentor: "Prof. Nandini Rao",
        partnerOrganizations: [
            "Maharashtra Pollution Control Board",
            "EcoPure Engineering Ltd."
        ],
        startDate: "1 June 2025",
        expectedCompletion: "31 March 2026",
        progress: 60,
        currentMilestone: "Treatment Plant Construction",
        milestones: [
            {
                name: "Water Quality Baseline Study",
                status: "Completed",
                date: "30 Jun 2025"
            },
            {
                name: "Effluent Characterization",
                status: "Completed",
                date: "31 Aug 2025"
            },
            {
                name: "Treatment Plant Construction",
                status: "In Progress",
                date: "28 Feb 2026"
            },
            {
                name: "Discharge Compliance Testing",
                status: "Pending"
            }
        ],
        budgetAllocated: 12000000,
        budgetUtilized: 6800000,
        teamSize: 18,
        updates: [
            {
                id: 1,
                author: "Prof. Nandini Rao",
                date: "10 Aug 2025",
                text: "36 industrial effluent samples analyzed. 14 exceed permissible limits.",
                status: "Completed"
            },
            {
                id: 2,
                author: "EcoPure Engineering",
                date: "15 Dec 2025",
                text: "Concrete work for primary settling tanks 70% complete.",
                status: "In Progress"
            }
        ],
        impactMetrics: {
            peopleBenefited: 125000,
            description: "River water quality expected to improve from Class D to Class B after completion.",
            verified: false
        }
    }
];
const domainClusters = [
    {
        domain: "Disaster Management",
        count: 142,
        verified: 98,
        projects: 64,
        completed: 28
    },
    {
        domain: "Healthcare",
        count: 118,
        verified: 104,
        projects: 48,
        completed: 34
    },
    {
        domain: "Education",
        count: 96,
        verified: 87,
        projects: 38,
        completed: 31
    },
    {
        domain: "Agriculture",
        count: 87,
        verified: 72,
        projects: 28,
        completed: 19
    },
    {
        domain: "Infrastructure",
        count: 284,
        verified: 241,
        projects: 96,
        completed: 42
    },
    {
        domain: "Environment",
        count: 214,
        verified: 184,
        projects: 72,
        completed: 38
    },
    {
        domain: "Transportation",
        count: 156,
        verified: 138,
        projects: 54,
        completed: 29
    },
    {
        domain: "Water and Sanitation",
        count: 186,
        verified: 162,
        projects: 62,
        completed: 37
    }
];
const districtData = [
    {
        district: "Pune",
        problems: 183,
        critical: 12,
        active: 47,
        completed: 18
    },
    {
        district: "Mumbai",
        problems: 142,
        critical: 8,
        active: 38,
        completed: 24
    },
    {
        district: "Nagpur",
        problems: 98,
        critical: 5,
        active: 28,
        completed: 14
    },
    {
        district: "Nashik",
        problems: 87,
        critical: 6,
        active: 22,
        completed: 11
    },
    {
        district: "Aurangabad",
        problems: 76,
        critical: 4,
        active: 18,
        completed: 9
    },
    {
        district: "Solapur",
        problems: 64,
        critical: 3,
        active: 14,
        completed: 7
    },
    {
        district: "Kolhapur",
        problems: 58,
        critical: 2,
        active: 12,
        completed: 6
    },
    {
        district: "Amravati",
        problems: 52,
        critical: 1,
        active: 10,
        completed: 5
    },
    {
        district: "Sangli",
        problems: 48,
        critical: 2,
        active: 8,
        completed: 4
    },
    {
        district: "Satara",
        problems: 42,
        critical: 1,
        active: 6,
        completed: 3
    }
];
const officials = [
    {
        id: 1,
        name: "Dr. Anita Sharma",
        email: "anita.sharma@maharashtra.gov.in",
        avatar: "AS",
        role: "State Coordinator",
        region: "Maharashtra",
        designation: "Additional Secretary",
        department: "Urban Development & Disaster Management",
        totalVerified: 1047,
        totalRejected: 138,
        activeAssignments: 24,
        joinedDate: "January 2023"
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        email: "rajesh.kumar@maharashtra.gov.in",
        avatar: "RK",
        role: "District Officer",
        region: "Pune District",
        designation: "District Collector",
        department: "District Administration",
        totalVerified: 342,
        totalRejected: 41,
        activeAssignments: 12,
        joinedDate: "March 2023"
    },
    {
        id: 3,
        name: "Sunita Deshmukh",
        email: "sunita.deshmukh@maharashtra.gov.in",
        avatar: "SD",
        role: "Verification Officer",
        region: "Thane District",
        designation: "Joint Collector",
        department: "Rural Development",
        totalVerified: 218,
        totalRejected: 27,
        activeAssignments: 8,
        joinedDate: "June 2023"
    },
    {
        id: 4,
        name: "Vijay Patil",
        email: "vijay.patil@maharashtra.gov.in",
        avatar: "VP",
        role: "Impact Analyst",
        region: "Maharashtra",
        designation: "Senior Data Scientist",
        department: "Planning & Statistics",
        totalVerified: 0,
        totalRejected: 0,
        activeAssignments: 18,
        joinedDate: "September 2023"
    }
];
}),
];

//# sourceMappingURL=_0d-lq9w._.js.map