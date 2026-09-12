module.exports = [
"[project]/components/BottomNavigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.mjs [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.mjs [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/problems.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const navigation = [
    {
        name: "Home",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        name: "Explore",
        href: "/explore",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"]
    },
    {
        name: "Post",
        href: "/post-problem",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"]
    },
    {
        name: "Mine",
        href: "/my-problems",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        name: "Alerts",
        href: "/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    }
];
function BottomNavigation() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch(`${apiUrl}/notifications?citizen_name=${encodeURIComponent(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].name)}`, {
            cache: "no-store"
        }).then((response)=>response.ok ? response.json() : []).then((records)=>setUnreadCount(Array.isArray(records) ? records.filter((record)=>!record.is_read).length : 0)).catch(()=>undefined);
    }, [
        apiUrl,
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-100 bg-white px-2 py-2 shadow-lg lg:hidden",
        children: navigation.map((item)=>{
            const Icon = item.icon;
            const isActive = pathname === item.href || item.href !== "/" && pathname.startsWith(item.href);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: item.href,
                className: `relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 21,
                                strokeWidth: isActive ? 2.5 : 2
                            }, void 0, false, {
                                fileName: "[project]/components/BottomNavigation.tsx",
                                lineNumber: 44,
                                columnNumber: 15
                            }, this),
                            item.name === "Alerts" && unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white",
                                style: {
                                    fontSize: "9px",
                                    fontWeight: 700
                                },
                                children: unreadCount
                            }, void 0, false, {
                                fileName: "[project]/components/BottomNavigation.tsx",
                                lineNumber: 46,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/BottomNavigation.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: item.name
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNavigation.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, this),
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNavigation.tsx",
                        lineNumber: 53,
                        columnNumber: 15
                    }, this)
                ]
            }, item.name, true, {
                fileName: "[project]/components/BottomNavigation.tsx",
                lineNumber: 36,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/BottomNavigation.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.mjs [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.mjs [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/problems.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const navigation = [
    {
        name: "Home",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        name: "Explore Problems",
        href: "/explore",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"]
    },
    {
        name: "Post a Problem",
        href: "/post-problem",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"]
    },
    {
        name: "My Problems",
        href: "/my-problems",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        name: "Notifications",
        href: "/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        name: "Profile",
        href: "/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    {
        name: "Settings",
        href: "/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function Sidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch(`${apiUrl}/notifications?citizen_name=${encodeURIComponent(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].name)}`, {
            cache: "no-store"
        }).then((response)=>response.ok ? response.json() : []).then((records)=>setUnreadCount(Array.isArray(records) ? records.filter((record)=>!record.is_read).length : 0)).catch(()=>undefined);
    }, [
        apiUrl,
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 border-b border-slate-100 px-6 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-black text-white",
                            children: "ST"
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-base font-bold text-slate-900",
                                children: "SolveTogether"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-400",
                                children: "Citizen Portal"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4",
                children: navigation.map((item)=>{
                    const Icon = item.icon;
                    const isActive = pathname === item.href || item.href !== "/" && pathname.startsWith(item.href);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        className: `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 18,
                                className: isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 62,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1",
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this),
                            item.name === "Notifications" && unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-white text-blue-600" : "bg-red-500 text-white"}`,
                                children: unreadCount
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 65,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.name, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
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
                                className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].avatar
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-sm font-semibold text-slate-800",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].name
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-blue-500 font-medium",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].role
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            "Logout"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/context/ProblemsContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProblemsProvider",
    ()=>ProblemsProvider,
    "useProblems",
    ()=>useProblems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/problems.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const ProblemsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ProblemsProvider({ children }) {
    const [problems, setProblems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialProblems"]);
    const [myProblems, setMyProblems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["myProblems"]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadProblems() {
            try {
                const [publishedResponse, citizenResponse] = await Promise.all([
                    fetch(`${apiUrl}/problems?status=verified`, {
                        cache: "no-store"
                    }),
                    fetch(`${apiUrl}/problems?limit=500`, {
                        cache: "no-store"
                    })
                ]);
                if (!publishedResponse.ok || !citizenResponse.ok) throw new Error("Problem API unavailable");
                const publishedRecords = await publishedResponse.json();
                const citizenRecords = await citizenResponse.json();
                if (!cancelled && Array.isArray(publishedRecords)) {
                    setProblems(publishedRecords.map(toFrontendProblem));
                }
                if (!cancelled && Array.isArray(citizenRecords)) {
                    setMyProblems(citizenRecords.filter((record)=>String(record.citizen_name ?? "") === __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].name).map(toFrontendProblem));
                }
            } catch  {
            // Keep the seeded demo data available when the optional API is offline.
            } finally{
                if (!cancelled) setIsLoading(false);
            }
        }
        loadProblems();
        return ()=>{
            cancelled = true;
        };
    }, [
        apiUrl
    ]);
    const addProblem = async (problem)=>{
        // Submissions remain private until a government officer verifies them.
        try {
            const response = await fetch(`${apiUrl}/problems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    problem_text: problem.description,
                    title: problem.title,
                    description: problem.description,
                    category: problem.category,
                    location: problem.location,
                    citizen_name: problem.citizenName,
                    citizen_avatar: problem.citizenAvatar,
                    date: problem.date,
                    status: "submitted",
                    supporters: problem.supporters,
                    progress: problem.progress,
                    current_step: problem.currentStep
                })
            });
            if (!response.ok) return null;
            const saved = await response.json();
            setMyProblems((previous)=>[
                    toFrontendProblem(saved),
                    ...previous
                ]);
            return saved.id ?? null;
        } catch  {
            return null;
        }
    };
    const toggleSupport = (id)=>{
        setProblems((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    supporters: p.isSupported ? p.supporters - 1 : p.supporters + 1,
                    isSupported: !p.isSupported
                } : p));
    };
    const toggleSave = (id)=>{
        setProblems((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    isSaved: !p.isSaved
                } : p));
    };
    const deleteProblem = async (id)=>{
        try {
            const response = await fetch(`${apiUrl}/problems/${id}?citizen_name=${encodeURIComponent(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].name)}`, {
                method: "DELETE"
            });
            if (!response.ok) return false;
            setMyProblems((previous)=>previous.filter((problem)=>problem.id !== id));
            setProblems((previous)=>previous.filter((problem)=>problem.id !== id));
            return true;
        } catch  {
            return false;
        }
    };
    const resubmitProblem = async (id, files, note = "")=>{
        try {
            if (files.length > 0) {
                const formData = new FormData();
                files.forEach((file)=>formData.append("files", file));
                const evidenceResponse = await fetch(`${apiUrl}/problems/${id}/evidence`, {
                    method: "POST",
                    body: formData
                });
                if (!evidenceResponse.ok) return false;
            }
            const response = await fetch(`${apiUrl}/problems/${id}/resubmit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    citizen_name: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$problems$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentUser"].name,
                    note
                })
            });
            if (!response.ok) return false;
            const saved = toFrontendProblem(await response.json());
            setMyProblems((previous)=>previous.map((problem)=>problem.id === id ? saved : problem));
            return true;
        } catch  {
            return false;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProblemsContext.Provider, {
        value: {
            problems,
            myProblems,
            addProblem,
            deleteProblem,
            resubmitProblem,
            toggleSupport,
            toggleSave,
            isLoading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/ProblemsContext.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
function toFrontendProblem(record) {
    return {
        id: String(record.id),
        title: String(record.title ?? record.problem_text ?? "Community problem"),
        description: String(record.description ?? record.problem_text ?? ""),
        category: record.category ?? "Other",
        location: String(record.location ?? record.district ?? "Location pending"),
        citizenName: String(record.citizen_name ?? "Citizen"),
        citizenAvatar: String(record.citizen_avatar ?? "C"),
        date: String(record.date ?? record.created_at ?? "Recently"),
        status: toFrontendStatus(String(record.status ?? "submitted")),
        supporters: Number(record.supporters ?? 0),
        comments: [],
        progress: Number(record.progress ?? 0),
        currentStep: Number(record.current_step ?? 1),
        evidenceAttachments: Array.isArray(record.evidence_attachments) ? record.evidence_attachments : [],
        verificationHistory: Array.isArray(record.verification_history) ? record.verification_history : [],
        correctionCount: Array.isArray(record.verification_history) ? record.verification_history.filter((entry)=>entry.decision === "proof").length : 0,
        correctionReasons: Array.isArray(record.verification_history) ? record.verification_history.filter((entry)=>entry.decision === "proof").map((entry)=>String(entry.note ?? "Additional proof requested")) : []
    };
}
function toFrontendStatus(status) {
    const statuses = {
        submitted: "Submitted",
        under_review: "Under Review",
        assigned: "Assigned to University",
        in_progress: "In Progress",
        completed: "Completed",
        verified: "Verified",
        returned_for_correction: "Needs Proof",
        rejected: "Rejected"
    };
    return statuses[status] ?? "Submitted";
}
function useProblems() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ProblemsContext);
    if (!context) throw new Error("useProblems must be used inside ProblemsProvider");
    return context;
}
}),
"[project]/data/problems.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currentUser",
    ()=>currentUser,
    "initialProblems",
    ()=>initialProblems,
    "myProblems",
    ()=>myProblems,
    "notifications",
    ()=>notifications
]);
const currentUser = {
    name: "Sarthak Nehe",
    email: "sarthak.nehe@gmail.com",
    city: "Pune, Maharashtra",
    avatar: "SN",
    role: "Citizen",
    totalSubmitted: 8,
    inProgress: 4,
    completed: 3,
    joinedDate: "January 2024"
};
const initialProblems = [
    {
        id: 1,
        title: "Severe Water Shortage in Residential Area",
        description: "Residents in our locality have been facing a serious water shortage for the last several weeks. Water supply is irregular — sometimes only 30 minutes per day — and families are struggling with daily activities including cooking and sanitation. The municipal corporation has not responded to multiple complaints.",
        category: "Water and Sanitation",
        location: "Kothrud, Pune, Maharashtra",
        citizenName: "Rahul Patil",
        citizenAvatar: "RP",
        date: "2 hours ago",
        status: "In Progress",
        supporters: 248,
        comments: [
            {
                id: 1,
                author: "Meera Joshi",
                avatar: "MJ",
                text: "This is affecting our entire colony. We need urgent action!",
                timeAgo: "1 hour ago"
            },
            {
                id: 2,
                author: "Suresh Kadam",
                avatar: "SK",
                text: "I have been raising this issue for 3 months. Finally getting attention.",
                timeAgo: "45 min ago"
            },
            {
                id: 3,
                author: "Anita Desai",
                avatar: "AD",
                text: "Children and elderly are suffering the most. Please prioritize.",
                timeAgo: "20 min ago"
            }
        ],
        progress: 65,
        currentStep: 5,
        assignedUniversity: "College of Engineering Pune",
        assignedDepartment: "Civil & Environmental Engineering",
        image: "💧"
    },
    {
        id: 2,
        title: "Dangerous Potholes on Main Connecting Road",
        description: "The main road connecting Katraj to Swargate has developed large, dangerous potholes over the past monsoon season. Multiple two-wheeler accidents have been reported. The road surface has completely deteriorated and vehicles are being damaged daily. Emergency vehicles are also facing difficulty navigating this stretch.",
        category: "Infrastructure",
        location: "Katraj–Swargate Road, Pune",
        citizenName: "Priya Sharma",
        citizenAvatar: "PS",
        date: "5 hours ago",
        status: "Under Review",
        supporters: 189,
        comments: [
            {
                id: 4,
                author: "Vikram Rao",
                avatar: "VR",
                text: "My bike was damaged last week because of these potholes.",
                timeAgo: "3 hours ago"
            },
            {
                id: 5,
                author: "Deepa Nair",
                avatar: "DN",
                text: "The municipality needs to fix this before the next monsoon.",
                timeAgo: "2 hours ago"
            }
        ],
        progress: 25,
        currentStep: 3,
        image: "🛣️"
    },
    {
        id: 3,
        title: "Garbage Not Collected for 10+ Days",
        description: "Garbage has not been collected in our locality for over 10 days. Waste is accumulating near residential buildings, creating severe hygiene problems and attracting stray animals. The stench is unbearable and residents are worried about disease outbreaks. Multiple complaints to the municipal helpline have gone unanswered.",
        category: "Environment",
        location: "Dhankawadi, Pune",
        citizenName: "Amit Jadhav",
        citizenAvatar: "AJ",
        date: "1 day ago",
        status: "Assigned to University",
        supporters: 312,
        comments: [
            {
                id: 6,
                author: "Kavita Patil",
                avatar: "KP",
                text: "The smell is unbearable. Children cannot play outside.",
                timeAgo: "20 hours ago"
            },
            {
                id: 7,
                author: "Rajan More",
                avatar: "RM",
                text: "Stray dogs are spreading garbage everywhere.",
                timeAgo: "15 hours ago"
            },
            {
                id: 8,
                author: "Sunita Bhosale",
                avatar: "SB",
                text: "We need a permanent solution, not just one-time collection.",
                timeAgo: "8 hours ago"
            }
        ],
        progress: 40,
        currentStep: 4,
        assignedUniversity: "Bharati Vidyapeeth University",
        assignedDepartment: "Environmental Science",
        image: "♻️"
    },
    {
        id: 4,
        title: "Broken Streetlights Creating Safety Hazard",
        description: "Over 15 streetlights on the main road and connecting lanes have stopped working. The roads become completely dark after 8 PM, creating serious safety concerns especially for women and elderly residents. Two incidents of chain snatching have already been reported in the dark stretches. Residents are afraid to step out at night.",
        category: "Public Safety",
        location: "Satara Road, Pune",
        citizenName: "Sneha Kulkarni",
        citizenAvatar: "SK",
        date: "1 day ago",
        status: "Submitted",
        supporters: 96,
        comments: [
            {
                id: 9,
                author: "Pooja Wagh",
                avatar: "PW",
                text: "I was almost robbed last week because of the darkness.",
                timeAgo: "22 hours ago"
            }
        ],
        progress: 10,
        currentStep: 1,
        image: "💡"
    },
    {
        id: 5,
        title: "Severe Traffic Congestion Near School Zone",
        description: "Daily traffic congestion near the school and college cluster causes 45-minute to 1-hour delays every morning and evening. The lack of proper traffic management, illegal parking, and absence of traffic police during peak hours has made this one of the worst bottlenecks in the city. School buses and emergency vehicles are severely affected.",
        category: "Transportation",
        location: "FC Road, Pune, Maharashtra",
        citizenName: "Rohan Deshmukh",
        citizenAvatar: "RD",
        date: "2 days ago",
        status: "Collaboration with Industry",
        supporters: 421,
        comments: [
            {
                id: 10,
                author: "Anil Kulkarni",
                avatar: "AK",
                text: "My child is late to school every single day because of this.",
                timeAgo: "1 day ago"
            },
            {
                id: 11,
                author: "Smita Joshi",
                avatar: "SJ",
                text: "An ambulance was stuck here for 20 minutes last month!",
                timeAgo: "18 hours ago"
            },
            {
                id: 12,
                author: "Prakash Deshpande",
                avatar: "PD",
                text: "Great to see industry collaboration on this. Hope it gets resolved.",
                timeAgo: "5 hours ago"
            }
        ],
        progress: 75,
        currentStep: 7,
        assignedUniversity: "MIT World Peace University",
        assignedDepartment: "Transportation Engineering",
        image: "🚦"
    },
    {
        id: 6,
        title: "Public Building Inaccessible for Disabled Citizens",
        description: "The main entrance of the district public office does not have proper ramps, tactile paths, or accessibility infrastructure for wheelchair users and people with disabilities. The building was renovated recently but accessibility was completely ignored. This is a violation of the Rights of Persons with Disabilities Act 2016.",
        category: "Infrastructure",
        location: "Shivajinagar, Pune",
        citizenName: "Neha Joshi",
        citizenAvatar: "NJ",
        date: "3 days ago",
        status: "Solution Implemented",
        supporters: 278,
        comments: [
            {
                id: 13,
                author: "Ramesh Pawar",
                avatar: "RP",
                text: "This is a legal requirement. Glad it is finally being addressed.",
                timeAgo: "2 days ago"
            },
            {
                id: 14,
                author: "Lata Shinde",
                avatar: "LS",
                text: "My father uses a wheelchair and has been unable to access this office for years.",
                timeAgo: "1 day ago"
            }
        ],
        progress: 90,
        currentStep: 8,
        assignedUniversity: "Pune Institute of Computer Technology",
        assignedDepartment: "Architecture & Urban Design",
        image: "♿"
    },
    {
        id: 7,
        title: "Industrial Pollution Contaminating Local River",
        description: "Effluents from nearby industrial units are being discharged directly into the Mula river without treatment. The water has turned dark and emits a foul smell. Fish have died in large numbers and residents who depend on the river for irrigation are severely affected. This is causing long-term ecological damage.",
        category: "Environment",
        location: "Mula River, Pimpri-Chinchwad",
        citizenName: "Vijay Bhosale",
        citizenAvatar: "VB",
        date: "4 days ago",
        status: "Completed",
        supporters: 534,
        comments: [
            {
                id: 15,
                author: "Nandini Rao",
                avatar: "NR",
                text: "Finally resolved! The river is slowly recovering.",
                timeAgo: "1 day ago"
            }
        ],
        progress: 100,
        currentStep: 9,
        assignedUniversity: "Savitribai Phule Pune University",
        assignedDepartment: "Environmental Science & Technology",
        image: "🏭"
    }
];
const myProblems = [
    {
        id: 101,
        title: "Water Leakage in Public Area Near Society Gate",
        description: "A major underground water pipeline has been leaking near the society gate for over 3 weeks. Thousands of litres of water are being wasted daily. The road has become waterlogged and slippery, causing accidents.",
        category: "Water and Sanitation",
        location: "Baner, Pune, Maharashtra",
        citizenName: "Sarthak Nehe",
        citizenAvatar: "SN",
        date: "3 days ago",
        status: "In Progress",
        supporters: 67,
        comments: [],
        progress: 65,
        currentStep: 5,
        assignedUniversity: "College of Engineering Pune",
        assignedDepartment: "Civil Engineering",
        image: "💧"
    },
    {
        id: 102,
        title: "Broken Footpath Tiles Causing Injuries",
        description: "Footpath tiles near the main market are broken and uneven. Multiple elderly citizens have tripped and injured themselves. The municipality has been notified but no action has been taken.",
        category: "Infrastructure",
        location: "Aundh, Pune, Maharashtra",
        citizenName: "Sarthak Nehe",
        citizenAvatar: "SN",
        date: "2 weeks ago",
        status: "Completed",
        supporters: 43,
        comments: [],
        progress: 100,
        currentStep: 9,
        assignedUniversity: "NIT Pune",
        assignedDepartment: "Civil Engineering",
        image: "🚶"
    },
    {
        id: 103,
        title: "No Dustbins in Public Park",
        description: "The popular public park in our area has no dustbins, leading to widespread littering. The park is used by hundreds of residents daily but there is no waste management infrastructure.",
        category: "Environment",
        location: "Wakad, Pune, Maharashtra",
        citizenName: "Sarthak Nehe",
        citizenAvatar: "SN",
        date: "5 days ago",
        status: "Submitted",
        supporters: 28,
        comments: [],
        progress: 10,
        currentStep: 1,
        image: "🌳"
    },
    {
        id: 104,
        title: "Poor Lighting in Underpass Creates Safety Risk",
        description: "The pedestrian underpass near the railway station is poorly lit and has become a hotspot for anti-social activities. Residents, especially women, avoid using it after dark.",
        category: "Public Safety",
        location: "Shivajinagar, Pune, Maharashtra",
        citizenName: "Sarthak Nehe",
        citizenAvatar: "SN",
        date: "1 week ago",
        status: "Assigned to University",
        supporters: 89,
        comments: [],
        progress: 40,
        currentStep: 4,
        assignedUniversity: "Symbiosis Institute of Technology",
        assignedDepartment: "Electrical Engineering",
        image: "🚇"
    }
];
const notifications = [
    {
        id: 1,
        type: "success",
        title: "Problem Submitted",
        message: "Your problem 'Water Leakage in Public Area Near Society Gate' has been successfully submitted and is now visible to the community.",
        timeAgo: "3 days ago",
        isRead: true,
        problemTitle: "Water Leakage in Public Area Near Society Gate"
    },
    {
        id: 2,
        type: "info",
        title: "Under Review",
        message: "Your problem is currently under review by our admin team. You will be notified once it is verified.",
        timeAgo: "2 days ago",
        isRead: true,
        problemTitle: "Water Leakage in Public Area Near Society Gate"
    },
    {
        id: 3,
        type: "update",
        title: "University Assigned",
        message: "Your problem has been assigned to College of Engineering Pune for analysis and solution development.",
        timeAgo: "1 day ago",
        isRead: false,
        problemTitle: "Water Leakage in Public Area Near Society Gate"
    },
    {
        id: 4,
        type: "success",
        title: "Work Started",
        message: "The Civil Engineering Department at College of Engineering Pune has started working on your problem.",
        timeAgo: "18 hours ago",
        isRead: false,
        problemTitle: "Water Leakage in Public Area Near Society Gate"
    },
    {
        id: 5,
        type: "success",
        title: "Problem Completed",
        message: "Great news! Your problem 'Broken Footpath Tiles Causing Injuries' has been successfully resolved. Thank you for reporting it!",
        timeAgo: "5 days ago",
        isRead: false,
        problemTitle: "Broken Footpath Tiles Causing Injuries"
    },
    {
        id: 6,
        type: "info",
        title: "New Supporter",
        message: "28 citizens have supported your problem 'No Dustbins in Public Park'. More community support increases priority.",
        timeAgo: "4 days ago",
        isRead: false,
        problemTitle: "No Dustbins in Public Park"
    },
    {
        id: 7,
        type: "update",
        title: "Status Updated",
        message: "Your problem 'Poor Lighting in Underpass' has been assigned to Symbiosis Institute of Technology.",
        timeAgo: "6 days ago",
        isRead: true,
        problemTitle: "Poor Lighting in Underpass Creates Safety Risk"
    }
];
}),
];

//# sourceMappingURL=_1v3fduz._.js.map