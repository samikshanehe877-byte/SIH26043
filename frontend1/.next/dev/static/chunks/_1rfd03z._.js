(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/university/mentors/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MentorsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/universityAppData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityChallenges$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/universityChallenges.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const availabilityStyle = {
    Available: "bg-green-50 text-green-700 border border-green-200",
    "Limited Capacity": "bg-amber-50 text-amber-700 border border-amber-200",
    "Fully Assigned": "bg-red-50 text-red-700 border border-red-200",
    Unavailable: "bg-slate-100 text-slate-500"
};
function MentorsPage() {
    _s();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterDept, setFilterDept] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterAvail, setFilterAvail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MentorsPage.useMemo[filtered]": ()=>{
            let r = [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityMentors"]
            ];
            if (search) {
                const q = search.toLowerCase();
                r = r.filter({
                    "MentorsPage.useMemo[filtered]": (m)=>m.name.toLowerCase().includes(q) || m.expertise.some({
                            "MentorsPage.useMemo[filtered]": (e)=>e.toLowerCase().includes(q)
                        }["MentorsPage.useMemo[filtered]"])
                }["MentorsPage.useMemo[filtered]"]);
            }
            if (filterDept) r = r.filter({
                "MentorsPage.useMemo[filtered]": (m)=>m.departmentName === filterDept
            }["MentorsPage.useMemo[filtered]"]);
            if (filterAvail) r = r.filter({
                "MentorsPage.useMemo[filtered]": (m)=>m.availability === filterAvail
            }["MentorsPage.useMemo[filtered]"]);
            return r;
        }
    }["MentorsPage.useMemo[filtered]"], [
        search,
        filterDept,
        filterAvail
    ]);
    // Availability summary
    const availSummary = {
        Available: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityMentors"].filter((m)=>m.availability === "Available").length,
        "Limited Capacity": __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityMentors"].filter((m)=>m.availability === "Limited Capacity").length,
        "Fully Assigned": __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityMentors"].filter((m)=>m.availability === "Fully Assigned").length,
        Unavailable: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityMentors"].filter((m)=>m.availability === "Unavailable").length
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-slate-900",
                                children: "Mentors"
                            }, void 0, false, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "Faculty mentors available for challenge assignments. Assign lead mentors to accepted challenges."
                            }, void 0, false, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/university/mentors/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
                        children: Object.entries(availSummary).map(([status, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `rounded-2xl p-4 text-center cursor-pointer transition hover:opacity-80 ${availabilityStyle[status]}`,
                                onClick: ()=>setFilterAvail(filterAvail === status ? "" : status),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-2xl font-bold",
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium mt-0.5",
                                        children: status
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, status, true, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/university/mentors/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 15,
                                        className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search by name or expertise...",
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value),
                                        className: "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filterDept,
                                        onChange: (e)=>setFilterDept(e.target.value),
                                        className: "rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "All Departments"
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 90,
                                                columnNumber: 15
                                            }, this),
                                            __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityDepartments"].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: d.name,
                                                    children: d.name
                                                }, d.id, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filterAvail,
                                        onChange: (e)=>setFilterAvail(e.target.value),
                                        className: "rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "All Availability"
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 102,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Available",
                                                children: "Available"
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 103,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Limited Capacity",
                                                children: "Limited Capacity"
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 104,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Fully Assigned",
                                                children: "Fully Assigned"
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 105,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Unavailable",
                                                children: "Unavailable"
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 106,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/university/mentors/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-slate-700",
                                children: filtered.length
                            }, void 0, false, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this),
                            " mentor",
                            filtered.length !== 1 ? "s" : "",
                            " found"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/university/mentors/page.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
                        children: filtered.map((mentor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-sm",
                                                children: mentor.avatar
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-bold text-slate-900",
                                                        children: mentor.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-500",
                                                        children: mentor.designation
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-indigo-600 font-medium",
                                                        children: mentor.departmentName
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 126,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${availabilityStyle[mentor.availability]}`,
                                                children: mentor.availability
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-1 mb-3",
                                        children: mentor.expertise.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600",
                                                children: e
                                            }, e, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-1 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-500",
                                                        children: "Capacity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold text-slate-700",
                                                        children: [
                                                            mentor.challengesAssigned,
                                                            "/",
                                                            mentor.maxCapacity,
                                                            " challenges"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-1.5 w-full overflow-hidden rounded-full bg-slate-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `h-1.5 rounded-full transition-all ${mentor.challengesAssigned >= mentor.maxCapacity ? "bg-red-500" : mentor.challengesAssigned >= mentor.maxCapacity - 1 ? "bg-amber-500" : "bg-green-500"}`,
                                                    style: {
                                                        width: `${mentor.challengesAssigned / mentor.maxCapacity * 100}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-2 mb-4 text-center",
                                        children: [
                                            {
                                                label: "Assigned",
                                                value: mentor.challengesAssigned
                                            },
                                            {
                                                label: "Completed",
                                                value: mentor.completedProjects
                                            }
                                        ].map(({ label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl bg-slate-50 py-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-slate-800",
                                                        children: value
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-500",
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, label, true, {
                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelected(mentor),
                                        className: "w-full rounded-xl border border-indigo-200 bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition",
                                        children: "View Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, mentor.id, true, {
                                fileName: "[project]/app/university/mentors/page.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/university/mentors/page.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/university/mentors/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",
                onClick: ()=>setSelected(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-slate-900",
                                    children: "Mentor Profile"
                                }, void 0, false, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 207,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelected(null),
                                    className: "rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/app/university/mentors/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/university/mentors/page.tsx",
                            lineNumber: 206,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-xl font-bold text-white shadow-md",
                                            children: selected.avatar
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 217,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-lg font-bold text-slate-900",
                                                    children: selected.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-500",
                                                    children: selected.designation
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-indigo-600",
                                                    children: selected.departmentName
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 220,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 216,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-600 leading-relaxed",
                                    children: selected.bio
                                }, void 0, false, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 text-sm text-slate-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    size: 14,
                                                    className: "text-slate-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 19
                                                }, this),
                                                selected.email
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    size: 14,
                                                    className: "text-slate-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 19
                                                }, this),
                                                selected.phone
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide",
                                            children: "Expertise"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1.5",
                                            children: selected.expertise.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700",
                                                    children: e
                                                }, e, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 244,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-3 text-center",
                                    children: [
                                        {
                                            label: "Assigned",
                                            value: selected.challengesAssigned
                                        },
                                        {
                                            label: "Capacity",
                                            value: selected.maxCapacity
                                        },
                                        {
                                            label: "Completed",
                                            value: selected.completedProjects
                                        }
                                    ].map(({ label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl bg-slate-50 py-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-slate-800",
                                                    children: value
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-500",
                                                    children: label
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, label, true, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 256,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-slate-700",
                                            children: "Availability"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 270,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-xs font-bold px-3 py-1 rounded-full ${availabilityStyle[selected.availability]}`,
                                            children: selected.availability
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide",
                                            children: "Assigned Challenges"
                                        }, void 0, false, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 280,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityChallenges$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityChallenges"].filter((c)=>c.assignedMentorId === selected.id && c.status !== "Completed").map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0 mr-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold text-slate-800 truncate",
                                                                        children: c.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                                        lineNumber: 292,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-slate-500",
                                                                        children: [
                                                                            c.category,
                                                                            " · ",
                                                                            c.status
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                                        lineNumber: 293,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                                lineNumber: 291,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-indigo-600 flex-shrink-0",
                                                                children: [
                                                                    c.progress,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/university/mentors/page.tsx",
                                                                lineNumber: 295,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, c.id, true, {
                                                        fileName: "[project]/app/university/mentors/page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 23
                                                    }, this)),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$universityChallenges$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["universityChallenges"].filter((c)=>c.assignedMentorId === selected.id && c.status !== "Completed").length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 text-center py-2",
                                                    children: "No active challenges assigned."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/university/mentors/page.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/university/mentors/page.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/university/mentors/page.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/university/mentors/page.tsx",
                            lineNumber: 215,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/university/mentors/page.tsx",
                    lineNumber: 202,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/university/mentors/page.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/university/mentors/page.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(MentorsPage, "Z6R8lNPO/n+vT0Q9Dex7y3EIQO0=");
_c = MentorsPage;
var _c;
__turbopack_context__.k.register(_c, "MentorsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/universityChallenges.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Mail
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "mail",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
                key: "132q7q"
            }
        ],
        [
            "rect",
            {
                x: "2",
                y: "4",
                width: "20",
                height: "16",
                rx: "2",
                key: "izxlao"
            }
        ]
    ]
};
__iconData.node;
const Mail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Phone
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "phone",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
                key: "9njp5v"
            }
        ]
    ]
};
__iconData.node;
const Phone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript) <export default as Phone>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Phone",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Search
]);
/**
 * @license lucide-react v1.42.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "search",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m21 21-4.34-4.34",
                key: "14j7rj"
            }
        ],
        [
            "circle",
            {
                cx: "11",
                cy: "11",
                r: "8",
                key: "4ej97u"
            }
        ]
    ]
};
__iconData.node;
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
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
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_1rfd03z._.js.map