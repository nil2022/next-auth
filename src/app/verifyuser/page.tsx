'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function VerifyUserPage() {

    // const router = useRouter();
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios({
                url: "/api/users/verifyuser",
                method: "POST",
                data: {
                    token
                }
            })
            setVerified(true);
            setError(false);
        } catch (error: any) {
            setError(true);
            console.log(error.response.data)
        }
    }

    // this effect runs when the page loads
    useEffect(() => {
        setError(false);
        // extract url from client component
        const urlToken = window.location.search.split('=')[1]
        setToken(urlToken || "")

        // extract token from query params using next router
        // const { query} = router;
        // const urlToken = query.token;
        // ! Check for type String error
        // setToken(urlToken || "")
    }, [])

    // this effect runs when the token changes
    useEffect(() => {
        setError(false);
        if (token.length > 0) {
            verifyUserEmail()
        }
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

        <h1 className="text-4xl">Verify Email</h1>
        <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

        {verified && (
            <div>
                <h2 className="text-2xl">Email Verified</h2>
                <Link href="/login">
                    Login
                </Link>
            </div>
        )}
        {error && (
            <div>
                <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                
            </div>
        )}
    </div>
);
}


