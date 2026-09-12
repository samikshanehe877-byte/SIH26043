module.exports = [
"[project]/components/industry/IndustryBottomNavigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IndustryBottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.mjs [app-ssr] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-ssr] (ecmascript) <export default as Handshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-pie.mjs [app-ssr] (ecmascript) <export default as PieChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$IndustryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/IndustryContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const navItems = [
    {
        name: "Home",
        href: "/industry",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Requests",
        href: "/industry/requests",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"]
    },
    {
        name: "Collab",
        href: "/industry/collaborations",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__["Handshake"]
    },
    {
        name: "Impact",
        href: "/industry/impact",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__["PieChart"]
    },
    {
        name: "Alerts",
        href: "/industry/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    }
];
function IndustryBottomNavigation() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { unreadNotificationsCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$IndustryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustry"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-1 py-1.5 shadow-lg lg:hidden",
        children: navItems.map(({ name, href, icon: Icon })=>{
            const isActive = pathname === href || href !== "/industry" && pathname.startsWith(href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: `relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all ${isActive ? "text-blue-700 font-semibold" : "text-slate-400 hover:text-slate-600"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 19,
                                strokeWidth: isActive ? 2.5 : 2
                            }, void 0, false, {
                                fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
                                lineNumber: 44,
                                columnNumber: 15
                            }, this),
                            name === "Alerts" && unreadNotificationsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white",
                                children: unreadNotificationsCount
                            }, void 0, false, {
                                fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
                                lineNumber: 46,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, this),
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
                        lineNumber: 53,
                        columnNumber: 15
                    }, this)
                ]
            }, name, true, {
                fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
                lineNumber: 34,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/industry/IndustryBottomNavigation.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/industry/IndustrySidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IndustrySidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.mjs [app-ssr] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-ssr] (ecmascript) <export default as Handshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-ssr] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.mjs [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-pie.mjs [app-ssr] (ecmascript) <export default as PieChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.mjs [app-ssr] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$IndustryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/IndustryContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const navItems = [
    {
        name: "Dashboard",
        href: "/industry",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Collaboration Requests",
        href: "/industry/requests",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"]
    },
    {
        name: "Active Collaborations",
        href: "/industry/collaborations",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__["Handshake"]
    },
    {
        name: "Supported Challenges",
        href: "/industry/challenges",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"]
    },
    {
        name: "Universities & Teams",
        href: "/industry/universities",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
    },
    {
        name: "Expertise & Resources",
        href: "/industry/expertise",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"]
    },
    {
        name: "Impact & Reports",
        href: "/industry/impact",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__["PieChart"]
    },
    {
        name: "Notifications",
        href: "/industry/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        name: "Company Profile",
        href: "/industry/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"]
    },
    {
        name: "Settings",
        href: "/industry/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function IndustrySidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { company, unreadNotificationsCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$IndustryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustry"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 border-b border-slate-100 px-6 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm text-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/components/industry/IndustrySidebar.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-bold text-slate-900 leading-tight truncate",
                                children: "SolveTogether"
                            }, void 0, false, {
                                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-xs text-blue-600 font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Industry Portal"
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block h-1.5 w-1.5 rounded-full bg-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-normal text-slate-400",
                                        children: "Partner"
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400",
                        children: "Main Menu"
                    }, void 0, false, {
                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    navItems.map(({ name, href, icon: Icon })=>{
                        const isActive = pathname === href || href !== "/industry" && pathname.startsWith(href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50/70 hover:text-blue-700"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: 18,
                                    className: isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                    lineNumber: 77,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1 truncate",
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this),
                                name === "Notifications" && unreadNotificationsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${isActive ? "bg-white text-blue-700" : "bg-red-500 text-white"}`,
                                    children: unreadNotificationsCount
                                }, void 0, false, {
                                    fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                    lineNumber: 87,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, name, true, {
                            fileName: "[project]/components/industry/IndustrySidebar.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-slate-100 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100/80",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: company.logo,
                                        alt: company.name,
                                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white shadow-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500",
                                        title: "Online Active"
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "truncate text-xs font-bold text-slate-800",
                                            children: company.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 116,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-[11px] text-slate-500 font-medium",
                                        children: company.industryDomain
                                    }, void 0, false, {
                                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            alert("Logging out from Industry Portal...");
                        },
                        className: "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            "Logout Session"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/industry/IndustrySidebar.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/industry/IndustrySidebar.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/industry/IndustrySidebar.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/context/IndustryContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndustryProvider",
    ()=>IndustryProvider,
    "useIndustry",
    ()=>useIndustry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$industryMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/industryMockData.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const IndustryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function IndustryProvider({ children }) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$industryMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["industryMockData"]);
    const unreadNotificationsCount = data.notifications.filter((n)=>!n.isRead).length;
    const markNotificationAsRead = (id)=>{
        setData((prev)=>({
                ...prev,
                notifications: prev.notifications.map((n)=>n.id === id ? {
                        ...n,
                        isRead: true
                    } : n)
            }));
    };
    const updateRequestStatus = (id, status)=>{
        setData((prev)=>({
                ...prev,
                requests: prev.requests.map((r)=>r.id === id ? {
                        ...r,
                        status
                    } : r)
            }));
    };
    const updateSupportStatus = (collaborationId, supportId, status)=>{
        setData((prev)=>({
                ...prev,
                collaborations: prev.collaborations.map((col)=>{
                    if (col.id === collaborationId) {
                        return {
                            ...col,
                            industrySupport: col.industrySupport.map((sup)=>sup.id === supportId ? {
                                    ...sup,
                                    status
                                } : sup)
                        };
                    }
                    return col;
                })
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IndustryContext.Provider, {
        value: {
            ...data,
            unreadNotificationsCount,
            markNotificationAsRead,
            updateRequestStatus,
            updateSupportStatus
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/IndustryContext.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
function useIndustry() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(IndustryContext);
    if (context === undefined) {
        throw new Error("useIndustry must be used within an IndustryProvider");
    }
    return context;
}
}),
"[project]/data/industryMockData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "industryMockData",
    ()=>industryMockData
]);
const defaultMilestones = [
    {
        label: "Problem Accepted",
        desc: "Challenge assigned"
    },
    {
        label: "Team Created",
        desc: "Students grouped"
    },
    {
        label: "Development Started",
        desc: "Initial coding"
    },
    {
        label: "Industry Support Required",
        desc: "Collaboration requested"
    },
    {
        label: "Testing",
        desc: "QA phase"
    },
    {
        label: "Completion",
        desc: "Project finished"
    }
];
const industryMockData = {
    company: {
        id: "ind-001",
        name: "TechNova Solutions",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=TechNova",
        industryDomain: "Cloud & AI Services",
        website: "https://technova.example.com",
        description: "Leading provider of scalable cloud infrastructure and AI integration tools.",
        location: "Bangalore, India",
        contactEmail: "partnerships@technova.example.com",
        contactPhone: "+91-9876543210",
        expertise: {
            technologies: [
                "AI / ML",
                "Data Science",
                "Cloud Computing",
                "IoT",
                "Computer Vision"
            ],
            domains: [
                "Smart Cities",
                "Healthcare",
                "Education"
            ]
        },
        resources: [
            {
                type: "Cloud Credits",
                available: true,
                description: "$10,000 AWS credits per project"
            },
            {
                type: "APIs",
                available: true,
                description: "Access to TechNova NLP & Vision APIs"
            },
            {
                type: "Technical Experts",
                available: true,
                description: "1 hour weekly mentoring"
            },
            {
                type: "Datasets",
                available: true,
                description: "Anonymized smart city traffic data"
            }
        ]
    },
    requests: [
        {
            id: "req-101",
            challengeTitle: "Smart Traffic Light Optimization",
            problemDescription: "Current traffic lights cause congestion. Need an AI-based dynamic timing system.",
            category: "Infrastructure",
            expectedOutcome: "A functioning prototype of a smart traffic control system using CCTV feeds.",
            university: {
                id: "uni-1",
                name: "Bharati Vidyapeeth",
                department: "Computer Engineering",
                location: "Pune, India"
            },
            mentor: {
                id: "mnt-1",
                name: "Prof. Rajesh Kumar",
                department: "Computer Engineering",
                expertise: [
                    "AI",
                    "Algorithms"
                ]
            },
            studentTeam: {
                id: "tm-1",
                name: "TrafficBusters",
                size: 5,
                skills: [
                    "Python",
                    "TensorFlow",
                    "React"
                ]
            },
            aiAnalysis: {
                problemCategory: "Smart City",
                requiredSkills: [
                    "Computer Vision",
                    "Machine Learning"
                ],
                suggestedTechnologies: [
                    "Python",
                    "YOLOv8",
                    "AWS"
                ],
                difficulty: "High",
                suggestedSupportRequirements: [
                    "Cloud Resources",
                    "Dataset"
                ],
                matchScore: 92,
                matchingSkills: [
                    "AI / ML",
                    "Computer Vision",
                    "Cloud Computing"
                ]
            },
            requestedSupportTypes: [
                "Cloud Resources",
                "Dataset",
                "Mentorship"
            ],
            whySupportIsNeeded: "The team requires significant computational power to train the CV models and realistic traffic datasets which are hard to acquire.",
            expectedIndustryContribution: "Provide AWS credits for model training and access to traffic datasets.",
            projectProgress: 35,
            currentMilestoneIndex: 3,
            milestones: defaultMilestones,
            requestDate: "2026-09-08",
            status: "Received"
        },
        {
            id: "req-102",
            challengeTitle: "Rural Telemedicine App",
            problemDescription: "Lack of basic medical advice in remote areas.",
            category: "Healthcare",
            expectedOutcome: "A lightweight mobile app that works on low bandwidth.",
            university: {
                id: "uni-2",
                name: "Delhi Technological University",
                department: "Software Engineering",
                location: "New Delhi, India"
            },
            mentor: {
                id: "mnt-2",
                name: "Dr. Sneha Patel",
                department: "Software Engineering",
                expertise: [
                    "Mobile Dev",
                    "Healthcare Systems"
                ]
            },
            studentTeam: {
                id: "tm-2",
                name: "HealthConnect",
                size: 4,
                skills: [
                    "Flutter",
                    "Firebase",
                    "Node.js"
                ]
            },
            aiAnalysis: {
                problemCategory: "Healthcare",
                requiredSkills: [
                    "Mobile Development",
                    "Backend API"
                ],
                suggestedTechnologies: [
                    "Flutter",
                    "WebRTC"
                ],
                difficulty: "Medium",
                suggestedSupportRequirements: [
                    "API",
                    "Domain Expert"
                ],
                matchScore: 65,
                matchingSkills: [
                    "Cloud Computing"
                ]
            },
            requestedSupportTypes: [
                "API",
                "Technical Expertise"
            ],
            whySupportIsNeeded: "Need an enterprise-grade video conferencing API to integrate into the app.",
            expectedIndustryContribution: "Provide access to a commercial video API and guidance on WebRTC.",
            projectProgress: 50,
            currentMilestoneIndex: 3,
            milestones: defaultMilestones,
            requestDate: "2026-09-07",
            status: "Under Review"
        },
        {
            id: "req-103",
            challengeTitle: "Crop Disease Detection",
            problemDescription: "Farmers lose crops due to late detection of leaf diseases.",
            category: "Agriculture",
            expectedOutcome: "An image classification model accessible via SMS bot.",
            university: {
                id: "uni-3",
                name: "IIT Bombay",
                department: "Computer Science",
                location: "Mumbai, India"
            },
            mentor: {
                id: "mnt-3",
                name: "Prof. Anil Desai",
                department: "Computer Science",
                expertise: [
                    "Deep Learning"
                ]
            },
            studentTeam: {
                id: "tm-3",
                name: "AgriVision",
                size: 6,
                skills: [
                    "PyTorch",
                    "FastAPI"
                ]
            },
            aiAnalysis: {
                problemCategory: "Agriculture",
                requiredSkills: [
                    "Computer Vision",
                    "NLP"
                ],
                suggestedTechnologies: [
                    "PyTorch",
                    "Twilio API"
                ],
                difficulty: "Medium",
                suggestedSupportRequirements: [
                    "Cloud Resources"
                ],
                matchScore: 80,
                matchingSkills: [
                    "AI / ML",
                    "Computer Vision"
                ]
            },
            requestedSupportTypes: [
                "Cloud Resources"
            ],
            whySupportIsNeeded: "Need GPU instances for training the ResNet models.",
            expectedIndustryContribution: "GPU cloud instances.",
            projectProgress: 20,
            currentMilestoneIndex: 2,
            milestones: defaultMilestones,
            requestDate: "2026-09-05",
            status: "Clarification Needed"
        }
    ],
    collaborations: [
        {
            id: "col-201",
            requestId: "req-099",
            challengeTitle: "Smart Water Management System",
            problemDescription: "Water wastage due to lack of monitoring in urban residential areas.",
            category: "Environment / Water Management",
            university: {
                id: "uni-1",
                name: "Bharati Vidyapeeth",
                department: "Computer Engineering",
                location: "Pune, India"
            },
            mentor: {
                id: "mnt-4",
                name: "Prof. Sarah Connor",
                department: "Computer Engineering",
                expertise: [
                    "IoT",
                    "Systems"
                ]
            },
            studentTeam: {
                id: "tm-4",
                name: "AquaTech",
                size: 4,
                skills: [
                    "IoT",
                    "React",
                    "Node.js"
                ]
            },
            projectProgress: 68,
            currentMilestoneIndex: 4,
            milestones: defaultMilestones,
            industrySupport: [
                {
                    id: "sup-1",
                    type: "Hardware",
                    status: "Delivered",
                    description: "10x IoT Flow Sensors",
                    expectedDeliveryDate: "2026-08-15"
                },
                {
                    id: "sup-2",
                    type: "Technical Expertise",
                    status: "In Progress",
                    description: "Bi-weekly review meetings with IoT engineers",
                    expectedDeliveryDate: "2026-10-01"
                }
            ],
            collaborationStatus: "In Progress",
            lastUpdate: "2026-09-09"
        },
        {
            id: "col-202",
            requestId: "req-098",
            challengeTitle: "AI Chatbot for Citizen Queries",
            problemDescription: "Municipal corporation website is hard to navigate.",
            category: "E-Governance",
            university: {
                id: "uni-4",
                name: "VIT Vellore",
                department: "IT",
                location: "Vellore, India"
            },
            mentor: {
                id: "mnt-5",
                name: "Dr. Vikram Singh",
                department: "IT",
                expertise: [
                    "NLP",
                    "Web Dev"
                ]
            },
            studentTeam: {
                id: "tm-5",
                name: "GovBot Creators",
                size: 3,
                skills: [
                    "Python",
                    "LangChain",
                    "Next.js"
                ]
            },
            projectProgress: 90,
            currentMilestoneIndex: 5,
            milestones: defaultMilestones,
            industrySupport: [
                {
                    id: "sup-3",
                    type: "API",
                    status: "Completed",
                    description: "Enterprise LLM API Access",
                    expectedDeliveryDate: "2026-07-20"
                }
            ],
            collaborationStatus: "Support Delivered",
            lastUpdate: "2026-09-01"
        }
    ],
    supportedChallenges: [
        {
            id: "sch-1",
            challengeTitle: "Automated Pothole Detection",
            universityName: "NIT Surathkal",
            mentorName: "Prof. A. Rao",
            year: "2025",
            supportProvided: [
                "Cloud Resources",
                "Mentorship"
            ],
            finalStatus: "Solution Deployed",
            completionDate: "2025-11-20",
            impactResult: "Adopted by Mangalore City Corporation"
        },
        {
            id: "sch-2",
            challengeTitle: "E-Waste Supply Chain Tracker",
            universityName: "BITS Pilani",
            mentorName: "Dr. M. Sharma",
            year: "2025",
            supportProvided: [
                "Technical Expertise"
            ],
            finalStatus: "Completed",
            completionDate: "2025-08-14",
            impactResult: "Used by 3 local recycling firms"
        }
    ],
    notifications: [
        {
            id: 1,
            type: "info",
            title: "New Collaboration Request",
            message: "Prof. Rajesh Kumar (Bharati Vidyapeeth) requested support for 'Smart Traffic Light Optimization'.",
            timeAgo: "2 hours ago",
            isRead: false
        },
        {
            id: 2,
            type: "update",
            title: "Clarification Reply",
            message: "Mentor responded to your clarification on 'Crop Disease Detection'.",
            timeAgo: "5 hours ago",
            isRead: false
        },
        {
            id: 3,
            type: "success",
            title: "Milestone Reached",
            message: "Team 'AquaTech' reached the 'Testing' milestone.",
            timeAgo: "1 day ago",
            isRead: true
        }
    ],
    impact: {
        projectsSupported: 12,
        universitiesCollaborated: 8,
        studentsReached: 45,
        technicalExpertsInvolved: 5,
        resourcesProvided: 18,
        completedSolutions: 9,
        supportDistribution: [
            {
                label: "Cloud Resources",
                value: 35
            },
            {
                label: "Technical Expertise",
                value: 25
            },
            {
                label: "APIs",
                value: 20
            },
            {
                label: "Datasets",
                value: 10
            },
            {
                label: "Hardware",
                value: 5
            },
            {
                label: "Other",
                value: 5
            }
        ]
    }
};
}),
];

//# sourceMappingURL=_1d4dmik._.js.map