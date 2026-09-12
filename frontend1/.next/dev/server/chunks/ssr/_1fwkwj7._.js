module.exports = [
"[project]/app/university/departments/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DepartmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.mjs [app-ssr] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/universityAppData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityChallenges$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/universityChallenges.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const colorMap = {
    blue: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100",
        avatar: "bg-blue-600"
    },
    purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-100",
        avatar: "bg-purple-600"
    },
    amber: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        avatar: "bg-amber-600"
    },
    orange: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-100",
        avatar: "bg-orange-600"
    },
    teal: {
        bg: "bg-teal-50",
        text: "text-teal-700",
        border: "border-teal-100",
        avatar: "bg-teal-600"
    },
    green: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-100",
        avatar: "bg-green-600"
    }
};
function DepartmentsPage() {
    const [selectedDept, setSelectedDept] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-slate-900",
                                children: "Departments"
                            }, void 0, false, {
                                fileName: "[project]/app/university/departments/page.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "High-level overview of all university departments and their challenge workload."
                            }, void 0, false, {
                                fileName: "[project]/app/university/departments/page.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/university/departments/page.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["universityDepartments"].map((dept)=>{
                            const c = colorMap[dept.color] ?? colorMap.blue;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `rounded-2xl border ${c.border} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${c.avatar} text-white text-xs font-bold shadow-sm`,
                                                children: dept.shortName
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/departments/page.tsx",
                                                lineNumber: 41,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-bold text-slate-900 leading-snug",
                                                        children: dept.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                        lineNumber: 47,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-500 mt-0.5",
                                                        children: [
                                                            "Head: ",
                                                            dept.head
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                        lineNumber: 48,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/university/departments/page.tsx",
                                                lineNumber: 46,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/university/departments/page.tsx",
                                        lineNumber: 40,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500 mb-4 leading-relaxed",
                                        children: dept.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/departments/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-2 mb-4",
                                        children: [
                                            {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
                                                label: "Primary",
                                                value: dept.primaryChallenges
                                            },
                                            {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
                                                label: "Supporting",
                                                value: dept.supportingChallenges
                                            },
                                            {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"],
                                                label: "Available",
                                                value: dept.availableMentors
                                            },
                                            {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
                                                label: "Completed",
                                                value: dept.completedChallenges
                                            }
                                        ].map(({ icon: Icon, label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex items-center gap-2 rounded-xl ${c.bg} px-3 py-2`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        size: 13,
                                                        className: c.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                        lineNumber: 63,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-sm font-bold ${c.text}`,
                                                                children: value
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/university/departments/page.tsx",
                                                                lineNumber: 65,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-slate-500",
                                                                children: label
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/university/departments/page.tsx",
                                                                lineNumber: 66,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                        lineNumber: 64,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, label, true, {
                                                fileName: "[project]/app/university/departments/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/departments/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedDept(dept),
                                        className: `w-full rounded-xl border ${c.border} ${c.bg} py-2 text-xs font-semibold ${c.text} hover:opacity-80 transition`,
                                        children: "View Department Details"
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/departments/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, dept.id, true, {
                                fileName: "[project]/app/university/departments/page.tsx",
                                lineNumber: 35,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/university/departments/page.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/university/departments/page.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            selectedDept && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",
                onClick: ()=>setSelectedDept(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            size: 18,
                                            className: "text-indigo-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-slate-900",
                                            children: selectedDept.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedDept(null),
                                    className: "rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/departments/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/university/departments/page.tsx",
                            lineNumber: 94,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-6 space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-600 leading-relaxed",
                                        children: selectedDept.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/departments/page.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
                                    children: [
                                        {
                                            label: "Primary Challenges",
                                            value: selectedDept.primaryChallenges,
                                            color: "text-amber-600 bg-amber-50"
                                        },
                                        {
                                            label: "Supporting",
                                            value: selectedDept.supportingChallenges,
                                            color: "text-blue-600 bg-blue-50"
                                        },
                                        {
                                            label: "Available Mentors",
                                            value: selectedDept.availableMentors,
                                            color: "text-green-600 bg-green-50"
                                        },
                                        {
                                            label: "Completed",
                                            value: selectedDept.completedChallenges,
                                            color: "text-indigo-600 bg-indigo-50"
                                        }
                                    ].map(({ label, value, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `rounded-xl p-3 text-center ${color}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold",
                                                    children: value
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium mt-0.5",
                                                    children: label
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, label, true, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-2 text-sm font-bold text-slate-700",
                                            children: "Areas of Expertise"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: selectedDept.areasOfExpertise.map((area)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700",
                                                    children: area
                                                }, area, false, {
                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-3 text-sm font-bold text-slate-700",
                                            children: "Mentors"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["universityMentors"].filter((m)=>m.departmentId === selectedDept.id).map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white",
                                                            children: m.avatar
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/university/departments/page.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold text-slate-800",
                                                                    children: m.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                                    lineNumber: 157,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-slate-500",
                                                                    children: [
                                                                        m.designation,
                                                                        " · ",
                                                                        m.expertise.slice(0, 2).join(", ")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                                    lineNumber: 158,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/university/departments/page.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-right flex-shrink-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-xs font-semibold px-2 py-0.5 rounded-full ${m.availability === "Available" ? "bg-green-50 text-green-700" : m.availability === "Limited Capacity" ? "bg-amber-50 text-amber-700" : m.availability === "Fully Assigned" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`,
                                                                    children: m.availability
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                                    lineNumber: 163,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-slate-400 mt-0.5",
                                                                    children: [
                                                                        m.challengesAssigned,
                                                                        "/",
                                                                        m.maxCapacity,
                                                                        " challenges"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                                    lineNumber: 176,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/university/departments/page.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, m.id, true, {
                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-3 text-sm font-bold text-slate-700",
                                            children: "Active Challenges"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityChallenges$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["universityChallenges"].filter((c)=>c.assignedDepartmentId === selectedDept.id && c.status !== "Completed" && c.status !== "Rejected").map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-2.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0 mr-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-medium text-slate-800 truncate",
                                                                        children: c.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                                        lineNumber: 202,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-slate-500",
                                                                        children: [
                                                                            c.assignedMentorName ?? "No mentor assigned",
                                                                            " · ",
                                                                            c.status
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                                        lineNumber: 203,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/university/departments/page.tsx",
                                                                lineNumber: 201,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 text-right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-bold text-indigo-600",
                                                                    children: [
                                                                        c.progress,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                                    lineNumber: 208,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/university/departments/page.tsx",
                                                                lineNumber: 207,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, c.id, true, {
                                                        fileName: "[project]/app/university/departments/page.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 23
                                                    }, this)),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityChallenges$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["universityChallenges"].filter((c)=>c.assignedDepartmentId === selectedDept.id && c.status !== "Completed" && c.status !== "Rejected").length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-400 text-center py-4",
                                                    children: "No active challenges assigned."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/departments/page.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/university/departments/page.tsx",
                                            lineNumber: 188,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/departments/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/university/departments/page.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/university/departments/page.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/university/departments/page.tsx",
                lineNumber: 86,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/university/departments/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/data/universityChallenges.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "universityChallenges",
    ()=>universityChallenges
]);
const universityChallenges = [
    {
        id: 301,
        title: "Severe Water Shortage in Katraj Residential Area",
        description: "Residents in Katraj have been facing acute water shortage for over 6 weeks. Municipal supply is available for less than 30 minutes daily. Underground pipelines are damaged and water tankers are being sold at exorbitant prices. Over 2,000 families are affected.",
        category: "Water and Sanitation",
        location: "Katraj, Pune, Maharashtra",
        citizenName: "Rahul Patil",
        citizenAvatar: "RP",
        dateSubmitted: "Jan 10, 2025",
        status: "Accepted",
        priority: "Critical",
        aiMatchScore: 94,
        supporters: 412,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 3,
                name: "Civil Engineering"
            },
            supportingDepartments: [
                {
                    id: 2,
                    name: "AI & Machine Learning"
                },
                {
                    id: 6,
                    name: "Information Technology"
                }
            ],
            confidence: 94,
            reason: "The challenge primarily requires water infrastructure and pipeline expertise. AI & ML can assist with predictive monitoring of water supply patterns. IT can support a citizen-facing reporting platform."
        },
        assignedDepartmentId: 3,
        assignedDepartmentName: "Civil Engineering",
        assignedMentorId: 4,
        assignedMentorName: "Dr. Kavita Desai",
        progress: 35,
        currentStep: 7,
        industryCollabStatus: "Not Required",
        image: "💧"
    },
    {
        id: 302,
        title: "Smart Waste Management System for Urban Areas",
        description: "Traditional garbage collection in Dhankawadi is inefficient. Bins overflow before collection, causing hygiene issues. A smart IoT-based waste monitoring and collection optimization system is needed to improve efficiency and reduce costs.",
        category: "Environment",
        location: "Dhankawadi, Pune, Maharashtra",
        citizenName: "Amit Jadhav",
        citizenAvatar: "AJ",
        dateSubmitted: "Jan 8, 2025",
        status: "Active",
        priority: "High",
        aiMatchScore: 91,
        supporters: 287,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 5,
                name: "Electronics & Telecom"
            },
            supportingDepartments: [
                {
                    id: 1,
                    name: "Computer Engineering"
                },
                {
                    id: 2,
                    name: "AI & Machine Learning"
                }
            ],
            confidence: 91,
            reason: "IoT sensor networks for bin monitoring require Electronics & Telecom expertise. Computer Engineering handles the backend platform. AI & ML optimizes collection routes using real-time data."
        },
        assignedDepartmentId: 5,
        assignedDepartmentName: "Electronics & Telecom",
        assignedMentorId: 5,
        assignedMentorName: "Prof. Arun Joshi",
        progress: 55,
        currentStep: 9,
        industryCollabStatus: "Not Required",
        image: "♻️"
    },
    {
        id: 303,
        title: "Air Quality Monitoring Network for Industrial Zones",
        description: "Industrial areas in Pimpri-Chinchwad lack real-time air quality monitoring. Residents near factories report respiratory issues. A distributed sensor network with data analytics platform is needed to monitor and alert authorities about pollution levels.",
        category: "Environment",
        location: "Pimpri-Chinchwad, Maharashtra",
        citizenName: "Vijay Bhosale",
        citizenAvatar: "VB",
        dateSubmitted: "Jan 5, 2025",
        status: "Active",
        priority: "High",
        aiMatchScore: 88,
        supporters: 356,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 2,
                name: "AI & Machine Learning"
            },
            supportingDepartments: [
                {
                    id: 5,
                    name: "Electronics & Telecom"
                },
                {
                    id: 6,
                    name: "Information Technology"
                }
            ],
            confidence: 88,
            reason: "AI & ML is the primary domain for pollution prediction models and anomaly detection. Electronics & Telecom handles sensor hardware deployment. IT builds the real-time dashboard and alert system."
        },
        assignedDepartmentId: 2,
        assignedDepartmentName: "AI & Machine Learning",
        assignedMentorId: 2,
        assignedMentorName: "Dr. Priya Mehta",
        progress: 65,
        currentStep: 10,
        industryCollabStatus: "Collaboration Active",
        image: "🏭"
    },
    {
        id: 304,
        title: "Pothole Detection and Road Damage Mapping System",
        description: "Pune roads develop thousands of potholes every monsoon season. Manual inspection is slow and inefficient. An AI-powered mobile application using computer vision to detect, map, and prioritize road damage for repair would save lives and reduce vehicle damage.",
        category: "Infrastructure",
        location: "Pune City, Maharashtra",
        citizenName: "Priya Sharma",
        citizenAvatar: "PS",
        dateSubmitted: "Jan 3, 2025",
        status: "Active",
        priority: "High",
        aiMatchScore: 96,
        supporters: 523,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 2,
                name: "AI & Machine Learning"
            },
            supportingDepartments: [
                {
                    id: 3,
                    name: "Civil Engineering"
                },
                {
                    id: 1,
                    name: "Computer Engineering"
                }
            ],
            confidence: 96,
            reason: "Computer vision and deep learning for pothole detection is the core AI & ML problem. Civil Engineering validates road damage severity standards. Computer Engineering builds the mobile app and mapping backend."
        },
        assignedDepartmentId: 2,
        assignedDepartmentName: "AI & Machine Learning",
        assignedMentorId: 3,
        assignedMentorName: "Prof. Suresh Nair",
        progress: 45,
        currentStep: 9,
        industryCollabStatus: "Not Required",
        image: "🛣️"
    },
    {
        id: 305,
        title: "Flood Early Warning System for Low-Lying Areas",
        description: "Low-lying areas in Pune face severe flooding during monsoon. Residents have no advance warning system. A sensor-based flood prediction and early warning system using IoT and ML models would help evacuate residents and minimize damage.",
        category: "Infrastructure",
        location: "Hadapsar, Pune, Maharashtra",
        citizenName: "Sneha Kulkarni",
        citizenAvatar: "SK",
        dateSubmitted: "Dec 28, 2024",
        status: "Active",
        priority: "Critical",
        aiMatchScore: 89,
        supporters: 445,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 3,
                name: "Civil Engineering"
            },
            supportingDepartments: [
                {
                    id: 5,
                    name: "Electronics & Telecom"
                },
                {
                    id: 2,
                    name: "AI & Machine Learning"
                }
            ],
            confidence: 89,
            reason: "Flood hydrology and drainage infrastructure is a Civil Engineering domain. IoT water-level sensors require Electronics & Telecom. AI & ML builds the predictive flood models."
        },
        assignedDepartmentId: 3,
        assignedDepartmentName: "Civil Engineering",
        assignedMentorId: 4,
        assignedMentorName: "Dr. Kavita Desai",
        progress: 78,
        currentStep: 12,
        industryCollabStatus: "Awaiting Industry Partner",
        image: "🌊"
    },
    {
        id: 306,
        title: "Traffic Signal Optimization Using AI",
        description: "Traffic congestion at major intersections in Pune causes 45-minute delays during peak hours. AI-based adaptive traffic signal control that adjusts timing based on real-time vehicle density would significantly reduce congestion and fuel consumption.",
        category: "Transportation",
        location: "FC Road & JM Road, Pune",
        citizenName: "Rohan Deshmukh",
        citizenAvatar: "RD",
        dateSubmitted: "Dec 25, 2024",
        status: "Completed",
        priority: "High",
        aiMatchScore: 97,
        supporters: 634,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 2,
                name: "AI & Machine Learning"
            },
            supportingDepartments: [
                {
                    id: 5,
                    name: "Electronics & Telecom"
                },
                {
                    id: 1,
                    name: "Computer Engineering"
                }
            ],
            confidence: 97,
            reason: "Adaptive signal control using reinforcement learning is a core AI & ML problem. Electronics & Telecom handles traffic sensor hardware. Computer Engineering builds the central control system."
        },
        assignedDepartmentId: 2,
        assignedDepartmentName: "AI & Machine Learning",
        assignedMentorId: 1,
        assignedMentorName: "Dr. Rajesh Kulkarni",
        progress: 100,
        currentStep: 14,
        industryCollabStatus: "Completed",
        image: "🚦"
    },
    {
        id: 307,
        title: "Accessible Public Infrastructure for Disabled Citizens",
        description: "Government buildings, bus stops, and public spaces in Shivajinagar lack proper accessibility infrastructure. Ramps, tactile paths, and audio signals are missing. A comprehensive audit and redesign plan is needed to comply with disability rights legislation.",
        category: "Infrastructure",
        location: "Shivajinagar, Pune",
        citizenName: "Neha Joshi",
        citizenAvatar: "NJ",
        dateSubmitted: "Dec 20, 2024",
        status: "Completed",
        priority: "Medium",
        aiMatchScore: 82,
        supporters: 198,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 3,
                name: "Civil Engineering"
            },
            supportingDepartments: [
                {
                    id: 5,
                    name: "Electronics & Telecom"
                }
            ],
            confidence: 82,
            reason: "Structural redesign for accessibility is a Civil Engineering domain. Electronics & Telecom handles audio signal systems and assistive technology integration."
        },
        assignedDepartmentId: 3,
        assignedDepartmentName: "Civil Engineering",
        assignedMentorId: 9,
        assignedMentorName: "Prof. Vikram Joshi",
        progress: 100,
        currentStep: 14,
        industryCollabStatus: "Not Required",
        image: "♿"
    },
    {
        id: 308,
        title: "Healthcare Access in Rural Villages Near Pune",
        description: "Villages within 30 km of Pune lack basic healthcare facilities. Residents travel 2-3 hours for basic medical care. A telemedicine platform with AI-assisted diagnosis and mobile health units would dramatically improve healthcare access.",
        category: "Healthcare",
        location: "Rural Pune District, Maharashtra",
        citizenName: "Meera Joshi",
        citizenAvatar: "MJ",
        dateSubmitted: "Jan 12, 2025",
        status: "Awaiting Decision",
        priority: "High",
        aiMatchScore: 85,
        supporters: 267,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 1,
                name: "Computer Engineering"
            },
            supportingDepartments: [
                {
                    id: 2,
                    name: "AI & Machine Learning"
                },
                {
                    id: 6,
                    name: "Information Technology"
                }
            ],
            confidence: 85,
            reason: "Telemedicine platform development is a Computer Engineering domain. AI & ML enables symptom analysis and diagnosis assistance. IT handles data management and patient records."
        },
        progress: 10,
        currentStep: 4,
        industryCollabStatus: "Not Requested",
        image: "🏥"
    },
    {
        id: 309,
        title: "Solar Street Lighting for Energy-Deficient Areas",
        description: "Several wards in Pune face frequent power cuts lasting 6-8 hours. Street lighting fails during outages creating safety hazards. Solar-powered smart street lights with battery backup and remote monitoring would provide reliable lighting independent of grid power.",
        category: "Public Safety",
        location: "Kondhwa, Pune, Maharashtra",
        citizenName: "Suresh Kadam",
        citizenAvatar: "SK",
        dateSubmitted: "Jan 14, 2025",
        status: "Awaiting Decision",
        priority: "Medium",
        aiMatchScore: 79,
        supporters: 143,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 4,
                name: "Mechanical Engineering"
            },
            supportingDepartments: [
                {
                    id: 5,
                    name: "Electronics & Telecom"
                }
            ],
            confidence: 79,
            reason: "Solar energy systems and mechanical installation is a Mechanical Engineering domain. Electronics & Telecom handles smart monitoring, remote control, and battery management systems."
        },
        progress: 10,
        currentStep: 4,
        industryCollabStatus: "Not Requested",
        image: "☀️"
    },
    {
        id: 310,
        title: "Digital Literacy Program for Senior Citizens",
        description: "Senior citizens in Pune are unable to access government digital services, banking apps, and healthcare portals. A structured digital literacy program with simplified interfaces and community training centers would bridge the digital divide for the elderly population.",
        category: "Education",
        location: "Pune City, Maharashtra",
        citizenName: "Lata Shinde",
        citizenAvatar: "LS",
        dateSubmitted: "Jan 15, 2025",
        status: "Mentor Assigned",
        priority: "Medium",
        aiMatchScore: 76,
        supporters: 189,
        aiDepartmentAssignment: {
            primaryDepartment: {
                id: 6,
                name: "Information Technology"
            },
            supportingDepartments: [
                {
                    id: 1,
                    name: "Computer Engineering"
                }
            ],
            confidence: 76,
            reason: "Accessible UI/UX design and digital platform development is an IT domain. Computer Engineering supports backend infrastructure and accessibility compliance."
        },
        assignedDepartmentId: 6,
        assignedDepartmentName: "Information Technology",
        assignedMentorId: 10,
        assignedMentorName: "Dr. Ritu Verma",
        progress: 25,
        currentStep: 7,
        industryCollabStatus: "Not Requested",
        image: "💻"
    }
];
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>BookOpen
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "book-open",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M12 5v16",
                key: "1f6ucr"
            }
        ],
        [
            "path",
            {
                d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
                key: "1fyvmf"
            }
        ]
    ]
};
__iconData.node;
const BookOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-ssr] (ecmascript) <export default as BookOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>CircleCheck
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "circle-check",
    size: 24,
    node: [
        [
            "circle",
            {
                cx: "12",
                cy: "12",
                r: "10",
                key: "1mglay"
            }
        ],
        [
            "path",
            {
                d: "m16 9-5.5 5.5L8 12",
                key: "xofnsj"
            }
        ]
    ],
    aliases: [
        "check-circle-2"
    ]
};
__iconData.node;
const CircleCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckCircle2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/user-check.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>UserCheck
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "user-check",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m16 11 2 2 4-4",
                key: "9rsbq5"
            }
        ],
        [
            "path",
            {
                d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
                key: "1yyitq"
            }
        ],
        [
            "circle",
            {
                cx: "9",
                cy: "7",
                r: "4",
                key: "nufk8"
            }
        ]
    ]
};
__iconData.node;
const UserCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/user-check.mjs [app-ssr] (ecmascript) <export default as UserCheck>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserCheck",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.mjs [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>X
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "x",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M18 6 6 18",
                key: "1bl5f8"
            }
        ],
        [
            "path",
            {
                d: "m6 6 12 12",
                key: "d8bk6v"
            }
        ]
    ]
};
__iconData.node;
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_1fwkwj7._.js.map