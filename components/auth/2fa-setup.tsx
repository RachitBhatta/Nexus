"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Check, CheckCircle2, Copy, Loader2, AlertTriangle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const BACKUP_CODES_SESSION_KEY = "nexus_2fa_backup_codes";

export default function TwoFASetup() {
    const router = useRouter();
    const [qrCode, setQrCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [secret, setSecret] = useState<string>("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [step, setStep] = useState<"setup" | "verify" | "complete">("setup");
    const [copiedCode, setCopiedCode] = useState<string>("");
    const [codesDownloaded, setCodesDownloaded] = useState(false);
    const [initialSetupData, setInitialSetupData] = useState<{
        qrCode: string;
        secret: string;
    } | null>(null);

    // ✅ FIX 1: Restore backup codes from sessionStorage on mount
    useEffect(() => {
        const savedCodes = sessionStorage.getItem(BACKUP_CODES_SESSION_KEY);
        if (savedCodes) {
            try {
                const codes = JSON.parse(savedCodes);
                setBackupCodes(codes);
                setStep("complete");
            } catch (err) {
                console.error("Failed to restore backup codes:", err);
            }
        }
    }, []);

    // ✅ FIX 2: Warn before page unload if backup codes not downloaded
    useEffect(() => {
        if (step === "complete" && backupCodes.length > 0 && !codesDownloaded) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = "You haven't downloaded your backup codes yet. Are you sure you want to leave?";
                return e.returnValue;
            };

            window.addEventListener("beforeunload", handleBeforeUnload);
            return () => window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [step, backupCodes, codesDownloaded]);

    // ✅ FIX 3: Initialize setup ONCE and preserve data
    useEffect(() => {
        if (step === "setup" && !initialSetupData) {
            initialize2FASetup();
        } else if (step === "setup" && initialSetupData) {
            // Restore previous setup data when going back
            setQrCode(initialSetupData.qrCode);
            setSecret(initialSetupData.secret);
        }
    }, [step, initialSetupData]);

    const initialize2FASetup = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch("/api/auth/2fa/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ FIX 4: Include cookies
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to setup two factor authentication");
            }

            // ✅ FIX 3: Store initial setup data
            const setupData = {
                qrCode: result.qrCode,
                secret: result.secret,
            };
            setInitialSetupData(setupData);
            setQrCode(result.qrCode);
            setSecret(result.secret);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const verify2FA = async () => {
        if (verificationCode.length !== 6) {
            setError("Please enter 6-digit code");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ FIX 4: Include cookies
                body: JSON.stringify({ twoFACode: verificationCode }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Invalid Verification Code");
            }

            const codes = result.backupCodes;
            if (!codes || codes.length === 0) {
                throw new Error("Backup codes were not returned. Please contact support.");
            }
            setBackupCodes(codes);
            sessionStorage.setItem(BACKUP_CODES_SESSION_KEY, JSON.stringify(codes));
            setStep("complete");

        } catch (error) {
            setError(error instanceof Error ? error.message : "Verification Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(""), 2000);
        } catch (error) {
            console.log("Failed to copy", error);
        }
    };

    const downloadBackupCodes = () => {
        const content = backupCodes.join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Nexus-2fa-backup-codes.txt";
        a.click();
        URL.revokeObjectURL(url);

        // ✅ Mark as downloaded
        setCodesDownloaded(true);
    };

    const handleDone = () => {
        if (!codesDownloaded) {
        const confirmLeave = confirm(
            "You haven't downloaded your backup codes. If you lose access to your authenticator, you won't be able to recover your account. Continue anyway?"
        );
        if (!confirmLeave) return;
    }
        // ✅ Clear backup codes from sessionStorage
        sessionStorage.removeItem(BACKUP_CODES_SESSION_KEY);
        // ✅ FIX 5: Use Next.js router instead of window.location
        router.push("/settings/security");
    };

    // ✅ FIX 3: Show warning when going back
    const handleBackToSetup = () => {
        const confirmBack = confirm(
            "Going back will generate a NEW QR code. If you already scanned the previous code, you'll need to scan the new one. Continue?"
        );
        if (confirmBack) {
            // Reset to generate new setup
            setInitialSetupData(null);
            setQrCode("");
            setSecret("");
            setVerificationCode("");
            setStep("setup");
        }
    };

    if (step === "setup") {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Enable Two-Factor Authentication</CardTitle>
                    <CardDescription>Scan the QR code with your authenticator app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {qrCode && (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="bg-white p-4 rounded-lg">
                                        <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                                    </div>

                                    <div className="w-full space-y-2">
                                        <p className="text-sm text-muted-foreground text-center">
                                            Can't scan? Enter this code manually:
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Input value={secret} readOnly className="font-mono text-center" />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard(secret, "secret")}
                                            >
                                                {copiedCode === "secret" ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button onClick={() => setStep("verify")} className="w-full">
                                        Continue to Verification
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        );
    }

    if (step === "verify") {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Verify Authentication Code</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code from your authenticator app
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="000000"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                            className="text-center text-2xl tracking-widest"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleBackToSetup}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={verify2FA}
                            disabled={isLoading || verificationCode.length !== 6}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Enable"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-center">2FA Enabled Successfully!</CardTitle>
                <CardDescription className="text-center">
                    Save these backup codes in a secure location
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* ✅ Warning if not downloaded */}
                {!codesDownloaded && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Important:</strong> Download your backup codes now. You won't be able to see
                            them again!
                        </AlertDescription>
                    </Alert>
                )}

                <Alert>
                    <AlertDescription>
                        Use these codes if you lose access to your authenticator app. Each code can only be
                        used once.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded font-mono text-sm"
                        >
                            <span>{code}</span>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => copyToClipboard(code, `code-${index}`)}
                            >
                                {copiedCode === `code-${index}` ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                    ))}
                </div>

                <Button onClick={downloadBackupCodes} variant="outline" className="w-full">
                    {codesDownloaded ? "✓ Downloaded" : "Download Backup Codes"}
                </Button>

                <Button onClick={handleDone} className="w-full">
                    Done
                </Button>
            </CardContent>
        </Card>
    );
}