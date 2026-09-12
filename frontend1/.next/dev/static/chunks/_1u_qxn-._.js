(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/context/IndustryContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndustryProvider",
    ()=>IndustryProvider,
    "useIndustry",
    ()=>useIndustry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$industryMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/industryMockData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const IndustryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function IndustryProvider({ children }) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$industryMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["industryMockData"]);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IndustryContext.Provider, {
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
_s(IndustryProvider, "oY4PqLaQReEWIx6s0DjVdSxCO+M=");
_c = IndustryProvider;
function useIndustry() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(IndustryContext);
    if (context === undefined) {
        throw new Error("useIndustry must be used within an IndustryProvider");
    }
    return context;
}
_s1(useIndustry, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "IndustryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/industryMockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
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
]);

//# sourceMappingURL=_1u_qxn-._.js.map