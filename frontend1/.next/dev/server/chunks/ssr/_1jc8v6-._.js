module.exports = [
"[project]/components/mentor/MentorBottomNavigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MentorBottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-ssr] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-ssr] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-ssr] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-ssr] (ecmascript) <export default as Handshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/MentorContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const navItems = [
    {
        name: "Dashboard",
        href: "/mentor",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Challenges",
        href: "/mentor/challenges",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"]
    },
    {
        name: "Teams",
        href: "/mentor/teams",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"]
    },
    {
        name: "Tasks",
        href: "/mentor/tasks",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"]
    },
    {
        name: "Collab",
        href: "/mentor/collaboration",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__["Handshake"]
    },
    {
        name: "Alerts",
        href: "/mentor/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    }
];
function MentorBottomNavigation() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { unreadNotificationsCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMentor"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-1 py-1.5 shadow-lg lg:hidden",
        children: navItems.map(({ name, href, icon: Icon })=>{
            const isActive = pathname === href || href !== "/mentor" && pathname.startsWith(href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: `relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all ${isActive ? "text-emerald-700 font-semibold" : "text-slate-400 hover:text-slate-600"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 19,
                                strokeWidth: isActive ? 2.5 : 2
                            }, void 0, false, {
                                fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                                lineNumber: 46,
                                columnNumber: 15
                            }, this),
                            name === "Alerts" && unreadNotificationsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white",
                                children: unreadNotificationsCount
                            }, void 0, false, {
                                fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                                lineNumber: 48,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                        lineNumber: 45,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this),
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-emerald-600"
                    }, void 0, false, {
                        fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                        lineNumber: 55,
                        columnNumber: 15
                    }, this)
                ]
            }, name, true, {
                fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                lineNumber: 36,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/mentor/MentorSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MentorSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-ssr] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-ssr] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-ssr] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-ssr] (ecmascript) <export default as Handshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.mjs [app-ssr] (ecmascript) <export default as UserCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/MentorContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const navItems = [
    {
        name: "Dashboard",
        href: "/mentor",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "My Challenges",
        href: "/mentor/challenges",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"]
    },
    {
        name: "My Teams",
        href: "/mentor/teams",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"]
    },
    {
        name: "Tasks",
        href: "/mentor/tasks",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"]
    },
    {
        name: "Industry Collaboration",
        href: "/mentor/collaboration",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__["Handshake"]
    },
    {
        name: "Notifications",
        href: "/mentor/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        name: "Profile",
        href: "/mentor/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__["UserCircle2"]
    },
    {
        name: "Settings",
        href: "/mentor/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function MentorSidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { profile, unreadNotificationsCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMentor"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 border-b border-slate-100 px-6 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-sm text-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/components/mentor/MentorSidebar.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-bold text-slate-900 leading-tight truncate",
                                children: "SolveTogether"
                            }, void 0, false, {
                                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-xs text-emerald-600 font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Mentor Portal"
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 46,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 47,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-normal text-slate-400",
                                        children: "BVU"
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400",
                        children: "Main Menu"
                    }, void 0, false, {
                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    navItems.map(({ name, href, icon: Icon })=>{
                        const isActive = pathname === href || href !== "/mentor" && pathname.startsWith(href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-700"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: 18,
                                    className: isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1 truncate",
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this),
                                name === "Notifications" && unreadNotificationsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${isActive ? "bg-white text-emerald-700" : "bg-red-500 text-white"}`,
                                    children: unreadNotificationsCount
                                }, void 0, false, {
                                    fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                    lineNumber: 83,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, name, true, {
                            fileName: "[project]/components/mentor/MentorSidebar.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                lineNumber: 54,
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white shadow-sm",
                                        children: profile.avatar
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500",
                                        title: "Online Active"
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "truncate text-xs font-bold text-slate-800",
                                            children: profile.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-[11px] text-slate-500 font-medium",
                                        children: profile.department
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-[10px] text-emerald-600 font-medium",
                                        children: profile.university
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            alert("Logging out from Mentor Portal...");
                        },
                        className: "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            "Logout Session"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/mentor/MentorSidebar.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/context/MentorContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MentorProvider",
    ()=>MentorProvider,
    "useMentor",
    ()=>useMentor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/mentorMockData.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const MentorContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function MentorProvider({ children }) {
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialMentorProfile"]);
    const [challenges, setChallenges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialChallenges"]);
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialTeams"]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialStudents"]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialTasks"]);
    const [industryRequests, setIndustryRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialIndustryRequests"]);
    const [universityUpdates, setUniversityUpdates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialUniversityUpdates"]);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialMentorNotifications"]);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialActivities"]);
    const unreadNotificationsCount = notifications.filter((n)=>!n.isRead).length;
    const getTeamForChallenge = (challengeId)=>{
        return teams.find((t)=>t.challengeId === challengeId);
    };
    const createTeam = (params)=>{
        // Check if challenge already has a team (Strict rule: ONE team per challenge)
        const existingTeam = teams.find((t)=>t.challengeId === params.challengeId);
        if (existingTeam) {
            return {
                success: false,
                message: `Team "${existingTeam.name}" has already been created for this challenge. Each challenge can have only one team.`
            };
        }
        const challenge = challenges.find((c)=>c.id === params.challengeId);
        const challengeTitle = challenge ? challenge.title : "Assigned Challenge";
        const newTeamId = `team-${Date.now()}`;
        const newTeam = {
            id: newTeamId,
            name: params.name,
            challengeId: params.challengeId,
            challengeTitle,
            description: params.description,
            objective: params.objective,
            leaderStudentId: params.leaderStudentId || params.studentIds[0],
            studentIds: params.studentIds,
            progress: 5,
            tasksTotal: 0,
            tasksCompleted: 0,
            tasksInProgress: 0,
            tasksPendingReview: 0,
            lastActivity: "Team created just now",
            industrySupport: "Not Requested",
            status: "Active",
            createdAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            progressBreakdown: {
                research: 20,
                dataCollection: 10,
                modelDevelopment: 0,
                backend: 0,
                testing: 0,
                documentation: 10
            }
        };
        setTeams((prev)=>[
                newTeam,
                ...prev
            ]);
        // Update challenge status to "Team Active" and link teamId
        setChallenges((prev)=>prev.map((c)=>c.id === params.challengeId ? {
                    ...c,
                    status: "Team Active",
                    teamId: newTeamId,
                    progress: Math.max(c.progress, 5)
                } : c));
        // Update students workload and activity
        setStudents((prev)=>prev.map((s)=>{
                if (params.studentIds.includes(s.id)) {
                    return {
                        ...s,
                        workload: Math.min(100, s.workload + 15),
                        lastActivity: `Assigned to ${params.name} just now`
                    };
                }
                return s;
            }));
        // Update profile count
        setProfile((prev)=>({
                ...prev,
                activeTeamsCount: prev.activeTeamsCount + 1
            }));
        // Add activity
        setActivities((prev)=>[
                {
                    id: `act-${Date.now()}`,
                    type: "team_update",
                    text: `Created new student team '${params.name}' for challenge '${challengeTitle}'`,
                    timestamp: "Just now",
                    actorName: profile.name,
                    actorAvatar: profile.avatar,
                    challengeTitle,
                    teamName: params.name
                },
                ...prev
            ]);
        return {
            success: true,
            message: "Team created successfully!",
            team: newTeam
        };
    };
    const createTask = (params)=>{
        const team = teams.find((t)=>t.id === params.teamId);
        const student = students.find((s)=>s.id === params.assignedStudentId);
        const newTask = {
            id: `task-${Date.now()}`,
            title: params.title,
            description: params.description,
            teamId: params.teamId,
            teamName: team ? team.name : "Team",
            challengeId: team ? team.challengeId : "",
            assignedStudentId: params.assignedStudentId,
            assignedStudentName: student ? student.name : "Unassigned",
            assignedStudentAvatar: student ? student.avatar : "ST",
            priority: params.priority,
            deadline: params.deadline,
            status: "To Do",
            expectedOutput: params.expectedOutput,
            createdAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            })
        };
        setTasks((prev)=>[
                newTask,
                ...prev
            ]);
        // Update team task counters
        if (team) {
            setTeams((prev)=>prev.map((t)=>t.id === team.id ? {
                        ...t,
                        tasksTotal: t.tasksTotal + 1,
                        tasksInProgress: t.tasksInProgress + 1,
                        lastActivity: `New task assigned to ${student?.name || "student"}`
                    } : t));
        }
        // Update student task count
        if (student) {
            setStudents((prev)=>prev.map((s)=>s.id === student.id ? {
                        ...s,
                        pendingTasks: s.pendingTasks + 1,
                        lastActivity: `Assigned task '${params.title}'`
                    } : s));
        }
        // Add notification
        setNotifications((prev)=>[
                {
                    id: `notif-${Date.now()}`,
                    type: "assignment",
                    title: "Task Assigned",
                    message: `Task '${params.title}' assigned to ${student?.name || "student"} on ${team?.name || "team"}.`,
                    timeAgo: "Just now",
                    isRead: false,
                    link: "/mentor/tasks"
                },
                ...prev
            ]);
        return {
            success: true,
            task: newTask
        };
    };
    const updateTaskStatus = (taskId, status)=>{
        setTasks((prev)=>prev.map((t)=>t.id === taskId ? {
                    ...t,
                    status
                } : t));
    };
    const reviewTask = (taskId, action, feedback)=>{
        setTasks((prev)=>prev.map((t)=>{
                if (t.id !== taskId) return t;
                if (action === "approve") {
                    return {
                        ...t,
                        status: "Approved",
                        submission: t.submission ? {
                            ...t.submission,
                            feedback
                        } : {
                            submittedAt: "Recently",
                            description: "Completed",
                            files: [],
                            links: [],
                            feedback
                        }
                    };
                } else {
                    return {
                        ...t,
                        status: "Changes Requested",
                        submission: t.submission ? {
                            ...t.submission,
                            changesRequestedReason: feedback
                        } : {
                            submittedAt: "Recently",
                            description: "Revision requested",
                            files: [],
                            links: [],
                            changesRequestedReason: feedback
                        }
                    };
                }
            }));
        const task = tasks.find((t)=>t.id === taskId);
        if (!task) return;
        if (action === "approve") {
            // Update student completed tasks
            setStudents((prev)=>prev.map((s)=>s.id === task.assignedStudentId ? {
                        ...s,
                        completedTasks: s.completedTasks + 1,
                        pendingTasks: Math.max(0, s.pendingTasks - 1),
                        workload: Math.max(10, s.workload - 10),
                        lastActivity: `Task '${task.title}' approved by mentor`
                    } : s));
            // Update team tasks completed and progress
            setTeams((prev)=>prev.map((t)=>{
                    if (t.id !== task.teamId) return t;
                    const completed = t.tasksCompleted + 1;
                    const inProgress = Math.max(0, t.tasksInProgress - 1);
                    const total = Math.max(completed, t.tasksTotal);
                    const newProgress = Math.min(100, Math.round(completed / total * 100));
                    return {
                        ...t,
                        tasksCompleted: completed,
                        tasksInProgress: inProgress,
                        progress: newProgress,
                        lastActivity: `Task '${task.title}' approved`
                    };
                }));
            // Activity
            setActivities((prev)=>[
                    {
                        id: `act-${Date.now()}`,
                        type: "task_completed",
                        text: `Approved task submission '${task.title}' by ${task.assignedStudentName}`,
                        timestamp: "Just now",
                        actorName: profile.name,
                        actorAvatar: profile.avatar,
                        teamName: task.teamName
                    },
                    ...prev
                ]);
        } else {
            // Changes requested
            setStudents((prev)=>prev.map((s)=>s.id === task.assignedStudentId ? {
                        ...s,
                        status: "Needs Attention",
                        lastActivity: `Changes requested on '${task.title}'`
                    } : s));
        }
    };
    const createIndustryRequest = (params)=>{
        const challenge = challenges.find((c)=>c.id === params.challengeId);
        const team = teams.find((t)=>t.id === params.teamId);
        const newRequest = {
            id: `collab-${Date.now()}`,
            challengeId: params.challengeId,
            challengeTitle: challenge ? challenge.title : "Challenge",
            teamId: params.teamId,
            teamName: team ? team.name : "Team",
            helpType: params.helpType,
            organization: params.organization,
            requestTitle: params.requestTitle,
            requirement: params.requirement,
            whyNeeded: params.whyNeeded,
            expectedSupport: params.expectedSupport,
            priority: params.priority,
            requiredBy: params.requiredBy,
            status: "Sent",
            dateSubmitted: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            lastUpdate: "Submitted today",
            attachmentName: params.attachmentName,
            details: params.details,
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: profile.name,
                    role: "mentor",
                    text: `Submitted request for ${params.helpType}: "${params.requestTitle}" to ${params.organization}.`,
                    timestamp: "Just now"
                }
            ]
        };
        setIndustryRequests((prev)=>[
                newRequest,
                ...prev
            ]);
        // Update challenge status
        setChallenges((prev)=>prev.map((c)=>c.id === params.challengeId ? {
                    ...c,
                    industrySupportStatus: "Request Sent",
                    status: c.status === "Completed" ? "Completed" : "Industry Collaboration Active"
                } : c));
        // Update team industry status
        if (team) {
            setTeams((prev)=>prev.map((t)=>t.id === team.id ? {
                        ...t,
                        industrySupport: `${params.helpType} requested from ${params.organization}`
                    } : t));
        }
        // Activity
        setActivities((prev)=>[
                {
                    id: `act-${Date.now()}`,
                    type: "industry_update",
                    text: `Requested ${params.helpType} assistance from ${params.organization} for '${challenge?.title || "Challenge"}'`,
                    timestamp: "Just now",
                    actorName: profile.name,
                    actorAvatar: profile.avatar,
                    challengeTitle: challenge?.title
                },
                ...prev
            ]);
        return {
            success: true,
            request: newRequest
        };
    };
    const updateIndustryRequestStatus = (requestId, status)=>{
        setIndustryRequests((prev)=>prev.map((r)=>r.id === requestId ? {
                    ...r,
                    status,
                    lastUpdate: `Status updated to ${status} today`
                } : r));
    };
    const addIndustryMessage = (requestId, text)=>{
        setIndustryRequests((prev)=>prev.map((r)=>{
                if (r.id !== requestId) return r;
                const newMsg = {
                    id: `msg-${Date.now()}`,
                    sender: profile.name,
                    role: "mentor",
                    text,
                    timestamp: "Just now"
                };
                return {
                    ...r,
                    messages: [
                        ...r.messages || [],
                        newMsg
                    ],
                    lastUpdate: "New message sent"
                };
            }));
    };
    const sendUniversityUpdate = (params)=>{
        const challenge = challenges.find((c)=>c.id === params.challengeId);
        const challengeTitle = challenge ? challenge.title : "Challenge";
        const newUpdate = {
            id: `upd-${Date.now()}`,
            challengeId: params.challengeId,
            challengeTitle,
            date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            progress: params.progress,
            title: params.title,
            workCompleted: params.workCompleted,
            currentWork: params.currentWork,
            blockers: params.blockers,
            studentPerformance: params.studentPerformance,
            industrySupport: params.industrySupport,
            nextSteps: params.nextSteps,
            expectedCompletionDate: params.expectedCompletionDate,
            attachments: params.attachments
        };
        setUniversityUpdates((prev)=>[
                newUpdate,
                ...prev
            ]);
        // Update challenge progress and notes
        setChallenges((prev)=>prev.map((c)=>c.id === params.challengeId ? {
                    ...c,
                    progress: Math.max(c.progress, params.progress),
                    mentorNotes: `Latest University Update: ${params.title}`
                } : c));
        // Update team progress if exists
        const team = teams.find((t)=>t.challengeId === params.challengeId);
        if (team) {
            setTeams((prev)=>prev.map((t)=>t.id === team.id ? {
                        ...t,
                        progress: Math.max(t.progress, params.progress),
                        lastActivity: `Progress update sent to University`
                    } : t));
        }
        // Add activity
        setActivities((prev)=>[
                {
                    id: `act-${Date.now()}`,
                    type: "university_update",
                    text: `Sent progress update (${params.progress}%) to University for '${challengeTitle}'`,
                    timestamp: "Just now",
                    actorName: profile.name,
                    actorAvatar: profile.avatar,
                    challengeTitle
                },
                ...prev
            ]);
        // Add notification
        setNotifications((prev)=>[
                {
                    id: `notif-${Date.now()}`,
                    type: "university_update",
                    title: "Progress Update Dispatched",
                    message: `University Coordinator notified of milestone: "${params.title}" (${params.progress}% complete).`,
                    timeAgo: "Just now",
                    isRead: false,
                    link: `/mentor/challenges/${params.challengeId}`,
                    relatedChallengeTitle: challengeTitle
                },
                ...prev
            ]);
        return {
            success: true
        };
    };
    const markNotificationRead = (id)=>{
        setNotifications((prev)=>prev.map((n)=>n.id === id ? {
                    ...n,
                    isRead: true
                } : n));
    };
    const markAllNotificationsRead = ()=>{
        setNotifications((prev)=>prev.map((n)=>({
                    ...n,
                    isRead: true
                })));
    };
    const updateProfile = (updated)=>{
        setProfile((prev)=>({
                ...prev,
                ...updated
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MentorContext.Provider, {
        value: {
            profile,
            challenges,
            teams,
            students,
            tasks,
            industryRequests,
            universityUpdates,
            notifications,
            activities,
            unreadNotificationsCount,
            createTeam,
            getTeamForChallenge,
            createTask,
            updateTaskStatus,
            reviewTask,
            createIndustryRequest,
            updateIndustryRequestStatus,
            addIndustryMessage,
            sendUniversityUpdate,
            markNotificationRead,
            markAllNotificationsRead,
            updateProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/MentorContext.tsx",
        lineNumber: 618,
        columnNumber: 5
    }, this);
}
function useMentor() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(MentorContext);
    if (!context) {
        throw new Error("useMentor must be used within a MentorProvider");
    }
    return context;
}
}),
"[project]/data/mentorMockData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initialActivities",
    ()=>initialActivities,
    "initialChallenges",
    ()=>initialChallenges,
    "initialIndustryRequests",
    ()=>initialIndustryRequests,
    "initialMentorNotifications",
    ()=>initialMentorNotifications,
    "initialMentorProfile",
    ()=>initialMentorProfile,
    "initialStudents",
    ()=>initialStudents,
    "initialTasks",
    ()=>initialTasks,
    "initialTeams",
    ()=>initialTeams,
    "initialUniversityUpdates",
    ()=>initialUniversityUpdates
]);
const initialMentorProfile = {
    name: "Dr. Rajesh Kulkarni",
    designation: "Associate Professor",
    department: "Computer Engineering & AI/ML",
    university: "Bharati Vidyapeeth University",
    email: "r.kulkarni@bvuniversity.edu.in",
    phone: "+91 98765 43210",
    avatar: "RK",
    bio: "Associate Professor at Bharati Vidyapeeth University with over 12 years of experience in applied Machine Learning, Computer Vision, and IoT systems. Has successfully mentored 7 societal impact initiatives and published 25+ research papers.",
    expertise: [
        "Applied Machine Learning",
        "Computer Vision",
        "IoT Systems Architecture",
        "Edge AI Deployment",
        "AgriTech Solutions"
    ],
    experienceYears: 12,
    specializations: [
        "Deep Neural Networks",
        "Smart City Infrastructure",
        "Embedded Vision",
        "Predictive Modeling"
    ],
    assignedChallengesCount: 4,
    activeTeamsCount: 2,
    studentsMentoredCount: 14,
    completedProjectsCount: 7
};
const initialStudents = [
    {
        id: "stu-1",
        name: "Aarav Patil",
        avatar: "AP",
        email: "aarav.patil@student.bvu.edu",
        department: "AI & Machine Learning",
        year: "2nd Year",
        skills: [
            "Python",
            "ML",
            "Computer Vision",
            "OpenCV"
        ],
        expertise: "Computer Vision & Image Classification",
        workload: 40,
        availability: "Available",
        status: "On Track",
        completedTasks: 3,
        pendingTasks: 1,
        lastActivity: "Submitted Dataset Preprocessing 2h ago"
    },
    {
        id: "stu-2",
        name: "Priya Sharma",
        avatar: "PS",
        email: "priya.sharma@student.bvu.edu",
        department: "AI & Machine Learning",
        year: "3rd Year",
        skills: [
            "PyTorch",
            "Deep Learning",
            "Data Analysis",
            "Python"
        ],
        expertise: "Neural Network Architecture & Training",
        workload: 65,
        availability: "Limited",
        status: "On Track",
        completedTasks: 5,
        pendingTasks: 2,
        lastActivity: "Updated Training Metrics 4h ago"
    },
    {
        id: "stu-3",
        name: "Rahul Patil",
        avatar: "RP",
        email: "rahul.patil@student.bvu.edu",
        department: "Computer Engineering",
        year: "3rd Year",
        skills: [
            "FastAPI",
            "React",
            "Node.js",
            "PostgreSQL"
        ],
        expertise: "REST APIs & Backend Microservices",
        workload: 45,
        availability: "Available",
        status: "Needs Attention",
        completedTasks: 2,
        pendingTasks: 2,
        lastActivity: "Requested Feedback on API Schema 1d ago"
    },
    {
        id: "stu-4",
        name: "Sneha Kulkarni",
        avatar: "SK",
        email: "sneha.kulkarni@student.bvu.edu",
        department: "Information Technology",
        year: "4th Year",
        skills: [
            "UI/UX Design",
            "Next.js",
            "Tailwind CSS",
            "Figma"
        ],
        expertise: "Responsive Interfaces & User Experience",
        workload: 85,
        availability: "Busy",
        status: "Overloaded",
        completedTasks: 6,
        pendingTasks: 3,
        lastActivity: "Pushed UI Components 5h ago"
    },
    {
        id: "stu-5",
        name: "Amit Jadhav",
        avatar: "AJ",
        email: "amit.jadhav@student.bvu.edu",
        department: "AI & Machine Learning",
        year: "3rd Year",
        skills: [
            "Computer Vision",
            "OpenCV",
            "TensorFlow",
            "NumPy"
        ],
        expertise: "Object Detection & Model Quantization",
        workload: 50,
        availability: "Available",
        status: "On Track",
        completedTasks: 4,
        pendingTasks: 1,
        lastActivity: "Ran inference benchmarks yesterday"
    },
    {
        id: "stu-6",
        name: "Vijay Bhosale",
        avatar: "VB",
        email: "vijay.bhosale@student.bvu.edu",
        department: "Electronics & Telecom",
        year: "3rd Year",
        skills: [
            "IoT Sensors",
            "ESP32",
            "MQTT",
            "C++"
        ],
        expertise: "Sensor Integration & Hardware Prototyping",
        workload: 30,
        availability: "Available",
        status: "On Track",
        completedTasks: 3,
        pendingTasks: 0,
        lastActivity: "Uploaded hardware test logs 3h ago"
    },
    {
        id: "stu-7",
        name: "Meera Joshi",
        avatar: "MJ",
        email: "meera.joshi@student.bvu.edu",
        department: "Computer Engineering",
        year: "2nd Year",
        skills: [
            "PostgreSQL",
            "Docker",
            "Python",
            "Cloud API"
        ],
        expertise: "Database Optimization & Cloud Deployment",
        workload: 55,
        availability: "Available",
        status: "On Track",
        completedTasks: 3,
        pendingTasks: 1,
        lastActivity: "Configured PostgreSQL migration 6h ago"
    },
    {
        id: "stu-8",
        name: "Rohan Deshmukh",
        avatar: "RD",
        email: "rohan.deshmukh@student.bvu.edu",
        department: "AI & Machine Learning",
        year: "4th Year",
        skills: [
            "Reinforcement Learning",
            "TensorFlow",
            "MLOps",
            "Edge AI"
        ],
        expertise: "Real-Time Adaptive Models & Edge Inference",
        workload: 90,
        availability: "Busy",
        status: "Overloaded",
        completedTasks: 8,
        pendingTasks: 1,
        lastActivity: "Deployed v1.2 model container yesterday"
    },
    {
        id: "stu-9",
        name: "Neha Joshi",
        avatar: "NJ",
        email: "neha.joshi@student.bvu.edu",
        department: "Information Technology",
        year: "2nd Year",
        skills: [
            "Frontend",
            "Tailwind CSS",
            "TypeScript",
            "Accessibility"
        ],
        expertise: "Web Accessibility & Clean Component Design",
        workload: 25,
        availability: "Available",
        status: "On Track",
        completedTasks: 2,
        pendingTasks: 0,
        lastActivity: "Completed accessibility audit 2d ago"
    },
    {
        id: "stu-10",
        name: "Vikram Shinde",
        avatar: "VS",
        email: "vikram.shinde@student.bvu.edu",
        department: "Civil Engineering",
        year: "3rd Year",
        skills: [
            "GIS Mapping",
            "Hydrology Modeling",
            "AutoCAD",
            "Surveying"
        ],
        expertise: "Geospatial Analysis & Elevation Modeling",
        workload: 35,
        availability: "Available",
        status: "On Track",
        completedTasks: 3,
        pendingTasks: 1,
        lastActivity: "Updated flood contour map 1d ago"
    },
    {
        id: "stu-11",
        name: "Lata Shinde",
        avatar: "LS",
        email: "lata.shinde@student.bvu.edu",
        department: "Computer Engineering",
        year: "3rd Year",
        skills: [
            "Testing & QA",
            "Postman",
            "Jest",
            "Documentation"
        ],
        expertise: "Software Quality Assurance & Technical Writing",
        workload: 35,
        availability: "Available",
        status: "On Track",
        completedTasks: 3,
        pendingTasks: 1,
        lastActivity: "Drafted test coverage report 4h ago"
    },
    {
        id: "stu-12",
        name: "Aditya Rao",
        avatar: "AR",
        email: "aditya.rao@student.bvu.edu",
        department: "AI & Machine Learning",
        year: "3rd Year",
        skills: [
            "Pandas",
            "Matplotlib",
            "Data Pipelines",
            "Scikit-Learn"
        ],
        expertise: "Exploratory Data Analysis & Statistical Validation",
        workload: 40,
        availability: "Available",
        status: "On Track",
        completedTasks: 2,
        pendingTasks: 1,
        lastActivity: "Processed agricultural weather data 8h ago"
    },
    {
        id: "stu-13",
        name: "Pooja Kadam",
        avatar: "PK",
        email: "pooja.kadam@student.bvu.edu",
        department: "Electronics & Telecom",
        year: "2nd Year",
        skills: [
            "Sensor Interfacing",
            "Arduino",
            "Soldering",
            "Circuit Design"
        ],
        expertise: "Hardware Prototyping & Sensor Testing",
        workload: 20,
        availability: "Available",
        status: "On Track",
        completedTasks: 1,
        pendingTasks: 0,
        lastActivity: "Benchmarked bin depth sensor 2d ago"
    },
    {
        id: "stu-14",
        name: "Gaurav More",
        avatar: "GM",
        email: "gaurav.more@student.bvu.edu",
        department: "Computer Engineering",
        year: "4th Year",
        skills: [
            "System Architecture",
            "Security",
            "Kubernetes",
            "Linux"
        ],
        expertise: "DevOps, Security Audits & Resilient Architecture",
        workload: 70,
        availability: "Limited",
        status: "Needs Attention",
        completedTasks: 5,
        pendingTasks: 2,
        lastActivity: "Reviewed secure API gateways 1d ago"
    }
];
const initialChallenges = [
    {
        id: "CH-311",
        title: "AI-Based Early Detection of Crop Diseases",
        description: "Smallholder farmers in the Baramati region experience 30-40% harvest loss every season due to fungal and bacterial crop infections that go undetected in early stages. The project aims to develop an offline-capable mobile diagnostic tool using computer vision and edge AI models to detect leaf pathogens in early stages and suggest targeted, cost-effective bio-treatments.",
        category: "Agriculture + AI/ML",
        university: "Bharati Vidyapeeth University",
        assignedDepartment: "Artificial Intelligence & Machine Learning",
        supportingDepartments: [
            "Computer Engineering",
            "Information Technology"
        ],
        assignedDate: "Jan 18, 2025",
        deadline: "May 30, 2025",
        priority: "High",
        status: "Team Creation Pending",
        progress: 0,
        industrySupportStatus: "Industry Support Required",
        citizenName: "Sunil Pawar",
        citizenAvatar: "SP",
        location: "Baramati Agricultural Zone, Pune District, Maharashtra",
        supportersCount: 489,
        requirements: [
            "Offline-first mobile vision inference under 150MB package size",
            "Detection of 12 common blight, rust, and spot pathogens across soybean & tomato crops",
            "Multilingual advisory in Marathi and Hindi with dosage calculators",
            "Integration with agricultural weather APIs for preventive spore dispersal warnings"
        ],
        requiredSkills: [
            "Python",
            "Machine Learning",
            "Computer Vision",
            "Data Analysis",
            "FastAPI",
            "Mobile Edge AI"
        ],
        aiAnalysis: {
            category: "Agriculture",
            classification: "Computer Vision + Machine Learning",
            requiredSkills: [
                "Python",
                "Machine Learning",
                "Computer Vision",
                "Data Analysis"
            ],
            suggestedTechnologies: [
                "Python",
                "FastAPI",
                "OpenCV",
                "PostgreSQL",
                "Cloud API"
            ],
            suggestedIndustryExpertise: [
                "Agriculture technology",
                "Computer vision",
                "Cloud infrastructure"
            ],
            confidence: 92,
            summary: "The problem requires lightweight convolutional neural network architectures for leaf disease classification combined with localized micro-climate risk modeling. Agriculture domain partners are recommended for ground-truth field sample validation."
        },
        mentorNotes: "Assigned by BVU Dean on Jan 18. High societal impact for regional farming clusters. Needs a multidisciplinary team combining computer vision and mobile deployment skills."
    },
    {
        id: "CH-302",
        title: "Smart Waste Management System for Urban Areas",
        description: "Traditional municipal waste collection in Dhankawadi suffers from overflow, uncoordinated pickup routes, and delayed clearance. This project implements ultrasonic IoT bin sensors connected to a centralized dispatch engine that leverages genetic algorithms and real-time vehicle telemetry to optimize municipal waste collection routes, reducing diesel usage by 25%.",
        category: "Environment",
        university: "Bharati Vidyapeeth University",
        assignedDepartment: "Electronics & Telecom",
        supportingDepartments: [
            "Computer Engineering",
            "AI & Machine Learning"
        ],
        assignedDate: "Jan 8, 2025",
        deadline: "Apr 25, 2025",
        priority: "High",
        status: "Team Active",
        progress: 55,
        teamId: "team-2",
        industrySupportStatus: "In Progress",
        citizenName: "Amit Jadhav",
        citizenAvatar: "AJ",
        location: "Dhankawadi, Pune, Maharashtra",
        supportersCount: 287,
        requirements: [
            "Rugged battery-operated IoT ultrasonic fill-level monitors",
            "Dynamic route optimization engine accounting for traffic congestion",
            "Sanitation officer mobile dispatch and citizen escalation dashboard"
        ],
        requiredSkills: [
            "IoT Sensors",
            "MQTT / LoRaWAN",
            "Python / FastAPI",
            "Route Optimization Algorithms",
            "React Dashboard"
        ],
        aiAnalysis: {
            category: "Environment",
            classification: "IoT Telemetry + Route Optimization",
            requiredSkills: [
                "IoT Sensors",
                "Embedded C++",
                "Python",
                "Spatial Algorithms"
            ],
            suggestedTechnologies: [
                "ESP32",
                "MQTT Broker",
                "FastAPI",
                "PostgreSQL / PostGIS"
            ],
            suggestedIndustryExpertise: [
                "Waste Management Utilities",
                "IoT Hardware Vendors"
            ],
            confidence: 91,
            summary: "High degree of hardware-software integration. Sensor calibration and enclosure durability in outdoor Indian weather conditions are crucial risk factors."
        },
        mentorNotes: "Sensors deployed in Ward 4 for pilot testing. Firmware stability is good. Working on route optimization backend."
    },
    {
        id: "CH-305",
        title: "Flood Early Warning System for Low-Lying Areas",
        description: "Low-lying riverbank settlements in Hadapsar face catastrophic flash flooding during monsoon cloudbursts. This initiative integrates ultrasonic river gauges, upstream rain telemetry, and predictive hydrological run-off modeling to forecast water levels 4 hours ahead, broadcasting automated siren and SMS alerts to 12,000 residents.",
        category: "Infrastructure",
        university: "Bharati Vidyapeeth University",
        assignedDepartment: "Civil Engineering",
        supportingDepartments: [
            "Electronics & Telecom",
            "AI & Machine Learning"
        ],
        assignedDate: "Dec 28, 2024",
        deadline: "May 15, 2025",
        priority: "Critical",
        status: "Industry Collaboration Active",
        progress: 78,
        teamId: "team-3",
        industrySupportStatus: "Collaboration Active",
        citizenName: "Sneha Kulkarni",
        citizenAvatar: "SK",
        location: "Hadapsar, Pune, Maharashtra",
        supportersCount: 445,
        requirements: [
            "Solar-backed river gauge telemetry stations with GSM failover",
            "Predictive hydrological runoff modeling using hourly rainfall feeds",
            "Automated mass SMS and municipal siren relay trigger"
        ],
        requiredSkills: [
            "Hydrological Modeling",
            "IoT Telemetry",
            "Deep Learning",
            "GIS Spatial Mapping",
            "Cloud Infrastructure"
        ],
        aiAnalysis: {
            category: "Infrastructure",
            classification: "Predictive Hydrology + Edge Telemetry",
            requiredSkills: [
                "GIS Analysis",
                "Time-Series ML",
                "Embedded Systems"
            ],
            suggestedTechnologies: [
                "Python",
                "TensorFlow",
                "PostGIS",
                "AWS IoT Core"
            ],
            suggestedIndustryExpertise: [
                "Meteorological Services",
                "Cloud Infrastructure"
            ],
            confidence: 89,
            summary: "Real-time hydrological forecasting requires low-latency cloud infrastructure and historical gauge data calibration. AWS research credits successfully secured."
        },
        mentorNotes: "AWS research credits active. Field sensors transmitting reliable readings. Preparing university progress update for Stage 12."
    },
    {
        id: "CH-306",
        title: "Traffic Signal Optimization Using AI",
        description: "Major traffic choke points along FC Road and JM Road experience heavy congestion and gridlock during peak commute hours. The project deployed adaptive reinforcement learning traffic controllers utilizing computer vision camera feeds to dynamically balance green light durations based on vehicle queue density, reducing commute times by 22%.",
        category: "Transportation",
        university: "Bharati Vidyapeeth University",
        assignedDepartment: "AI & Machine Learning",
        supportingDepartments: [
            "Electronics & Telecom",
            "Computer Engineering"
        ],
        assignedDate: "Dec 25, 2024",
        deadline: "Feb 28, 2025",
        priority: "High",
        status: "Completed",
        progress: 100,
        teamId: "team-4",
        industrySupportStatus: "Completed",
        citizenName: "Rohan Deshmukh",
        citizenAvatar: "RD",
        location: "FC Road & JM Road, Pune, Maharashtra",
        supportersCount: 634,
        requirements: [
            "YOLOv8 vehicle detection on junction CCTV feeds",
            "Deep Q-Network adaptive cycle timing algorithm",
            "Municipal traffic control room dashboard integration"
        ],
        requiredSkills: [
            "Reinforcement Learning",
            "Computer Vision",
            "Edge Computing",
            "System Architecture"
        ],
        aiAnalysis: {
            category: "Transportation",
            classification: "Reinforcement Learning + Traffic Vision",
            requiredSkills: [
                "Deep Q-Networks",
                "YOLOv8",
                "Python",
                "Real-Time Telemetry"
            ],
            suggestedTechnologies: [
                "PyTorch",
                "OpenCV",
                "FastAPI",
                "NVIDIA Jetson"
            ],
            suggestedIndustryExpertise: [
                "Urban Traffic Authorities",
                "Edge Computing"
            ],
            confidence: 97,
            summary: "Full production deployment achieved with Pune Municipal Traffic Department approval. Pilot validation showed 22% delay reduction."
        },
        mentorNotes: "Project successfully completed and handed over to Pune Traffic Police. Outstanding performance by student team."
    }
];
const initialTeams = [
    {
        id: "team-2",
        name: "Team GreenUrban",
        challengeId: "CH-302",
        challengeTitle: "Smart Waste Management System for Urban Areas",
        description: "Interdisciplinary squad combining IoT embedded engineers, ML route optimizers, and web engineers building smart municipal waste operations.",
        objective: "Deliver a field-tested IoT fill-monitoring prototype and adaptive route guidance app for municipal drivers.",
        leaderStudentId: "stu-5",
        studentIds: [
            "stu-5",
            "stu-6",
            "stu-3",
            "stu-13"
        ],
        progress: 55,
        tasksTotal: 10,
        tasksCompleted: 6,
        tasksInProgress: 3,
        tasksPendingReview: 1,
        lastActivity: "Hardware sensor tests verified 3 hours ago",
        industrySupport: "TCS IoT Lab hardware guidance",
        status: "Active",
        createdAt: "Jan 12, 2025",
        progressBreakdown: {
            research: 100,
            dataCollection: 85,
            modelDevelopment: 60,
            backend: 50,
            testing: 35,
            documentation: 25
        }
    },
    {
        id: "team-3",
        name: "Team FloodGuard",
        challengeId: "CH-305",
        challengeTitle: "Flood Early Warning System for Low-Lying Areas",
        description: "Specialized engineering squad developing flood runoff predictive neural networks and emergency broadcast telecommunications.",
        objective: "Deploy 4 river telemetry sensor stations and achieve 4-hour advance flood forecast warning with >88% precision.",
        leaderStudentId: "stu-2",
        studentIds: [
            "stu-2",
            "stu-4",
            "stu-7",
            "stu-10"
        ],
        progress: 78,
        tasksTotal: 14,
        tasksCompleted: 10,
        tasksInProgress: 3,
        tasksPendingReview: 1,
        lastActivity: "Priya submitted Runoff Model evaluation 4h ago",
        industrySupport: "AWS Cloud GPU compute credits active",
        status: "Active",
        createdAt: "Jan 2, 2025",
        progressBreakdown: {
            research: 100,
            dataCollection: 95,
            modelDevelopment: 85,
            backend: 75,
            testing: 60,
            documentation: 50
        }
    },
    {
        id: "team-4",
        name: "Team TrafficFlow",
        challengeId: "CH-306",
        challengeTitle: "Traffic Signal Optimization Using AI",
        description: "High-performance AI & systems team that built and deployed the adaptive junction traffic controller.",
        objective: "Deliver deployed RL adaptive controller at FC Road junction with live traffic police integration.",
        leaderStudentId: "stu-8",
        studentIds: [
            "stu-8",
            "stu-1",
            "stu-9",
            "stu-14"
        ],
        progress: 100,
        tasksTotal: 16,
        tasksCompleted: 16,
        tasksInProgress: 0,
        tasksPendingReview: 0,
        lastActivity: "Final handover documentation signed off",
        industrySupport: "Pune Traffic Police & Tech Mahindra",
        status: "Completed",
        createdAt: "Dec 26, 2024",
        progressBreakdown: {
            research: 100,
            dataCollection: 100,
            modelDevelopment: 100,
            backend: 100,
            testing: 100,
            documentation: 100
        }
    }
];
const initialTasks = [
    {
        id: "task-101",
        title: "PlantVillage Dataset Augmentation & Cleaning",
        description: "Preprocess 15,000 leaf disease images: normalize lighting variations, perform rotational augmentations, and structure into 12 distinct pathogen classes.",
        teamId: "team-1",
        teamName: "Team Phoenix",
        challengeId: "CH-311",
        assignedStudentId: "stu-1",
        assignedStudentName: "Aarav Patil",
        assignedStudentAvatar: "AP",
        priority: "High",
        deadline: "Feb 10, 2025",
        status: "Submitted",
        expectedOutput: "Cleaned dataset in TFRecord format with validation split metrics and sample notebook.",
        submission: {
            submittedAt: "Feb 06, 2025 at 11:30 AM",
            description: "Completed 15,000 image augmentation pipeline using Albumentations. Balance checks verified across 12 crop disease classes. Training notebook and validation report attached.",
            files: [
                "dataset_metrics_report.pdf",
                "augmentations_preview.png"
            ],
            links: [
                "https://github.com/bvu-sih/crop-disease-data/releases/v0.9"
            ],
            comments: "Please review the class weighting for Early Tomato Blight - it had fewer samples in the raw set."
        },
        createdAt: "Jan 22, 2025"
    },
    {
        id: "task-102",
        title: "MobileNetV3 Backbone Fine-Tuning for Leaf Blight",
        description: "Train a lightweight quantized MobileNetV3 model capable of sub-50ms inference on budget smartphones.",
        teamId: "team-1",
        teamName: "Team Phoenix",
        challengeId: "CH-311",
        assignedStudentId: "stu-2",
        assignedStudentName: "Priya Sharma",
        assignedStudentAvatar: "PS",
        priority: "Critical",
        deadline: "Feb 14, 2025",
        status: "In Progress",
        expectedOutput: "TFLite quantized model file under 25MB achieving >91% Top-1 validation accuracy.",
        createdAt: "Jan 25, 2025"
    },
    {
        id: "task-103",
        title: "FastAPI Leaf Pathology Inference Endpoint",
        description: "Develop async FastAPI backend endpoint accepting multipart image uploads and returning pathogen bounding boxes and confidence score.",
        teamId: "team-1",
        teamName: "Team Phoenix",
        challengeId: "CH-311",
        assignedStudentId: "stu-3",
        assignedStudentName: "Rahul Patil",
        assignedStudentAvatar: "RP",
        priority: "Medium",
        deadline: "Feb 18, 2025",
        status: "To Do",
        expectedOutput: "Swagger documented API route with rate limiting and automated unit test suite.",
        createdAt: "Jan 28, 2025"
    },
    {
        id: "task-104",
        title: "Ultrasonic Bin Fill Sensor Calibration",
        description: "Calibrate HC-SR04 ultrasonic sensors with temperature compensation in simulated wet and dry garbage environments.",
        teamId: "team-2",
        teamName: "Team GreenUrban",
        challengeId: "CH-302",
        assignedStudentId: "stu-6",
        assignedStudentName: "Vijay Bhosale",
        assignedStudentAvatar: "VB",
        priority: "High",
        deadline: "Feb 04, 2025",
        status: "Approved",
        expectedOutput: "Calibration curves and Arduino C++ firmware snippet with ±2cm precision guarantee.",
        submission: {
            submittedAt: "Feb 03, 2025 at 4:15 PM",
            description: "Tested 8 sensor modules across temperature range 18°C to 42°C. Implemented moving average filter to reject false reflections from garbage bags.",
            files: [
                "calibration_curves.pdf"
            ],
            links: [
                "https://github.com/bvu-sih/greenurban-firmware"
            ],
            feedback: "Excellent precision validation. Good job filtering out plastic bag acoustic reflection noise."
        },
        createdAt: "Jan 15, 2025"
    },
    {
        id: "task-105",
        title: "Genetic Route Optimization Engine",
        description: "Implement multi-depot vehicle routing algorithm prioritizing overflowing bins while minimizing diesel burn.",
        teamId: "team-2",
        teamName: "Team GreenUrban",
        challengeId: "CH-302",
        assignedStudentId: "stu-5",
        assignedStudentName: "Amit Jadhav",
        assignedStudentAvatar: "AJ",
        priority: "Critical",
        deadline: "Feb 12, 2025",
        status: "Under Review",
        expectedOutput: "Python algorithm module with benchmark comparisons against static round-robin pickup.",
        submission: {
            submittedAt: "Feb 07, 2025 at 09:20 AM",
            description: "Implemented Genetic Algorithm with 200 generations. Benchmarked on Ward 4 coordinates; shows 24.6% distance reduction compared to current municipal route.",
            files: [
                "route_comparison_benchmark.pdf"
            ],
            links: [
                "https://colab.research.google.com/drive/sample-route-sim"
            ],
            comments: "Need mentor sign-off on time penalty constants for rush-hour windows."
        },
        createdAt: "Jan 18, 2025"
    },
    {
        id: "task-106",
        title: "Emergency Siren & SMS Gateway Integration",
        description: "Integrate municipal bulk SMS API with twilio backup and IoT GPIO relay for flood evacuation sirens.",
        teamId: "team-3",
        teamName: "Team FloodGuard",
        challengeId: "CH-305",
        assignedStudentId: "stu-7",
        assignedStudentName: "Meera Joshi",
        assignedStudentAvatar: "MJ",
        priority: "High",
        deadline: "Feb 09, 2025",
        status: "Changes Requested",
        expectedOutput: "Automated broadcast trigger script with 99.9% delivery acknowledgment tracking.",
        submission: {
            submittedAt: "Feb 02, 2025",
            description: "Implemented standard Twilio SMS webhook.",
            files: [],
            links: [],
            changesRequestedReason: "The current implementation lacks fallback for offline network drops. Please add regional telecom SMS gateway failover and offline queue retry logic."
        },
        createdAt: "Jan 20, 2025"
    },
    {
        id: "task-107",
        title: "Hydrological Runoff Elevation Contour Mapping",
        description: "Ingest Pune municipal GIS elevation data and create 1-meter contour flood simulation grids.",
        teamId: "team-3",
        teamName: "Team FloodGuard",
        challengeId: "CH-305",
        assignedStudentId: "stu-10",
        assignedStudentName: "Vikram Shinde",
        assignedStudentAvatar: "VS",
        priority: "High",
        deadline: "Feb 05, 2025",
        status: "Completed",
        expectedOutput: "GeoJSON contour layers and interactive Leaflet map component.",
        createdAt: "Jan 10, 2025"
    },
    {
        id: "task-108",
        title: "Real-time Traffic Density Inference Optimization",
        description: "Optimize YOLOv8 nano model via TensorRT for 30 FPS inference on NVIDIA Jetson Orin edge unit.",
        teamId: "team-4",
        teamName: "Team TrafficFlow",
        challengeId: "CH-306",
        assignedStudentId: "stu-8",
        assignedStudentName: "Rohan Deshmukh",
        assignedStudentAvatar: "RD",
        priority: "Critical",
        deadline: "Jan 20, 2025",
        status: "Completed",
        expectedOutput: "Benchmarked engine file achieving >28 FPS with <2% mAP drop.",
        createdAt: "Jan 05, 2025"
    }
];
const initialIndustryRequests = [
    {
        id: "collab-201",
        challengeId: "CH-311",
        challengeTitle: "AI-Based Early Detection of Crop Diseases",
        teamId: "team-1",
        teamName: "Team Phoenix",
        helpType: "API",
        organization: "Skymet Weather Services",
        requestTitle: "Real-Time Microclimate & Spore Dispersal Weather API Access",
        requirement: "The student team needs hyper-local 1km-grid hourly temperature, humidity, and leaf wetness API data for the Baramati agricultural cluster.",
        whyNeeded: "Fungal spores (such as Early Blight) disperse rapidly under relative humidity >85% and temperatures between 24-29°C. Integrating weather telemetry enables 48-hour advance predictive advisories to farmers before visible leaf lesions appear.",
        expectedSupport: "Developer API key access for 6 months with up to 5,000 daily requests, plus technical schema documentation.",
        priority: "High",
        requiredBy: "Feb 20, 2025",
        status: "Under Review",
        dateSubmitted: "Jan 25, 2025",
        lastUpdate: "Jan 28, 2025",
        attachmentName: "baramati_weather_integration_proposal.pdf",
        details: {
            apiToolName: "Skymet Agri-Weather REST API v3",
            purpose: "Disease epidemic prediction modeling",
            expectedUsage: "5,000 queries/day for 6 months",
            accessDuration: "6 Months"
        },
        messages: [
            {
                id: "msg-1",
                sender: "Dr. Rajesh Kulkarni",
                role: "mentor",
                text: "Submitted request for Skymet Agri-Weather REST API access for student crop disease research initiative.",
                timestamp: "Jan 25, 2025 at 10:15 AM"
            },
            {
                id: "msg-2",
                sender: "Skymet Academic Relations",
                role: "industry",
                text: "Thank you Dr. Kulkarni. Our data science team is reviewing your query volume requirements. We anticipate approving academic sandbox access by early next week.",
                timestamp: "Jan 28, 2025 at 03:40 PM"
            }
        ]
    },
    {
        id: "collab-202",
        challengeId: "CH-305",
        challengeTitle: "Flood Early Warning System for Low-Lying Areas",
        teamId: "team-3",
        teamName: "Team FloodGuard",
        helpType: "Cloud Resources",
        organization: "Amazon Web Services (AWS) Educate",
        requestTitle: "AWS High-Memory GPU Clusters for Hydrology Runoff Modeling",
        requirement: "Access to AWS EC2 p3.2xlarge instances with Tesla V100 GPUs to train recursive spatio-temporal hydrological forecasting models.",
        whyNeeded: "University on-premise compute was taking 14+ hours per training epoch on large rainfall satellite grids.",
        expectedSupport: "$2,500 in AWS Research Compute Credits and Cloud Architecture Mentorship.",
        priority: "Critical",
        requiredBy: "Jan 15, 2025",
        status: "Accepted",
        dateSubmitted: "Jan 03, 2025",
        lastUpdate: "Jan 08, 2025",
        attachmentName: "aws_hydrology_grant_proposal.pdf",
        details: {
            cloudSpecs: "EC2 p3.2xlarge (1x Tesla V100 16GB, 8 vCPUs, 61GB RAM)",
            purpose: "Runoff deep neural network training",
            accessDuration: "4 Months"
        },
        messages: [
            {
                id: "msg-3",
                sender: "Dr. Rajesh Kulkarni",
                role: "mentor",
                text: "Requested $2,500 AWS credits for Hadapsar flood simulation modeling.",
                timestamp: "Jan 03, 2025 at 11:00 AM"
            },
            {
                id: "msg-4",
                sender: "AWS Research Grant Committee",
                role: "industry",
                text: "Your academic grant application has been approved. $2,500 promotional credits have been applied to your university AWS account.",
                timestamp: "Jan 08, 2025 at 05:20 PM"
            }
        ]
    },
    {
        id: "collab-203",
        challengeId: "CH-302",
        challengeTitle: "Smart Waste Management System for Urban Areas",
        teamId: "team-2",
        teamName: "Team GreenUrban",
        helpType: "Hardware",
        organization: "Tata Consultancy Services (TCS) IoT Lab",
        requestTitle: "Industrial-Grade Ultrasonic Transducers & LoRaWAN Dev Boards",
        requirement: "Loan of 10 IP67 weather-sealed ultrasonic distance sensors and 4 LoRaWAN field development gateways.",
        whyNeeded: "Consumer HC-SR04 sensors corrode rapidly when exposed to municipal organic waste leachate and rain.",
        expectedSupport: "Hardware loan for 90 days with 2 engineering support sessions from TCS IoT hardware specialists.",
        priority: "High",
        requiredBy: "Jan 20, 2025",
        status: "In Progress",
        dateSubmitted: "Jan 12, 2025",
        lastUpdate: "Jan 19, 2025",
        attachmentName: "hardware_specs_requisition.pdf",
        details: {
            hardwareSpecs: "IP67 Weatherproof Ultrasonic Transducers + Semtech LoRaWAN Transceivers",
            purpose: "Pilot deployment in Dhankawadi ward bins",
            accessDuration: "3 Months"
        },
        messages: [
            {
                id: "msg-5",
                sender: "Dr. Rajesh Kulkarni",
                role: "mentor",
                text: "Requested IP67 sensor loan from TCS IoT Innovation Lab.",
                timestamp: "Jan 12, 2025 at 02:30 PM"
            },
            {
                id: "msg-6",
                sender: "TCS Lab Lead",
                role: "industry",
                text: "Hardware kit dispatched to Bharati Vidyapeeth University CE department. First mentorship review scheduled for Friday.",
                timestamp: "Jan 19, 2025 at 11:15 AM"
            }
        ]
    }
];
const initialUniversityUpdates = [
    {
        id: "upd-301",
        challengeId: "CH-305",
        challengeTitle: "Flood Early Warning System for Low-Lying Areas",
        date: "Jan 28, 2025",
        progress: 78,
        title: "Stage 12: AWS Cloud Training Complete & Field Sensor Telemetry Active",
        workCompleted: "The student team completed training of the predictive runoff model using AWS compute credits. 4 river telemetry sensor stations have been calibrated along the Mutha river basin and are reliably streaming data every 10 minutes.",
        currentWork: "Currently calibrating rainfall thresholds for the automatic siren broadcast trigger and building the administrative emergency dispatch interface.",
        blockers: "Need coordination with Pune Municipal Corporation (PMC) disaster cell for direct siren hardware relay access.",
        studentPerformance: "Priya Sharma and Sneha Kulkarni demonstrated outstanding technical execution in distributed telemetry and model convergence.",
        industrySupport: "AWS research grant active; $1,200 in credits utilized out of $2,500.",
        nextSteps: "Schedule municipal live simulation drill and integrate secondary SMS broadcast fallback gateway.",
        expectedCompletionDate: "May 15, 2025",
        attachments: [
            "Stage12_Evaluation_Report.pdf",
            "sensor_telemetry_metrics.csv"
        ]
    },
    {
        id: "upd-302",
        challengeId: "CH-305",
        challengeTitle: "Flood Early Warning System for Low-Lying Areas",
        date: "Jan 10, 2025",
        progress: 50,
        title: "Stage 8: Sensor Station Prototyping & GIS Elevation Ingestion",
        workCompleted: "Vikram Shinde completed the 1-meter elevation contour map for Hadapsar low-lying wards. Initial river depth sensor enclosure prototypes assembled.",
        currentWork: "Secured AWS compute grant to start training deep learning hydrological models.",
        blockers: "High memory GPU requirements needed for large grid runs.",
        studentPerformance: "Good progress across all 4 team members.",
        industrySupport: "AWS Educate application submitted and under review.",
        nextSteps: "Begin baseline runoff model training on GPU cluster.",
        expectedCompletionDate: "May 15, 2025"
    },
    {
        id: "upd-303",
        challengeId: "CH-302",
        challengeTitle: "Smart Waste Management System for Urban Areas",
        date: "Jan 24, 2025",
        progress: 55,
        title: "Stage 9: Sensor Hardware Testing & Route Optimization Baseline",
        workCompleted: "Completed testing of ultrasonic sensors with TCS IoT Lab guidance. Amit Jadhav completed baseline genetic algorithm showing 24% route savings.",
        currentWork: "Connecting driver mobile navigation app with real-time PostgreSQL database.",
        blockers: "Need permission to mount 5 test sensors on Dhankawadi ward street bins.",
        studentPerformance: "Vijay Bhosale and Amit Jadhav are working in strong synergy between hardware and algorithmic optimization.",
        industrySupport: "TCS IoT Lab has loaned 10 IP67 sensors.",
        nextSteps: "Conduct physical street bin deployment for 14-day field pilot.",
        expectedCompletionDate: "Apr 25, 2025",
        attachments: [
            "Ward4_Route_Simulation.pdf"
        ]
    }
];
const initialMentorNotifications = [
    {
        id: "notif-1",
        type: "assignment",
        title: "New Challenge Assigned by University",
        message: "Dr. Rajesh Kulkarni, 'AI-Based Early Detection of Crop Diseases' has been assigned to you by the University Coordinator. Please review the AI analysis and form a student team.",
        timeAgo: "2 hours ago",
        isRead: false,
        link: "/mentor/challenges/CH-311",
        relatedChallengeTitle: "AI-Based Early Detection of Crop Diseases"
    },
    {
        id: "notif-2",
        type: "submission",
        title: "Task Submitted: PlantVillage Dataset Augmentation",
        message: "Aarav Patil has submitted task 'PlantVillage Dataset Augmentation & Cleaning' for your review.",
        timeAgo: "3 hours ago",
        isRead: false,
        link: "/mentor/tasks",
        relatedChallengeTitle: "AI-Based Early Detection of Crop Diseases"
    },
    {
        id: "notif-3",
        type: "submission",
        title: "Task Submitted: Genetic Route Optimization",
        message: "Amit Jadhav has submitted 'Genetic Route Optimization Engine' for review on Team GreenUrban.",
        timeAgo: "5 hours ago",
        isRead: false,
        link: "/mentor/tasks",
        relatedChallengeTitle: "Smart Waste Management System for Urban Areas"
    },
    {
        id: "notif-4",
        type: "industry_accepted",
        title: "Industry Collaboration Update",
        message: "Skymet Weather Services sent a response regarding your Weather API request for Crop Disease Early Detection.",
        timeAgo: "1 day ago",
        isRead: false,
        link: "/mentor/collaboration",
        relatedChallengeTitle: "AI-Based Early Detection of Crop Diseases"
    },
    {
        id: "notif-5",
        type: "university_update",
        title: "University Coordinator Acknowledgment",
        message: "Dr. Ananya Sharma reviewed your Stage 12 Progress Update for 'Flood Early Warning System' and praised the team's milestone.",
        timeAgo: "1 day ago",
        isRead: true,
        link: "/mentor/challenges/CH-305",
        relatedChallengeTitle: "Flood Early Warning System for Low-Lying Areas"
    },
    {
        id: "notif-6",
        type: "deadline",
        title: "Approaching Task Deadline",
        message: "Task 'MobileNetV3 Backbone Fine-Tuning' assigned to Priya Sharma is due in 5 days.",
        timeAgo: "2 days ago",
        isRead: true,
        link: "/mentor/tasks",
        relatedChallengeTitle: "AI-Based Early Detection of Crop Diseases"
    },
    {
        id: "notif-7",
        type: "completed",
        title: "Solution Deployed: Traffic Signal AI",
        message: "Traffic Signal Optimization solution is now officially live at FC Road & JM Road intersections.",
        timeAgo: "4 days ago",
        isRead: true,
        link: "/mentor/challenges/CH-306",
        relatedChallengeTitle: "Traffic Signal Optimization Using AI"
    }
];
const initialActivities = [
    {
        id: "act-1",
        type: "task_submission",
        text: "Aarav Patil submitted task 'PlantVillage Dataset Augmentation & Cleaning'",
        timestamp: "2 hours ago",
        actorName: "Aarav Patil",
        actorAvatar: "AP",
        challengeTitle: "AI-Based Early Detection of Crop Diseases",
        teamName: "Team Phoenix"
    },
    {
        id: "act-2",
        type: "industry_update",
        text: "Skymet Weather Services reviewed and replied to your API Collaboration Request",
        timestamp: "5 hours ago",
        actorName: "Skymet",
        actorAvatar: "SW",
        challengeTitle: "AI-Based Early Detection of Crop Diseases"
    },
    {
        id: "act-3",
        type: "university_update",
        text: "Progress update for Stage 12 sent to University Coordinator",
        timestamp: "Yesterday",
        actorName: "Dr. Rajesh Kulkarni",
        actorAvatar: "RK",
        challengeTitle: "Flood Early Warning System for Low-Lying Areas"
    },
    {
        id: "act-4",
        type: "task_completed",
        text: "Vijay Bhosale completed task 'Ultrasonic Bin Fill Sensor Calibration'",
        timestamp: "2 days ago",
        actorName: "Vijay Bhosale",
        actorAvatar: "VB",
        challengeTitle: "Smart Waste Management System for Urban Areas",
        teamName: "Team GreenUrban"
    },
    {
        id: "act-5",
        type: "challenge_assigned",
        text: "University assigned new challenge 'AI-Based Early Detection of Crop Diseases'",
        timestamp: "3 days ago",
        actorName: "BVU Dean",
        actorAvatar: "BVU",
        challengeTitle: "AI-Based Early Detection of Crop Diseases"
    }
];
}),
];

//# sourceMappingURL=_1jc8v6-._.js.map