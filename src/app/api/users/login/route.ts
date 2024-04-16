import { connect } from "@/dbConfig/db.config";
import User from "@/models/users.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        // validation
        console.log(reqBody);

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 },
            );
        }

        console.log("User exists in db");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { error: "Check your credentials" },
                { status: 400 },
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            process.env.TOKEN_SECRET!,
            {
                expiresIn: "1d",
            },
        );

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
