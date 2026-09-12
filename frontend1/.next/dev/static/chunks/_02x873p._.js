(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/mentor/MentorBottomNavigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MentorBottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-client] (ecmascript) <export default as Handshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/MentorContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const navItems = [
    {
        name: "Dashboard",
        href: "/mentor",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Challenges",
        href: "/mentor/challenges",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"]
    },
    {
        name: "Teams",
        href: "/mentor/teams",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"]
    },
    {
        name: "Tasks",
        href: "/mentor/tasks",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"]
    },
    {
        name: "Collab",
        href: "/mentor/collaboration",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__["Handshake"]
    },
    {
        name: "Alerts",
        href: "/mentor/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    }
];
function MentorBottomNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { unreadNotificationsCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMentor"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-1 py-1.5 shadow-lg lg:hidden",
        children: navItems.map(({ name, href, icon: Icon })=>{
            const isActive = pathname === href || href !== "/mentor" && pathname.startsWith(href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: `relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all ${isActive ? "text-emerald-700 font-semibold" : "text-slate-400 hover:text-slate-600"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 19,
                                strokeWidth: isActive ? 2.5 : 2
                            }, void 0, false, {
                                fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                                lineNumber: 46,
                                columnNumber: 15
                            }, this),
                            name === "Alerts" && unreadNotificationsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/components/mentor/MentorBottomNavigation.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this),
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_s(MentorBottomNavigation, "gFm4IIxLyQOU0U5aeFJxuH4+azQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMentor"]
    ];
});
_c = MentorBottomNavigation;
var _c;
__turbopack_context__.k.register(_c, "MentorBottomNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/mentor/MentorSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MentorSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-client] (ecmascript) <export default as Handshake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.mjs [app-client] (ecmascript) <export default as UserCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/MentorContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const navItems = [
    {
        name: "Dashboard",
        href: "/mentor",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "My Challenges",
        href: "/mentor/challenges",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"]
    },
    {
        name: "My Teams",
        href: "/mentor/teams",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"]
    },
    {
        name: "Tasks",
        href: "/mentor/tasks",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"]
    },
    {
        name: "Industry Collaboration",
        href: "/mentor/collaboration",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Handshake$3e$__["Handshake"]
    },
    {
        name: "Notifications",
        href: "/mentor/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        name: "Profile",
        href: "/mentor/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle2$3e$__["UserCircle2"]
    },
    {
        name: "Settings",
        href: "/mentor/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function MentorSidebar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { profile, unreadNotificationsCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMentor"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 border-b border-slate-100 px-6 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-sm text-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-sm font-bold text-slate-900 leading-tight truncate",
                                children: "SolveTogether"
                            }, void 0, false, {
                                fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-xs text-emerald-600 font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Mentor Portal"
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 46,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 47,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400",
                        children: "Main Menu"
                    }, void 0, false, {
                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    navItems.map(({ name, href, icon: Icon })=>{
                        const isActive = pathname === href || href !== "/mentor" && pathname.startsWith(href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-700"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: 18,
                                    className: isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1 truncate",
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this),
                                name === "Notifications" && unreadNotificationsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-slate-100 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100/80",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white shadow-sm",
                                        children: profile.avatar
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-[11px] text-slate-500 font-medium",
                                        children: profile.department
                                    }, void 0, false, {
                                        fileName: "[project]/components/mentor/MentorSidebar.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            alert("Logging out from Mentor Portal...");
                        },
                        className: "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
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
_s(MentorSidebar, "cqFcImpiK5e+RXENt07FmTjAApI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$MentorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMentor"]
    ];
});
_c = MentorSidebar;
var _c;
__turbopack_context__.k.register(_c, "MentorSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/MentorContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MentorProvider",
    ()=>MentorProvider,
    "useMentor",
    ()=>useMentor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/mentorMockData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const MentorContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function MentorProvider({ children }) {
    _s();
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialMentorProfile"]);
    const [challenges, setChallenges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialChallenges"]);
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTeams"]);
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialStudents"]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTasks"]);
    const [industryRequests, setIndustryRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialIndustryRequests"]);
    const [universityUpdates, setUniversityUpdates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialUniversityUpdates"]);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialMentorNotifications"]);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mentorMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialActivities"]);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MentorContext.Provider, {
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
_s(MentorProvider, "oXbzcO4vqVaQgknTxRVKodjoh7k=");
_c = MentorProvider;
function useMentor() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(MentorContext);
    if (!context) {
        throw new Error("useMentor must be used within a MentorProvider");
    }
    return context;
}
_s1(useMentor, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "MentorProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/mentorMockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$buildLucideIconForReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)");
"use strict";
"use client";
;
;
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color, size, width, height, strokeWidth, absoluteStrokeWidth, nonScalingStroke, className = "", children, iconNode = [], icon = {
    node: iconNode,
    aliases: [],
    size: 24
}, ...rest }, ref)=>{
    const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, nonScalingStroke: contextNonScalingStroke = false, color: contextColor = "currentColor", className: contextClass = "" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLucideContext"])() ?? {};
    const hasAccessibleProp = Boolean(children) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest);
    const [name, svgAttributes, builtIconNode = []] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$buildLucideIconForReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(icon, {
        color: color ?? contextColor,
        width: width ?? size ?? contextSize,
        height: height ?? size ?? contextSize,
        strokeWidth: strokeWidth ?? contextStrokeWidth,
        absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
        nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(contextClass, className),
        hasA11yProp: hasAccessibleProp,
        attributes: rest
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(name, {
        ref,
        ...svgAttributes
    }, [
        ...builtIconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
;
}),
"[project]/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LucideProvider",
    ()=>LucideProvider,
    "useLucideContext",
    ()=>useLucideContext
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use strict";
"use client";
;
const LucideContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
function LucideProvider({ children, size, color, strokeWidth, absoluteStrokeWidth, nonScalingStroke, className }) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LucideProvider.useMemo[value]": ()=>({
                size,
                color,
                strokeWidth,
                absoluteStrokeWidth,
                nonScalingStroke,
                className
            })
    }["LucideProvider.useMemo[value]"], [
        size,
        color,
        strokeWidth,
        absoluteStrokeWidth,
        nonScalingStroke,
        className
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(LucideContext.Provider, {
        value
    }, children);
}
const useLucideContext = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LucideContext);
;
}),
"[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toLucideIconData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)");
;
;
;
;
function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
    const iconData = typeof iconDataOrName === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toLucideIconData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toLucideIconData"])(iconDataOrName, iconNode, aliases) : iconDataOrName;
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            icon: iconData,
            className,
            ...props
        }));
    if (iconData.name) {
        Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconData.name);
    }
    return Component;
}
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Award
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "award",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
                key: "1yiouv"
            }
        ],
        [
            "circle",
            {
                cx: "12",
                cy: "8",
                r: "6",
                key: "1vp47v"
            }
        ]
    ]
};
__iconData.node;
const Award = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-client] (ecmascript) <export default as Award>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Award",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Bell
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "bell",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M10.268 21a2 2 0 0 0 3.464 0",
                key: "vwvbt9"
            }
        ],
        [
            "path",
            {
                d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
                key: "11g9vi"
            }
        ]
    ]
};
__iconData.node;
const Bell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Bell",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>CircleUserRound
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "circle-user-round",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M17.925 20.056a6 6 0 0 0-11.851.001",
                key: "z69sun"
            }
        ],
        [
            "circle",
            {
                cx: "12",
                cy: "11",
                r: "4",
                key: "1gt34v"
            }
        ],
        [
            "circle",
            {
                cx: "12",
                cy: "12",
                r: "10",
                key: "1mglay"
            }
        ]
    ],
    aliases: [
        "user-circle-2"
    ]
};
__iconData.node;
const CircleUserRound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.mjs [app-client] (ecmascript) <export default as UserCircle2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserCircle2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user-round.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Handshake
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "handshake",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m11 17 2 2a1 1 0 1 0 3-3",
                key: "efffak"
            }
        ],
        [
            "path",
            {
                d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
                key: "9pr0kb"
            }
        ],
        [
            "path",
            {
                d: "m21 3 1 11h-2",
                key: "1tisrp"
            }
        ],
        [
            "path",
            {
                d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",
                key: "1uvwmv"
            }
        ],
        [
            "path",
            {
                d: "M3 4h8",
                key: "1ep09j"
            }
        ]
    ]
};
__iconData.node;
const Handshake = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-client] (ecmascript) <export default as Handshake>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Handshake",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$handshake$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/handshake.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>LayoutDashboard
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "layout-dashboard",
    size: 24,
    node: [
        [
            "rect",
            {
                width: "7",
                height: "9",
                x: "3",
                y: "3",
                rx: "1",
                key: "10lvy0"
            }
        ],
        [
            "rect",
            {
                width: "7",
                height: "5",
                x: "14",
                y: "3",
                rx: "1",
                key: "16une8"
            }
        ],
        [
            "rect",
            {
                width: "7",
                height: "9",
                x: "14",
                y: "12",
                rx: "1",
                key: "1hutg5"
            }
        ],
        [
            "rect",
            {
                width: "7",
                height: "5",
                x: "3",
                y: "16",
                rx: "1",
                key: "ldoo1y"
            }
        ]
    ]
};
__iconData.node;
const LayoutDashboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript) <export default as LayoutDashboard>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayoutDashboard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>LogOut
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "log-out",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m16 17 5-5-5-5",
                key: "1bji2h"
            }
        ],
        [
            "path",
            {
                d: "M21 12H9",
                key: "dn1m92"
            }
        ],
        [
            "path",
            {
                d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                key: "1uf3rs"
            }
        ]
    ]
};
__iconData.node;
const LogOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogOut",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Settings
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "settings",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
                key: "1i5ecw"
            }
        ],
        [
            "circle",
            {
                cx: "12",
                cy: "12",
                r: "3",
                key: "1v7zrd"
            }
        ]
    ]
};
__iconData.node;
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Sparkles
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "sparkles",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
                key: "1s2grr"
            }
        ],
        [
            "path",
            {
                d: "M20 2v4",
                key: "1rf3ol"
            }
        ],
        [
            "path",
            {
                d: "M22 4h-4",
                key: "gwowj6"
            }
        ],
        [
            "circle",
            {
                cx: "4",
                cy: "20",
                r: "2",
                key: "6kqj1y"
            }
        ]
    ],
    aliases: [
        "stars"
    ]
};
__iconData.node;
const Sparkles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sparkles",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>SquareCheckBig
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "square-check-big",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
                key: "2acyp4"
            }
        ],
        [
            "path",
            {
                d: "m9 11 3 3L22 4",
                key: "1pflzl"
            }
        ]
    ],
    aliases: [
        "check-square"
    ]
};
__iconData.node;
const SquareCheckBig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckSquare",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>UsersRound
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "users-round",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M18 21a8 8 0 0 0-16 0",
                key: "3ypg7q"
            }
        ],
        [
            "circle",
            {
                cx: "10",
                cy: "8",
                r: "5",
                key: "o932ke"
            }
        ],
        [
            "path",
            {
                d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",
                key: "10s06x"
            }
        ]
    ],
    aliases: [
        "users-2"
    ]
};
__iconData.node;
const UsersRound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as Users2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Users2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>buildLucideIconForReact
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$buildLucideIconNode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs [app-client] (ecmascript)");
;
function buildLucideIconForReact(icon, params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$buildLucideIconNode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(icon, {
        ...params,
        attributeNames: {
            ...params.attributeNames,
            class: "className",
            "stroke-width": "strokeWidth",
            "stroke-linecap": "strokeLinecap",
            "stroke-linejoin": "strokeLinejoin",
            "vector-effect": "vectorEffect"
        }
    });
}
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>buildLucideIconNode
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
;
;
function isDefined(value) {
    return value !== null && value !== void 0;
}
function buildLucideIconNode(icon, params = {}) {
    const attributeNames = params.attributeNames ?? {};
    const getAttributeName = (attributeName)=>attributeNames[attributeName] ?? attributeName;
    const viewBoxWidth = icon.size ?? icon.width ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["width"];
    const viewBoxHeight = icon.size ?? icon.height ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["height"];
    const aliasClassNames = icon.aliases?.filter((alias)=>typeof alias === "string" && alias.trim() !== "").map((alias)=>`lucide-${alias}`) ?? [];
    const iconClassNames = [
        ...icon.name ? [
            `lucide-${icon.name}`
        ] : [],
        ...aliasClassNames
    ];
    const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
    const className = params.includeDefaultClasses === false ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(...classNamesFromClassName) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", ...iconClassNames, ...classNamesFromClassName);
    const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["stroke-width"]) * Number(icon.size ?? icon.width ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["width"]) / Number(params.size ?? params.width ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["width"]) : params.strokeWidth ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]["stroke-width"];
    const attributes = {
        ...Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$build$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]).reduce((attrs, [attrName, value])=>{
            attrs[getAttributeName(attrName)] = value;
            return attrs;
        }, {}),
        ..."color" in params && params.color && {
            [getAttributeName("stroke")]: params.color
        },
        ..."size" in params && isDefined(params.size) && {
            [getAttributeName("width")]: params.size,
            [getAttributeName("height")]: params.size
        },
        ..."width" in params && isDefined(params.width) && {
            [getAttributeName("width")]: params.width
        },
        ..."height" in params && isDefined(params.height) && {
            [getAttributeName("height")]: params.height
        },
        [getAttributeName("stroke-width")]: calculatedStrokeWidth,
        ...className && {
            [getAttributeName("class")]: className
        },
        [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
        ...params.hasA11yProp === false ? {
            [getAttributeName("aria-hidden")]: "true"
        } : {},
        ..."attributes" in params && params.attributes
    };
    return [
        "svg",
        attributes,
        icon.node.map((child)=>{
            const [name, attrs, children] = child;
            const nextAttrs = params.nonScalingStroke ? {
                [getAttributeName("vector-effect")]: "non-scaling-stroke",
                ...attrs
            } : attrs;
            return children ? [
                name,
                nextAttrs,
                children
            ] : [
                name,
                nextAttrs
            ];
        })
    ];
}
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
    return false;
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toCamelCase",
    ()=>toCamelCase
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toCamelCase = (string)=>{
    let out = "";
    let upperNext = false;
    for (const ch of string){
        if (ch === "-" || ch === "_" || ch <= " ") {
            upperNext = out.length > 0;
            continue;
        }
        if (out.length === 0) {
            out += ch.toLowerCase();
        } else {
            out += upperNext ? ch.toUpperCase() : ch;
        }
        upperNext = false;
    }
    return out;
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toKebabCase",
    ()=>toKebabCase
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toLucideIconData",
    ()=>toLucideIconData
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)");
;
function toLucideIconData(iconName, iconNode, aliases = []) {
    if (iconNode == null) {
        throw new Error("[lucide]: iconNode is required when icon name is used");
    }
    return {
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])(iconName),
        size: 24,
        node: iconNode,
        ...aliases.length > 0 ? {
            aliases
        } : {}
    };
}
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)");
;
const toPascalCase = (string)=>{
    const camelCase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCamelCase"])(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
;
}),
"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _types = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/segment-cache/types.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, linkInstanceRef, replace, scroll, onNavigate, transitionTypes, prefetchIntent = 'none') {
    if (typeof window !== 'undefined') {
        const { nodeName } = e.currentTarget;
        // anchors inside an svg have a lowercase nodeName
        const isAnchorNodeName = nodeName.toUpperCase() === 'A';
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
            // ignore click for browser’s default behavior
            return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
            if (replace) {
                // browser default behavior does not replace the history state
                // so we need to do it manually
                e.preventDefault();
                location.replace(href);
            }
            // ignore click for browser’s default behavior
            return;
        }
        e.preventDefault();
        if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
                preventDefault: ()=>{
                    isDefaultPrevented = true;
                }
            });
            if (isDefaultPrevented) {
                return;
            }
        }
        const { dispatchNavigateAction } = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
        _react.default.startTransition(()=>{
            dispatchNavigateAction(href, replace ? 'replace' : 'push', scroll === false ? _routerreducertypes.ScrollBehavior.NoScroll : _routerreducertypes.ScrollBehavior.Default, linkInstanceRef.current, transitionTypes, prefetchIntent);
        });
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, transitionTypes, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const prefetchIntent = prefetchProp === false ? 'none' : prefetchProp === true ? 'full' : 'auto';
    const fetchStrategy = prefetchIntent !== 'none' ? getFetchStrategyFromPrefetchIntent(prefetchIntent) : _types.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true,
            transitionTypes: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else if (key === 'transitionTypes') {
                if (props[key] != null && !Array.isArray(props[key])) {
                    throw createPropError({
                        key,
                        expected: '`string[]`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    const resolvedHref = asProp || hrefProp;
    const formattedHref = formatStringOrUrl(resolvedHref);
    if ("TURBOPACK compile-time truthy", 1) {
        const { warnOnce } = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
        if (props.locale) {
            warnOnce('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof resolvedHref === 'string') {
                href = resolvedHref;
            } else if (typeof resolvedHref === 'object' && typeof resolvedHref.pathname === 'string') {
                href = resolvedHref.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw Object.defineProperty(new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${formattedHref}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${formattedHref}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${formattedHref}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${formattedHref}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Capture the Owner Stack during render so dev-only warnings emitted later
    // at navigation time can be associated with the JSX that created
    // this <Link>.
    const ownerStack = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, formattedHref, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus, ownerStack);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        formattedHref,
        router,
        fetchStrategy,
        setOptimisticLinkStatus,
        ownerStack
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, formattedHref, linkInstanceRef, replace, scroll, onNavigate, transitionTypes, prefetchIntent);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(formattedHref)) {
        childProps.href = formattedHref;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(formattedHref);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            const { errorOnce } = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
            errorOnce('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchIntent(prefetchIntent) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchIntent === 'auto' ? _types.FetchStrategy.PPR : _types.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
}
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
}
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
}
}),
"[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>{
    // Fast path: an absolute URL must start with a letter (the scheme).
    // Check for a-z and A-Z without the cost of the regex.
    const c = url.charCodeAt(0);
    const isLetter = c >= 65 /* A */  && c <= 90 || c >= 97 /* a */  && c <= 122;
    /* z */ if (!isLetter) {
        return false;
    }
    return ABSOLUTE_URL_REGEX.test(url);
};
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E1035",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E1025",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
}
}),
"[project]/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_02x873p._.js.map