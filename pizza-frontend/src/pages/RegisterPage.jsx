import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, registerAdmin, sendOtp } from "../services/authService";

const RegisterPage = ({ forcedRole }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [adminRegistrationSecret, setAdminRegistrationSecret] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isAdminRegistration = forcedRole === "admin";

    const handleSendOtp = async () => {
        if (!email) {
            setErrorMessage("Please enter an email first");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");
            setStatusMessage("");

            const response = await sendOtp(email);
            setStatusMessage(response.message || "OTP sent to your email!");
            setIsOtpSent(true);
        } catch (error) {
            setErrorMessage(error.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isOtpSent) {
            return setErrorMessage("Please verify your email with OTP first");
        }

        if (!otp) {
            return setErrorMessage("Please enter the OTP");
        }

        if (isAdminRegistration && !adminRegistrationSecret.trim()) {
            return setErrorMessage("Admin registration secret is required");
        }

        try {
            setIsLoading(true);
            setErrorMessage("");
            setStatusMessage("");

            const payload = {
                name,
                email,
                password,
                otp,
                ...(isAdminRegistration ? { adminRegistrationSecret } : {}),
            };

            const response = isAdminRegistration
                ? await registerAdmin(payload)
                : await register(payload);
            setStatusMessage(response.message || "Registration successful. You can now log in.");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        } catch (error) {
            setErrorMessage(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-shell">
            <section className="auth-page-hero">
                <p className="auth-page-kicker">Pizza Delivery</p>
                <h1>{isAdminRegistration ? "Create admin account" : "Create your account"}</h1>
                <p>
                    {isAdminRegistration
                        ? "Register an admin account using OTP and admin registration secret."
                        : "Register, login, and start ordering custom pizzas instantly."}
                </p>
            </section>

            <form className="auth-panel" onSubmit={handleSubmit}>
                <h2>{isAdminRegistration ? "Admin Register" : "Register"}</h2>
                {statusMessage && <p className="auth-feedback auth-feedback-success">{statusMessage}</p>}
                {errorMessage && <p className="auth-feedback auth-feedback-error">{errorMessage}</p>}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {isAdminRegistration && (
                    <input
                        type="password"
                        placeholder="Admin registration secret"
                        value={adminRegistrationSecret}
                        onChange={(event) => setAdminRegistrationSecret(event.target.value)}
                        required
                    />
                )}

                {isOtpSent && (
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        required
                    />
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={handleSendOtp} disabled={isLoading} style={{ flex: 1, backgroundColor: '#555' }}>
                        {isOtpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                    
                    <button type="submit" disabled={isLoading || !isOtpSent} style={{ flex: 1, opacity: (!isOtpSent ? 0.5 : 1) }}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </div>
                
                <p className="auth-mode-note">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                {!isAdminRegistration && (
                    <p className="auth-mode-note">
                        Need admin access? <Link to="/admin/register">Create admin account</Link>
                    </p>
                )}
            </form>
        </div>
    );
};

export default RegisterPage;
