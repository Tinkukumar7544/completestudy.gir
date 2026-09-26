import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as Route$18, t as AccountForm } from "./router-B0Z9kZGU.mjs";
import { i as signOut, r as signIn } from "./client-CVqXY6bk.mjs";
import { c as UserPlus, h as Smartphone } from "../_libs/lucide-react.mjs";
import { t as GROK_PROVIDERS } from "./server-YrZHZ2cB.mjs";
import { A as formatAccountLabel, H as Button, R as useCurrentUserState, W as cn } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CEaNPVRG.js
var import_jsx_runtime = require_jsx_runtime();
function Separator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-px w-full bg-border", className),
		...props
	});
}
function Login() {
	const { mode, via } = Route$18.useSearch();
	const navigate = useNavigate();
	const { user } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-canvas relative min-h-dvh text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "relative z-10 flex h-14 items-center border-b border-bar-foreground/10 bg-bar px-4 text-bar-foreground shadow-dock",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold tracking-tight",
				children: "SetPaper"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "relative z-10 mx-auto max-w-md px-4 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-3d grid gap-6 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-btn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-6" })
					}),
					user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: "You are signed in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"This collection is saved to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: formatAccountLabel(user.primaryEmail)
									}),
									"."
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void navigate({ to: "/" }),
								children: "Continue to Tests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									signOut("/login").catch(() => void 0);
								},
								children: "Use a different account"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "Create account or sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Use an email ID or a mobile number. A new account keeps your tests, notes, and scores permanently."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountForm, {
							idPrefix: "login",
							defaultMode: mode,
							defaultVia: via,
							onSuccess: () => {
								navigate({ to: "/" });
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "or"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
								children: ["Continue with ", p.label]
							}, p.providerId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "mt-0.5 size-3.5 shrink-0" }), "Mobile accounts use your number + password. No SMS code is sent."]
						})
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm text-primary underline-offset-4 hover:underline",
						children: "Back to Tests"
					})
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
