import type { CSSProperties } from "react";

const outlineButtonStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "0.5rem",
	width: "100%",
	padding: "0.5rem 1rem",
	borderRadius: "0.375rem",
	border: "1px solid",
	borderColor: "color-mix(in srgb, currentColor 20%, transparent)",
	background: "transparent",
	color: "inherit",
	fontSize: "0.875rem",
	fontWeight: 500,
	cursor: "pointer",
	fontFamily: "inherit",
};

const inputStyle: CSSProperties = {
	width: "100%",
	padding: "0.5rem 0.75rem",
	borderRadius: "0.375rem",
	border: "1px solid",
	borderColor: "color-mix(in srgb, currentColor 20%, transparent)",
	background: "transparent",
	color: "inherit",
	fontSize: "0.9375rem",
	fontFamily: "inherit",
	boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
	display: "block",
	marginBottom: "0.25rem",
	fontSize: "0.875rem",
	fontWeight: 500,
	color: "inherit",
};

const primaryBtnStyle: CSSProperties = {
	padding: "0.5rem 1rem",
	borderRadius: "0.375rem",
	border: "none",
	background: "#2563eb",
	color: "#fff",
	fontSize: "0.9375rem",
	fontWeight: 500,
	cursor: "pointer",
	width: "100%",
	fontFamily: "inherit",
};

export function LoginButton() {
	return (
		<button type="button" style={outlineButtonStyle}>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<rect width="20" height="16" x="2" y="4" rx="2" />
				<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
			</svg>
			<span>Email &amp; Password</span>
		</button>
	);
}

export function LoginForm() {
	return (
		<div style={{ width: "100%" }}>
			<form method="POST" action="/_emdash/api/auth/email-password/login" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", color: "inherit" }}>
				<div>
					<label htmlFor="ep-email" style={labelStyle}>Email</label>
					<input id="ep-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" style={inputStyle} />
				</div>
				<div>
					<label htmlFor="ep-password" style={labelStyle}>Password</label>
					<input id="ep-password" name="password" type="password" required autoComplete="current-password" placeholder="Enter your password" style={inputStyle} />
				</div>
				<div id="ep-login-error" style={{ display: "none", color: "#ef4444", fontSize: "0.8125rem", padding: "0.375rem 0" }}></div>
				<button type="submit" style={primaryBtnStyle}>Sign in with Email</button>
			</form>
			<script dangerouslySetInnerHTML={{ __html: `(function(){var e=document.getElementById('ep-login-error');var p=new URLSearchParams(window.location.search);if(p.get('error')==='invalid_credentials'){var m=p.get('message');if(m){e.textContent=m;e.style.display='block'}}})()` }} />
		</div>
	);
}

interface SetupStepProps {
	onComplete: () => void;
}

export function SetupStep({ onComplete }: SetupStepProps) {
	const formId = "ep-setup-form-" + Math.random().toString(36).slice(2, 8);
	const errorId = "ep-setup-error-" + Math.random().toString(36).slice(2, 8);
	const submitId = "ep-setup-submit-" + Math.random().toString(36).slice(2, 8);

	return (
		<div style={{ width: "100%" }}>
			<form id={formId} method="POST" action="/_emdash/api/auth/email-password/login" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", color: "inherit" }}>
				<input type="hidden" name="setup" value="true" />
				<div>
					<label htmlFor={formId + "-name"} style={labelStyle}>Name</label>
					<input id={formId + "-name"} name="name" type="text" required placeholder="Admin Name" style={inputStyle} />
				</div>
				<div>
					<label htmlFor={formId + "-email"} style={labelStyle}>Email</label>
					<input id={formId + "-email"} name="email" type="email" required autoComplete="email" placeholder="admin@example.com" style={inputStyle} />
				</div>
				<div>
					<label htmlFor={formId + "-password"} style={labelStyle}>Password</label>
					<input id={formId + "-password"} name="password" type="password" required autoComplete="new-password" placeholder="Min. 8 characters" style={inputStyle} />
				</div>
				<div>
					<label htmlFor={formId + "-confirm"} style={labelStyle}>Confirm Password</label>
					<input id={formId + "-confirm"} type="password" required autoComplete="new-password" placeholder="Repeat your password" style={inputStyle} />
				</div>
				<div id={errorId} style={{ display: "none", color: "#ef4444", fontSize: "0.8125rem", padding: "0.375rem 0" }}></div>
				<button id={submitId} type="submit" style={primaryBtnStyle}>Create Admin Account</button>
			</form>
			<script dangerouslySetInnerHTML={{ __html:
				`(function(){var f=document.getElementById('${formId}');if(!f)return;var e=document.getElementById('${errorId}');var b=document.getElementById('${submitId}');var p=new URLSearchParams(window.location.search);var m=p.get('message');if(m&&(p.get('error')==='email_exists'||p.get('error')==='missing_name')){e.textContent=m;e.style.display='block'}` +
				`f.addEventListener('submit',function(ev){ev.preventDefault();var pw=f.querySelector('[name=password]').value;var cp=f.querySelector('[id$=confirm]').value;if(pw!==cp){e.textContent='Passwords do not match';e.style.display='block';return}if(pw.length<8){e.textContent='Password must be at least 8 characters';e.style.display='block';return}b.disabled=true;b.textContent='Creating account...';var fd=new FormData(f);fetch(f.action,{method:'POST',body:new URLSearchParams(fd).toString(),headers:{'Content-Type':'application/x-www-form-urlencoded'},redirect:'manual'}).then(function(r){if(r.type==='opaqueredirect'||r.status===302||r.redirected){` + (typeof onComplete === 'function' ? 'onComplete()' : '') + `;return}return r.json().catch(function(){return null})}).then(function(d){if(d&&d.error){e.textContent=d.error;e.style.display='block';b.disabled=false;b.textContent='Create Admin Account'}}).catch(function(){e.textContent='Network error. Please try again.';e.style.display='block';b.disabled=false;b.textContent='Create Admin Account'})})})()` }}
			/>
		</div>
	);
}
