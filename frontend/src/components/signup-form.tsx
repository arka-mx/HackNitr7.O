import React from "react"
import { useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/firebase"
import { useAuth } from "@/context/AuthContext"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");

    const navigate = useNavigate();

    const { login } = useAuth(); // Get login from context

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Direct Signup Success - Login and Redirect
                login(data.token, data.user);
                navigate("/dashboard");
            } else {
                setErrorMessage(data.error || "Signup failed");
            }

        } catch (error: any) {
            console.error("Signup error:", error);
            setErrorMessage("Failed to connect to server");
        }
    };

    const handleGoogleSignup = async () => {
        setErrorMessage(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await response.json();
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                console.error("Backend verification failed:", errorData);
                setErrorMessage(`Signup verification failed: ${errorData.details || errorData.error || 'Unknown error'}`);
            }

        } catch (error: any) {
            console.error("user closed the pop up window");
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-6">
                <div className="mx-auto grid w-[350px] gap-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Create an account</h1>
                        <p className="text-balance text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>
                    <form className={cn("grid gap-4", className)} {...props} onSubmit={handleSignup}>
                        {errorMessage && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                {errorMessage}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full h-8">
                            Sign Up
                        </Button>
                        <div className="flex items-center gap-4 my-2">
                            <div className="h-[1px] flex-1 bg-gray-300" />
                            <span className="text-muted-foreground text-sm">
                                Or continue with
                            </span>
                            <div className="h-[1px] flex-1 bg-gray-300" />
                        </div>
                        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignup}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign up with Google
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <a href="/" className="underline underline-offset-4">
                            Login
                        </a>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                {/* Blank black image for demo purposes */}
                <img
                    src="https://wallpapershome.com/images/pages/pic_h/26426.jpg"
                    alt="Background"
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    )
}
